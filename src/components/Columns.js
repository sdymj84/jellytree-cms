import React, { Fragment, useEffect } from 'react'
import styled from 'styled-components'
import { Button } from 'semantic-ui-react'

const BULLET_WIDTH = 200
const TITLE_WIDTH = 500

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

const Required = (props) => {
  return (
    <span>
      {props.title}
      <span style={{ color: 'red' }}>
        {' '}*
      </span>
    </span>
  )
}


const Columns = (props) => {

  useEffect(() => {
    props.getColumns(columns, variationColumns)
    // eslint-disable-next-line 
  }, [])

  const columns = [
    {
      Header: <BasicInfo>Basic Info</BasicInfo>,
      columns: [
        {
          Header: <Required title="SKU" />,
          accessor: 'sku',
          Cell: props.renderEditable,
        },
        {
          Header: 'Product ID',
          accessor: 'pid',
          Cell: props.renderEditable,
        },
        {
          Header: 'Product ID Type',
          accessor: 'pidType',
          minWidth: 125,
          Cell: props.renderEditable,
        },
        {
          Header: <Required title="Category" />,
          accessor: 'category',
          Cell: props.renderEditable,
        },
        {
          Header: <Required title="Title" />,
          accessor: 'title',
          minWidth: TITLE_WIDTH,
          Cell: props.renderEditable,
        },
        {
          Header: 'Color Map',
          accessor: 'colorMap',
          Cell: props.renderEditable,
        },
        {
          Header: 'Size Map',
          accessor: 'sizeMap',
          Cell: props.renderEditable,
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
          Cell: props.renderEditable,
        },
        {
          Header: 'Bullet 2',
          accessor: 'bulletPoints2',
          minWidth: BULLET_WIDTH,
          Cell: props.renderEditable,
        },
        {
          Header: 'Bullet 3',
          accessor: 'bulletPoints3',
          minWidth: BULLET_WIDTH,
          Cell: props.renderEditable,
        },
        {
          Header: 'Bullet 4',
          accessor: 'bulletPoints4',
          minWidth: BULLET_WIDTH,
          Cell: props.renderEditable,
        },
        {
          Header: 'Bullet 5',
          accessor: 'bulletPoints5',
          minWidth: BULLET_WIDTH,
          Cell: props.renderEditable,
        },
      ]
    },
    {
      Header: <Inventory>Inventory</Inventory>,
      columns: [
        {
          Header: 'Stock',
          accessor: 'stock',
          Cell: props.renderEditable,
        },
        {
          Header: 'Sold Count',
          accessor: 'soldCount',
          Cell: props.renderEditable,
        },
        {
          Header: 'MIN Price',
          accessor: 'minPrice',
          Cell: props.renderEditable,
        },
        {
          Header: 'MAX Price',
          accessor: 'maxPrice',
          Cell: props.renderEditable,
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
          Cell: cellInfo =>
            <div>
              <Button
                color="blue" size="mini"
                onClick={() => props.handleAddVarClick(cellInfo)}>
                ADD VAR
                </Button>
              <Button
                color="red" size="mini"
                onClick={() => props.handleDeleteClick(cellInfo)}>
                DELETE
                </Button>
            </div>
        }
      ]
    }
  ]







  const variationColumns = [
    {
      Header: <BasicInfo>Basic Info</BasicInfo>,
      columns: [
        {
          Header: <Required title="SKU" />,
          accessor: 'sku',
          Cell: props.renderEditable,
        },
        {
          Header: <Required title="Product ID" />,
          accessor: 'pid',
          Cell: props.renderEditable,
        },
        {
          Header: <Required title="Product ID Type" />,
          accessor: 'pidType',
          minWidth: 125,
          Cell: props.renderEditable,
        },
        {
          Header: <Required title="Title" />,
          accessor: 'title',
          minWidth: TITLE_WIDTH,
          Cell: props.renderEditable,
        },
        {
          Header: <Required title="Color" />,
          accessor: 'color',
          Cell: props.renderEditable,
        },
        {
          Header: <Required title="Color Map" />,
          accessor: 'colorMap',
          Cell: props.renderEditable,
        },
        {
          Header: <Required title="Size" />,
          accessor: 'size',
          Cell: props.renderEditable,
        },
        {
          Header: <Required title="Size Map" />,
          accessor: 'sizeMap',
          Cell: props.renderEditable,
        },
        {
          Header: <Required title="Material" />,
          accessor: 'material',
          Cell: props.renderEditable,
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
          Cell: props.renderEditable,
        },
        {
          Header: 'Bullet 2',
          accessor: 'bulletPoints2',
          minWidth: BULLET_WIDTH,
          Cell: props.renderEditable,
        },
        {
          Header: 'Bullet 3',
          accessor: 'bulletPoints3',
          minWidth: BULLET_WIDTH,
          Cell: props.renderEditable,
        },
        {
          Header: 'Bullet 4',
          accessor: 'bulletPoints4',
          minWidth: BULLET_WIDTH,
          Cell: props.renderEditable,
        },
        {
          Header: 'Bullet 5',
          accessor: 'bulletPoints5',
          minWidth: BULLET_WIDTH,
          Cell: props.renderEditable,
        },
      ]
    },
    {
      Header: <Inventory>Inventory</Inventory>,
      columns: [
        {
          Header: 'Stock',
          accessor: 'stock',
          Cell: props.renderEditable,
        },
        {
          Header: 'Sold Count',
          accessor: 'soldCount',
          Cell: props.renderEditable,
        },
        {
          Header: 'Price',
          accessor: 'price',
          Cell: props.renderEditable,
        },
      ]
    },
    {
      Header: <Images>Images</Images>,
      columns: [
        {
          Header: <Required title="Thumbnail" />,
          accessor: 'thumbnail',
          Cell: props.renderEditable,
        },
        {
          Header: <Required title="Main Image" />,
          accessor: 'mainImage',
          Cell: props.renderEditable,
        },
        {
          Header: 'Image1',
          accessor: 'image1',
          Cell: props.renderEditable,
        },
        {
          Header: 'Image2',
          accessor: 'image2',
          Cell: props.renderEditable,
        },
        {
          Header: 'Image3',
          accessor: 'image3',
          Cell: props.renderEditable,
        },
        {
          Header: 'Image4',
          accessor: 'image4',
          Cell: props.renderEditable,
        },
        {
          Header: 'Image5',
          accessor: 'image5',
          Cell: props.renderEditable,
        },
        {
          Header: 'Image6',
          accessor: 'image6',
          Cell: props.renderEditable,
        },
        {
          Header: 'Image7',
          accessor: 'image7',
          Cell: props.renderEditable,
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
          Cell: cellInfo =>
            <Button
              color="red" size="mini"
              onClick={() => props.handleDeleteClick(cellInfo)}>
              DELETE
              </Button>
        }
      ]
    }
  ]

  return (
    <Fragment />
  )
}

export default Columns
