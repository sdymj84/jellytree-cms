import React, { Component, Fragment } from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { Button, Icon, Modal, Header, Loader } from 'semantic-ui-react'
import _ from 'lodash'
import styled from 'styled-components'
import axios from 'axios'
import uuidv1 from 'uuid/v1'

const BULLET_WIDTH = 200
const TITLE_WIDTH = 500

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
const BasicInfo = styled.div`
  background-color: #eab9b9;
  box-shadow: 0 0 5px 5px #eab9b9;
`
const BulletPoints = styled.div`
  background-color: #b2e8b8;
  box-shadow: 0 0 5px 5px #b2e8b8;
`
const Inventory = styled.div`
  background-color: #b2c4ea;
  box-shadow: 0 0 5px 5px #b2c4ea;
`
const Images = styled.div`
  background-color: #e2e2a3;
  box-shadow: 0 0 5px 5px #e2e2a3;
`
const Actions = styled.div`
  background-color: #e8c4a2;
  box-shadow: 0 0 5px 5px #e8c4a2;
`





export class ProductTable extends Component {
  state = {
    modalOpen: false,
    isSaving: false,
    saveResultMsg: "",
    data: []
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
          backgroundColor: "#fafafa",
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
              item[column] = e.target.innerHTML
            }
            if (item.sku === product.parentSku) {
              _.forEach(item.variations, vItem => {
                if (vItem.sku === product.sku) {
                  vItem[column] = e.target.innerHTML
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





  columns = [
    {
      Header: <BasicInfo>Basic Info</BasicInfo>,
      columns: [
        {
          Header: 'SKU',
          accessor: 'sku',
          Cell: this.renderEditable,
        },
        {
          Header: 'Product ID',
          accessor: 'pid',
          Cell: this.renderEditable,
        },
        {
          Header: 'Product ID Type',
          accessor: 'pidType',
          Cell: this.renderEditable,
        },
        {
          Header: 'Category',
          accessor: 'category',
          Cell: this.renderEditable,
        },
        {
          Header: 'Title',
          accessor: 'title',
          minWidth: TITLE_WIDTH,
          Cell: this.renderEditable,
        },
        {
          Header: 'Color Map',
          accessor: 'colorMap',
          Cell: this.renderEditable,
        },
        {
          Header: 'Size Map',
          accessor: 'sizeMap',
          Cell: this.renderEditable,
        },
      ]
    },
    {
      Header: <BulletPoints>Bullet Points</BulletPoints>,
      columns: [
        {
          Header: 'Bullet 1',
          accessor: 'bulletPoints1',
          minWidth: BULLET_WIDTH,
          Cell: this.renderEditable,
        },
        {
          Header: 'Bullet 2',
          accessor: 'bulletPoints2',
          minWidth: BULLET_WIDTH,
          Cell: this.renderEditable,
        },
        {
          Header: 'Bullet 3',
          accessor: 'bulletPoints3',
          minWidth: BULLET_WIDTH,
          Cell: this.renderEditable,
        },
        {
          Header: 'Bullet 4',
          accessor: 'bulletPoints4',
          minWidth: BULLET_WIDTH,
          Cell: this.renderEditable,
        },
        {
          Header: 'Bullet 5',
          accessor: 'bulletPoints5',
          minWidth: BULLET_WIDTH,
          Cell: this.renderEditable,
        },
      ]
    },
    {
      Header: <Inventory>Inventory</Inventory>,
      columns: [
        {
          Header: 'Stock',
          accessor: 'stock',
          Cell: this.renderEditable,
        },
        {
          Header: 'Sold Count',
          accessor: 'soldCount',
          Cell: this.renderEditable,
        },
        {
          Header: 'MIN Price',
          accessor: 'minPrice',
          Cell: this.renderEditable,
        },
        {
          Header: 'MAX Price',
          accessor: 'maxPrice',
          Cell: this.renderEditable,
        },
      ]
    },
    {
      Header: <Actions>Actions</Actions>,
      columns: [
        {
          Header: 'Actions',
          accessor: 'actions',
          minWidth: 200,
          style: {
            textAlign: 'center'
          },
          Cell: props =>
            <div>
              <Button
                color="blue" size="mini"
                onClick={() => this.handleAddVarClick(props)}>
                ADD VAR
              </Button>
              <Button
                color="red" size="mini"
                onClick={() => this.handleDeleteClick(props)}>
                DELETE
              </Button>
            </div>
        }
      ]
    }
  ]







  variationColumns = [
    {
      Header: <BasicInfo>Basic Info</BasicInfo>,
      columns: [
        {
          Header: 'SKU',
          accessor: 'sku',
          Cell: this.renderEditable,
        },
        {
          Header: 'Product ID',
          accessor: 'pid',
          Cell: this.renderEditable,
        },
        {
          Header: 'Product ID Type',
          accessor: 'pidType',
          Cell: this.renderEditable,
        },
        {
          Header: 'Title',
          accessor: 'title',
          minWidth: TITLE_WIDTH,
          Cell: this.renderEditable,
        },
        {
          Header: 'Color',
          accessor: 'color',
          Cell: this.renderEditable,
        },
        {
          Header: 'Color Map',
          accessor: 'colorMap',
          Cell: this.renderEditable,
        },
        {
          Header: 'Size',
          accessor: 'size',
          Cell: this.renderEditable,
        },
        {
          Header: 'Size Map',
          accessor: 'sizeMap',
          Cell: this.renderEditable,
        },
        {
          Header: 'Material',
          accessor: 'material',
          Cell: this.renderEditable,
        },
      ]
    },
    {
      Header: <BulletPoints>Bullet Points</BulletPoints>,
      columns: [
        {
          Header: 'Bullet 1',
          accessor: 'bulletPoints1',
          minWidth: BULLET_WIDTH,
          Cell: this.renderEditable,
        },
        {
          Header: 'Bullet 2',
          accessor: 'bulletPoints2',
          minWidth: BULLET_WIDTH,
          Cell: this.renderEditable,
        },
        {
          Header: 'Bullet 3',
          accessor: 'bulletPoints3',
          minWidth: BULLET_WIDTH,
          Cell: this.renderEditable,
        },
        {
          Header: 'Bullet 4',
          accessor: 'bulletPoints4',
          minWidth: BULLET_WIDTH,
          Cell: this.renderEditable,
        },
        {
          Header: 'Bullet 5',
          accessor: 'bulletPoints5',
          minWidth: BULLET_WIDTH,
          Cell: this.renderEditable,
        },
      ]
    },
    {
      Header: <Inventory>Inventory</Inventory>,
      columns: [
        {
          Header: 'Stock',
          accessor: 'stock',
          Cell: this.renderEditable,
        },
        {
          Header: 'Sold Count',
          accessor: 'soldCount',
          Cell: this.renderEditable,
        },
        {
          Header: 'Price',
          accessor: 'price',
          Cell: this.renderEditable,
        },
      ]
    },
    {
      Header: <Images>Images</Images>,
      columns: [
        {
          Header: 'Thumbnail',
          accessor: 'thumbnail',
          Cell: this.renderEditable,
        },
        {
          Header: 'Main Image',
          accessor: 'mainImage',
          Cell: this.renderEditable,
        },
        {
          Header: 'Image1',
          accessor: 'image1',
          Cell: this.renderEditable,
        },
        {
          Header: 'Image2',
          accessor: 'image2',
          Cell: this.renderEditable,
        },
        {
          Header: 'Image3',
          accessor: 'image3',
          Cell: this.renderEditable,
        },
        {
          Header: 'Image4',
          accessor: 'image4',
          Cell: this.renderEditable,
        },
        {
          Header: 'Image5',
          accessor: 'image5',
          Cell: this.renderEditable,
        },
        {
          Header: 'Image6',
          accessor: 'image6',
          Cell: this.renderEditable,
        },
        {
          Header: 'Image7',
          accessor: 'image7',
          Cell: this.renderEditable,
        },
      ]
    },
    {
      Header: <Actions>Actions</Actions>,
      columns: [
        {
          Header: 'Actions',
          accessor: 'actions',
          style: {
            textAlign: 'center'
          },
          Cell: props =>
            <Button
              color="red" size="mini"
              onClick={() => this.handleDeleteClick(props)}>
              DELETE
            </Button>
        }
      ]
    }
  ]


  handleAddVarClick = (props) => {
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
  }

  handleSaveClick = async () => {
    this.setState({
      modalOpen: true,
      isSaving: true,
    })
    try {
      const res = await axios.post('https://us-central1-jellytree-3cb33.cloudfunctions.net/setProducts',
        this.state.data
      )
      console.log(res)
      this.setState({
        isSaving: false,
        saveResultMsg: "Successfully Saved!"
      })
    } catch (e) {
      console.log(e.response)
      this.setState({
        isSaving: false,
        saveResultMsg: "Something went wrong, please try again later."
      })
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
      newData = _.filter(data, product =>
        product.sku !== sku)
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
          columns={this.columns}
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
                  columns={this.variationColumns}
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


        <Modal
          open={this.state.modalOpen}
          onClose={!this.state.isSaving ? this.handleModalClose : null}
          basic
          size='mini'
        >
          {this.state.isSaving
            ? <Loader size='massive'>Saving...</Loader>
            : <Fragment>
              <Header
                size="huge"
                icon='save outline'
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
