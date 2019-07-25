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
  text-align: right;
  .rt-td {
    padding: 4px 5px;
    text-align: left;
    border-radius: 3px;
    font-size: 1.1em;
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
    saveResultMsg: "",
    isResultError: false,
    data: [],
    deletedDocIds: [],
    columns: [],
    variationColumns: [],
  }

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
      console.log("Error getting products data", e)
    }
  }



  renderEditable = (cellInfo) => {
    const product = cellInfo.original
    const column = cellInfo.column.id
    return (
      <div
        style={{
          outline: 'none',
          height: '100%',
          paddingTop: '3px',
        }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
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
        }}
        dangerouslySetInnerHTML={{
          __html: product[column]
        }}
      />
    );
  }




  getColumns = (columns, variationColumns) => {
    this.setState({ columns, variationColumns })
  }


  validateData = () => {

  }

  showError = (e) => {
    const errorMsg = e.response
      ? e.response.data.message
      : e.message
    this.setState({
      modalOpen: true,
      isSaving: false,
      isResultError: true,
      saveResultMsg: errorMsg
    })
  }


  handleAddVarClick = (props) => {
    try {
      this.state.data.forEach(product => {
        if (product.sku.trim() === "") {
          throw new Error("Please enter parent SKU to add variations.")
        }
      })

      const { id } = props.original
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
                  stock: 0,
                  soldCount: 0,
                  price: '',
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
    } catch (e) {
      this.showError(e)
    }
  }

  handleSaveClick = async () => {
    const data = this.state.data
    this.setState({
      modalOpen: true,
      isSaving: true,
    })
    try {
      data.forEach(product => {
        if (product.sku.trim() === "") {
          throw new Error("SKU cannot be empty")
        }
      })
      data.forEach(product => {
        product.bulletPoints = [
          product.bulletPoints1,
          product.bulletPoints2,
          product.bulletPoints3,
          product.bulletPoints4,
          product.bulletPoints5,
        ]
        product.variations.forEach(variation => {
          variation.bulletPoints = [
            variation.bulletPoints1,
            variation.bulletPoints2,
            variation.bulletPoints3,
            variation.bulletPoints4,
            variation.bulletPoints5,
          ]
        })
      })
      const res = await axios.post('https://us-central1-jellytree-3cb33.cloudfunctions.net/setProducts', data)
      console.log(res)
      this.setState({
        isSaving: false,
        isResultError: false,
        saveResultMsg: "Successfully Saved!"
      })
    } catch (e) {
      this.showError(e)
    }
  }

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
        stock: 0,
        soldCount: 0,
        minPrice: 0,
        maxPrice: 0,
        variations: [],
      }, ...prevState.data]
    }))
  }

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

  handleModalClose = () => {
    this.setState({ modalOpen: false })
  }


  render() {
    const { data } = this.state;
    return (
      <Container>
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
                  data={_.find(this.state.data, { 'pid': row.original.pid }).variations}
                  columns={this.state.variationColumns}
                  minRows={10}
                  defaultPageSize={10}
                  noDataText={"No variations"}
                  showPagination={false}
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
                />
              </div>
            )
          }}
        />

        <Columns
          renderEditable={this.renderEditable}
          handleAddVarClick={this.handleAddVarClick}
          handleDeleteClick={this.handleDeleteClick}
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
              <Header
                size="huge"
                icon={this.state.isResultError ? "warning sign" : "save outline"}
                content={this.state.saveResultMsg} />
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
