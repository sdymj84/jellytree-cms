import React, { Component, Fragment } from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { Button, Icon, Modal, Header, Loader } from 'semantic-ui-react'
import _ from 'lodash'
import styled from 'styled-components'
import axios from 'axios'
import uuidv1 from 'uuid/v1'
import Columns from './Columns'

const Container = styled.div`
  .rt-td {
    padding: 0;
    padding-bottom: 0.2px;
  }
  i.icon.angle.right,
  i.icon.angle.down {
    font-size: 1.1em;
    margin: 4px 2px;
    padding: 6px 10px;
  }
`
const StyledButton = styled(Button)`
  &&& {
    margin: 1em 2em 1em 0;
  }
`


export class ProductTable extends Component {
  state = {
    modalOpen: false,
    isSaving: false,
    saveResultMsg: [],
    isResultError: false,
    data: [],
    deletedDocIds: [],
    columns: [],
    variationColumns: [],
  }

  // When component mounts, get data from db > reorganize data > save to state
  async componentDidMount() {
    try {
      const res = await axios.get('https://us-central1-jellytree-3cb33.cloudfunctions.net/listProducts')
      console.log(res.data)
      const data = _.map(res.data, product => {
        const variations = _.map(product.variations, variation => ({
          ...variation,
          bulletPoints1: variation.bulletPoints[0],
          bulletPoints2: variation.bulletPoints[1],
          bulletPoints3: variation.bulletPoints[2],
          bulletPoints4: variation.bulletPoints[3],
          bulletPoints5: variation.bulletPoints[4],
          image1: variation.images[0],
          image2: variation.images[1],
          image3: variation.images[2],
          image4: variation.images[3],
          image5: variation.images[4],
          image6: variation.images[5],
          image7: variation.images[6],
        }))
        return {
          ...product,
          bulletPoints1: product.bulletPoints[0],
          bulletPoints2: product.bulletPoints[1],
          bulletPoints3: product.bulletPoints[2],
          bulletPoints4: product.bulletPoints[3],
          bulletPoints5: product.bulletPoints[4],
          variations,
        }
      })

      this.setState({ data })
    } catch (e) {
      console.log("Error getting products data")
      this.showError(e)
    }
  }

  // Column component mounts > call this and get column data from Columns
  // and apply to ReactTable component
  getColumns = (columns, variationColumns) => {
    this.setState({ columns, variationColumns })
  }

  // Save data to state when cell blur
  handleCellBlur = (e, product, column) => {
    const data = [...this.state.data];
    _.forEach(data, (item) => {
      if (item.id === product.id) {
        item[column] = e.target.innerText
      }
      if (item.sku === product.parentSku) {
        _.forEach(item.variations, vItem => {
          if (vItem.sku === product.sku) {
            vItem[column] = e.target.innerText
          }
        })
      }
    })
    this.setState({ data });
  }

  // Validate when saving if any required data is empty
  validateData = (data) => {
    this.setState({
      modalOpen: true,
    })
    try {
      const errorMessages = []
      data.forEach(product => {
        if (product.sku.trim() === "") {
          errorMessages.push("SKU is required for parent products")
        }
        if (product.category.trim() === "") {
          errorMessages.push("Category is required")
        }
        if (product.title.trim() === "") {
          errorMessages.push("Title is required")
        }

        product.variations.forEach(variation => {
          if (variation.sku.trim() === "") {
            errorMessages.push("SKU is required for variations")
          }
          if (variation.pid.trim() === "") {
            errorMessages.push("Product ID is required for variations")
          }
          if (variation.pidType.trim() === "") {
            errorMessages.push("Product ID Type is required for variations")
          }
          if (variation.title.trim() === "") {
            errorMessages.push("Title is required for variations")
          }
          if (variation.color.trim() === "") {
            errorMessages.push("Color is required for variations")
          }
          if (!variation.colorMap.length) {
            errorMessages.push("Color Map is required for variations")
          }
          if (variation.size.trim() === "") {
            errorMessages.push("Size is required for variations")
          }
          if (!variation.sizeMap.length) {
            errorMessages.push("Size Map is required for variations")
          }
          if (!variation.material.length) {
            errorMessages.push("Material is required for variations")
          }
          if (variation.thumbnail.trim() === "") {
            errorMessages.push("Thumbnail is required for variations")
          }
          if (variation.mainImage.trim() === "") {
            errorMessages.push("Main Image is required for variations")
          }
          if (variation.stock.trim() === "") {
            errorMessages.push("Stock is required for variations")
          }
          if (variation.price.trim() === "") {
            errorMessages.push("Price is required for variations")
          }
          if (!/^(0|[1-9]\d*)$/.test(variation.stock.trim())) {
            errorMessages.push("Stock should be a positive integer")
          }
          if (!/^(0|[1-9]\d*)\.[0-9]{2}$/.test(variation.price.trim())) {
            errorMessages.push("Price is incorrectly formatted - please indicate two digits of cents followed by dot (.) (ex. 12.99)")
          }
          if (Number(variation.price) === 0) {
            errorMessages.push("Price of 0 is not allowed")
          }
        })
      })
      if (_.uniqBy(data, 'sku').length !== data.length) {
        errorMessages.push("Found duplicated SKU that has to be unique")
      }

      if (errorMessages.length) {
        throw new Error(_.uniq(errorMessages))
      }
      return true
    } catch (e) {
      console.log('Warning on front end')
      this.showError(e)
      return false
    }
  }

