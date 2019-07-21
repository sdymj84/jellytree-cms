import React from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import _ from 'lodash'
import { Button } from 'semantic-ui-react'

const ProductVariationTable = ({ data, parent }) => {

  const columns = [
    {
      Header: 'Basic Info',
      columns: [
        {
          Header: 'Product ID',
          accessor: 'productId'
        },
        {
          Header: 'Title',
          accessor: 'title'
        }
      ]
    },
    {
      Header: 'Inventory',
      columns: [
        {
          Header: 'Stock',
          accessor: 'stock',
        },
        {
          Header: 'Sold Count',
          accessor: 'soldCount'
        }
      ]
    },
    {
      Header: 'Status Change',
      columns: [
        {
          Header: 'Edit',
          accessor: 'edit',
          Cell: props => <Button color="yellow" size="mini">Edit</Button>
        },
        {
          Header: 'Delete',
          accessor: 'delete',
          Cell: props => <Button color="red" size="mini">Delete</Button>
        }
      ]
    }
  ]

  return (
    <ReactTable
      data={_.find(data, { 'productId': parent.productId }).variations}
      columns={columns}
      defaultPageSize={10}
    />
  )
}

export default ProductVariationTable
