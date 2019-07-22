import React, { Component } from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { Button, Icon } from 'semantic-ui-react'
import _ from 'lodash'

export class ProductTable extends Component {
  constructor() {
    super();
    this.state = {
      data: [
        {
          sku: 'JT-P',
          productId: '8830',
          category: 'Hats',
          title: 'Lace Bonnet',
          stock: 10,
          soldCount: 20,
          variations: [
            {
              sku: 'JT-C1',
              parentSku: 'JT-P',
              productId: '8831',
              category: 'Hats',
              title: 'Lace Bonnet Small White',
              stock: 10,
              soldCount: 20,
            },
            {
              sku: 'JT-C2',
              parentSku: 'JT-P',
              productId: '8832',
              category: 'Hats',
              title: 'Lace Bonnet Medium White',
              stock: 10,
              soldCount: 20,
            },
            {
              sku: 'JT-C3',
              parentSku: 'JT-P',
              productId: '8833',
              category: 'Hats',
              title: 'Lace Bonnet Small Pink',
              stock: 10,
              soldCount: 20,
            }
          ]
        },
        {
          sku: 'HT-P',
          productId: '8840',
          category: 'Scarves',
          title: 'Infinity Scarf',
          stock: 40,
          soldCount: 159,
          variations: [
            {
              sku: 'HT-C1',
              parentSku: 'HT-P',
              productId: '8841',
              category: 'Scarves',
              title: 'Infinity Scarf White',
              stock: 40,
              soldCount: 159,
            },
            {
              sku: 'HT-C2',
              parentSku: 'HT-P',
              productId: '8842',
              category: 'Scarves',
              title: 'Infinity Scarf Navy',
              stock: 40,
              soldCount: 159,
            },
          ]
        }
      ]
    };
  }




  renderEditable = (cellInfo) => {
    const product = cellInfo.original
    const column = cellInfo.column.id
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const data = [...this.state.data];
          _.forEach(data, (item) => {
            if (item.sku === product.sku) {
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
      Header: 'Basic Info',
      columns: [
        {
          Header: 'SKU',
          accessor: 'sku',
          style: {
            textAlign: 'left'
          },
        },
        {
          Header: 'Product ID',
          accessor: 'productId',
          style: {
            textAlign: 'left'
          },
        },
        {
          Header: 'Category',
          accessor: 'category',
          style: {
            textAlign: 'left'
          },
          Cell: this.renderEditable,
        },
        {
          Header: 'Title',
          accessor: 'title',
          style: {
            textAlign: 'left'
          },
          Cell: this.renderEditable,
        }
      ]
    },
    {
      Header: 'Inventory',
      columns: [
        {
          Header: 'Stock',
          accessor: 'stock',
          style: {
            textAlign: 'center'
          },
          Cell: this.renderEditable,
        },
        {
          Header: 'Sold Count',
          accessor: 'soldCount',
          style: {
            textAlign: 'center'
          },
        }
      ]
    },
    {
      Header: 'Actions',
      accessor: 'edit',
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




  render() {
    const { data } = this.state;
    return (
      <div>
        <ReactTable
          data={data}
          columns={this.columns}
          defaultPageSize={10}
          className="-striped -highlight"
          minRows={5}
          filterable
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
                  data={_.find(this.state.data, { 'productId': row.original.productId }).variations}
                  columns={this.columns}
                  minRows={5}
                  defaultPageSize={10}
                  noDataText={"No variations"}
                  showPagination={false}
                />
              </div>
            )
          }}
        />
      </div>
    );
  }
}

export default ProductTable