  // Calculate stock, soldCount, minPrice, maxPrice
  // Copy bulletPoints, images into array
  reorganizeData = (data) => {
    data.forEach(product => {
      product.bulletPoints = [
        product.bulletPoints1,
        product.bulletPoints2,
        product.bulletPoints3,
        product.bulletPoints4,
        product.bulletPoints5,
      ]
      _.remove(product.bulletPoints, bp => !bp)
      product.stock = 0
      product.colorMap = []
      product.sizeMap = []

      if (product.variations.length) {
        const minPrice = _.minBy(product.variations, v => Number(v.price)).price
        if (minPrice) {
          product.minPrice = minPrice
        }
        const maxPrice = _.maxBy(product.variations, v => Number(v.price)).price
        if (maxPrice) {
          product.maxPrice = maxPrice
        }
        product.frontProductSku = _.maxBy(product.variations, 'soldCount').sku
      }

      product.variations.forEach(variation => {
        variation.bulletPoints = [
          variation.bulletPoints1,
          variation.bulletPoints2,
          variation.bulletPoints3,
          variation.bulletPoints4,
          variation.bulletPoints5,
        ]
        _.remove(variation.bulletPoints, bp => !bp)
        variation.images = [
          variation.image1,
          variation.image2,
          variation.image3,
          variation.image4,
          variation.image5,
          variation.image6,
          variation.image7,
        ]
        _.remove(variation.images, image => !image)
        variation.parentSku = product.sku
        variation.stock = variation.stock.trim()
        variation.price = variation.price.trim()
        product.stock = Number(product.stock) + Number(variation.stock)
        product.colorMap.push(...variation.colorMap)
        product.colorMap = _.uniq(product.colorMap)
        product.sizeMap.push(...variation.sizeMap)
        product.sizeMap = _.uniq(product.sizeMap)
      })
    })
    return data
  }

  // Show error
  showError = (e) => {
    let errorMsg = e.response
      ? e.response.data.message
      : e.message
    errorMsg = errorMsg.split(',')

    this.setState({
      modalOpen: true,
      isSaving: false,
      isResultError: true,
      saveResultMsg: errorMsg
    })
  }

  // Set each cell's styles (.rt-td)
  setTdStyles = (state, rowInfo, column) => {
    let styles = ""
    if (rowInfo) {
      styles = {
        border: '1px solid #439e92',
        borderRadius: '3px',
      }
      if (column.id === 'colorMap' || column.id === 'sizeMap') {
        styles = {
          ...styles,
          overflow: 'visible',
        }
      }
    } else {
      styles = {
        border: 'none',
      }
    }
    return {
      style: styles
    }
  }

  // AddVar button event handler
  handleAddVarClick = (props) => {
    const { id, sku } = props.original

    if (sku === "") {
      this.showError(new Error("Please enter SKU to create variations"))
      return
    }

    this.setState(prevState => ({
      data: _.map(prevState.data, product => {
        if (product.id === id) {
          const newProduct = {
            ...product,
            variations: [
              ...product.variations,
              {
                sku: '',
                parentSku: props.original.sku,
                pid: '',
                pidType: '',
                title: '',
                color: '',
                colorMap: [],
                size: '',
                sizeMap: [],
                material: [],
                bulletPoints: [],
                stock: '0',
                soldCount: '0',
                price: '0',
                thumbnail: '',
                mainImage: '',
                images: [],
              },
            ]
          }
          return newProduct
        } else {
          return product
        }
      })
    }))
  }

  // Save button event handler
  handleSaveClick = async () => {
    const data = this.state.data
    this.setState({ isSaving: true })

    // Validate if any requried data is empty
    if (!this.validateData(data)) {
      return
    }
    // Calculate and reorganize some data
    const newData = this.reorganizeData(data)

    const deletedDocIds = this.state.deletedDocIds

    try {
      const res = await axios.post('https://us-central1-jellytree-3cb33.cloudfunctions.net/setProducts',
        { data: newData, deletedDocIds })
      console.log(res)
      this.setState({
        isSaving: false,
        isResultError: false,
        saveResultMsg: "Successfully Saved!",
        data: newData,
      })
    } catch (e) {
      this.showError(e)
    }
  }

