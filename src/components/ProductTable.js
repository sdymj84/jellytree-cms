/* 
  Fetch all products data in here
  and pass them down to ProductVariationTable component to render variations
*/

import React, { useState } from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import ProductVariationTable from './ProductVariationTable'
import EditableTable from './EditableTable';
import { Button } from 'semantic-ui-react'
import _ from 'lodash'

const ProductTable = () => {

  const columns = [
    {
      Header: 'Basic Info',
      columns: [
        {
          Header: 'Product ID',
          accessor: 'productId',
          Cell: cellInfo =>
            <EditableTable
              cellInfo={cellInfo}
              editablePid={editablePid} />,
        },
        {
          Header: 'Category',
          accessor: 'category',
          Cell: cellInfo =>
            <EditableTable
              cellInfo={cellInfo}
              editablePid={editablePid} />,
        },
        {
          Header: 'Title',
          accessor: 'title',
          Cell: cellInfo =>
            <EditableTable
              cellInfo={cellInfo}
              editablePid={editablePid} />,
        }
      ]
    },
    {
      Header: 'Inventory',
      columns: [
        {
          Header: 'Stock',
          accessor: 'stock',
          Cell: cellInfo =>
            <EditableTable
              cellInfo={cellInfo}
              editablePid={editablePid} />,
        },
        {
          Header: 'Sold Count',
          accessor: 'soldCount',
          Cell: cellInfo =>
            <EditableTable
              cellInfo={cellInfo}
              editablePid={editablePid} />,
        }
      ]
    },
    {
      Header: 'Status Change',
      columns: [
        {
          Header: 'Edit',
          accessor: 'edit',
          Cell: props =>
            <Button
              color="yellow" size="mini"
              onClick={() => handleEditClick(props)}>
              Edit
            </Button>
        },
        {
          Header: 'Delete',
          accessor: 'delete',
          Cell: props => <Button color="red" size="mini">Delete</Button>
        }
      ]
    }
  ]

  const [data, setData] = useState([
    {
      productId: '8830',
      category: 'Hats',
      title: 'Lace Bonnet',
      stock: 10,
      soldCount: 20,
      variations: [
        {
          productId: '8831',
          title: 'Lace Bonnet Small White'
        },
        {
          productId: '8832',
          title: 'Lace Bonnet Medium White'
        },
        {
          productId: '8833',
          title: 'Lace Bonnet Small Pink'
        }
      ]
    },
    {
      productId: '8840',
      category: 'Scarves',
      title: 'Infinity Scarf',
      stock: 40,
      soldCount: 159,
      variations: [
        {
          productId: '8841',
          title: 'Infinity Scarf White'
        },
        {
          productId: '8842',
          title: 'Infinity Scarf Navy'
        },
        {
          productId: '8843',
          title: 'Infinity Scarf Pink'
        }
      ]
    }
  ])

  const [editablePid, setEditablePid] = useState(0)
  const handleEditClick = (props) => {
    setEditablePid(props.original.productId)
  }

  console.log(editablePid)

  return (
    <ReactTable
      data={data}
      columns={columns}
      defaultPageSize={10}
      className="-striped -highlight"
      // getTdProps={(state, rowInfo, column, instance) => {
      //   return {
      //     onMouseEnter: e =>
      //       console.log("Cell - onMouseEnter", {
      //         state,
      //         rowInfo,
      //         column,
      //         instance,
      //         event: e
      //       })
      //   };
      // }}
      SubComponent={row => {
        console.log(row)
        return (
          <div style={{ padding: '20px' }}>
            <ProductVariationTable
              data={data}
              parent={row.original}
            />
          </div>
        )
      }}
    />
  )
}

export default ProductTable