  // New button event handler
  handleNewClick = () => {
    this.setState(prevState => ({
      data: [{
        id: uuidv1(),
        sku: '',
        pid: '',
        pidType: '',
        category: '',
        title: '',
        colorMap: [],
        sizeMap: [],
        bulletPoints: [],
        stock: '0',
        soldCount: '0',
        minPrice: '0',
        maxPrice: '0',
        variations: [],
      }, ...prevState.data]
    }))
  }

  // Delete button event handler
  handleDeleteClick = (props) => {
    const parentSku = props.original.parentSku
    const sku = props.original.sku
    const data = this.state.data
    let newData = []

    // when deleting parent product
    if (!parentSku) {
      newData = _.filter(data, product => {
        if (product.sku !== sku) {
          return true
        }
        this.setState(prevState => ({
          deletedDocIds: [...prevState.deletedDocIds, product.id]
        }), () => console.log(this.state))
      })
    }
    // when deleting child product
    else {
      newData = _.map(data, product => {
        if (product.sku === parentSku) {
          const newVariations = _.filter(product.variations, vItem => vItem.sku !== sku)
          return {
            ...product,
            variations: newVariations
          }
        } else {
          return product
        }
      })
    }
    this.setState({ data: newData })
  }

  handleDropdownChange = (value, product, column) => {
    const data = [...this.state.data];
    _.forEach(data, (item) => {
      if (item.sku === product.parentSku) {
        _.forEach(item.variations, vItem => {
          if (vItem.sku === product.sku) {
            vItem[column] = value
          }
        })
      }
    })
    this.setState({ data })
  }

  handleModalClose = () => {
    this.setState({ modalOpen: false })
  }

  render() {
    const { data } = this.state;
    return (
      <Container>
        <div
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
          <div
            style={{
              marginLeft: '4em',
            }}>
            <span style={{ color: 'red' }}>*</span>
            {' '}is required field to save
          </div>
          <div>
            <StyledButton
              color="blue"
              onClick={this.handleNewClick}>
              NEW
            </StyledButton>
            <StyledButton
              color="green"
              onClick={this.handleSaveClick}>
              SAVE
          </StyledButton>
          </div>
        </div>
        <ReactTable
          data={data}
          columns={this.state.columns}
          defaultPageSize={10}
          className="-striped -highlight"
          minRows={5}
          filterable
          getTdProps={(state, rowInfo) => {
            return {
              style: {
                border: rowInfo
                  ? '1px solid #439e92'
                  : 'none',
                borderRadius: '3px',
              }
            }
          }}
          collapseOnDataChange={false}
          ExpanderComponent={row => {
            if (!row.original.variations.length) {
              return <div></div>
            } else {
              return (typeof row.isExpanded === 'undefined' || row.isExpanded === false)
                ? <Icon name="angle right" />
                : <Icon name="angle down" />
            }
          }}
          SubComponent={row => {
            if (!row.original.variations.length) {
              return null
            }
            return (
              <div style={{ padding: '20px' }}>
                <ReactTable
                  data={_.find(this.state.data, { 'sku': row.original.sku }).variations}
                  columns={this.state.variationColumns}
                  minRows={10}
                  defaultPageSize={10}
                  noDataText={"No variations"}
                  showPagination={false}
                  getTdProps={this.setTdStyles}
                />
              </div>
            )
          }}
        />

        <Columns
          handleCellBlur={this.handleCellBlur}
          handleAddVarClick={this.handleAddVarClick}
          handleDeleteClick={this.handleDeleteClick}
          handleDropdownChange={this.handleDropdownChange}
          getColumns={this.getColumns} />
        <Modal
          open={this.state.modalOpen}
          onClose={!this.state.isSaving ? this.handleModalClose : null}
          basic
          size={this.state.isResultError ? "tiny" : "mini"}
        >
          {this.state.isSaving
            ? <Loader size='massive'>Saving...</Loader>
            : <Fragment>
              {(this.state.saveResultMsg.constructor === Array)
                ? this.state.saveResultMsg.map((msg, i) =>
                  <Header
                    key={i}
                    size="huge"
                    icon={this.state.isResultError ? "warning sign" : "save outline"}
                    content={msg} />
                )
                : <Header
                  size="huge"
                  icon={this.state.isResultError ? "warning sign" : "save outline"}
                  content={this.state.saveResultMsg} />}
              <Modal.Actions>
                <Button color='green' onClick={this.handleModalClose} inverted>
                  <Icon name='checkmark' /> Got it
                </Button>
              </Modal.Actions>
            </Fragment>}
        </Modal>
      </Container>
    );
  }
}

export default ProductTable
