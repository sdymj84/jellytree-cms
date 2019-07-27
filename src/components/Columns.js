import React, { Fragment, useEffect } from 'react'
import styled from 'styled-components'
import { Button, Dropdown } from 'semantic-ui-react'
import _ from 'lodash'

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
const StyledDropdown = styled(Dropdown)`
  min-height: 0;
`

const CellContainer = styled.div`
  outline: none;
  height: 100%;
  min-height: 40px;
  padding: ${p => p.dropdown ? '0' : '9px 6px'};
  text-align: left;
  border-radius: 3px;
  font-size: 1.1em;
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


  const renderEditable = (cellInfo) => {
    const product = cellInfo.original
    const column = cellInfo.column.id
    return (
      <CellContainer
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => props.handleCellBlur(e, product, column)}
        dangerouslySetInnerHTML={{
          __html: product[column]
        }}
      />
    );
  }

  const readOnlyCell = (cellInfo) => {
    const product = cellInfo.original
    const column = cellInfo.column.id
    return (
      <CellContainer
        dangerouslySetInnerHTML={{
          __html: product[column]
        }}
      />
    )
  }


  const colors = ['White', 'Blue', 'Grey', 'Navy', 'Pink']
  const colorOptions = _.map(colors, color => ({
    key: color,
    text: color,
    value: color,
  }))

  const sizes = ['0-3M', '3-6M', '6-12M', '12-24M']
  const sizeOptions = _.map(sizes, size => ({
    key: size,
    text: size,
    value: size,
  }))


  const renderDropdown = (cellInfo, item) => {
    const product = cellInfo.original
    const column = cellInfo.column.id
    return (
      <CellContainer dropdown>
        <StyledDropdown
          placeholder={item === 'color'
            ? 'Color Map'
            : 'Size Map'}
          fluid
          multiple
          // search
          selection
          onChange={(e, { value }) =>
            props.handleDropdownChange(value, product, column)}
          options={item === 'color'
            ? colorOptions
            : sizeOptions}
          value={product[column]}
        />
      </CellContainer>
    )
  }


  const columns = [
    {
      Header: <BasicInfo>Basic Info</BasicInfo>,
      columns: [
        {
          Header: <Required title="SKU" />,
          accessor: 'sku',
          Cell: renderEditable,
        },
        {
          Header: 'Product ID',
          accessor: 'pid',
          Cell: renderEditable,
        },
        {
          Header: 'Product ID Type',
          accessor: 'pidType',
          minWidth: 125,
          Cell: renderEditable,
        },
        {
          Header: <Required title="Category" />,
          accessor: 'category',
          Cell: renderEditable,
        },
        {
          Header: <Required title="Title" />,
          accessor: 'title',
          minWidth: TITLE_WIDTH,
          Cell: renderEditable,
        },
        {
          Header: 'Color Map',
          accessor: 'colorMap',
          Cell: renderEditable,
        },
        {
          Header: 'Size Map',
          accessor: 'sizeMap',
          Cell: renderEditable,
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
          Cell: renderEditable,
        },
        {
          Header: 'Bullet 2',
          accessor: 'bulletPoints2',
          minWidth: BULLET_WIDTH,
          Cell: renderEditable,
        },
        {
          Header: 'Bullet 3',
          accessor: 'bulletPoints3',
          minWidth: BULLET_WIDTH,
          Cell: renderEditable,
        },
        {
          Header: 'Bullet 4',
          accessor: 'bulletPoints4',
          minWidth: BULLET_WIDTH,
          Cell: renderEditable,
        },
        {
          Header: 'Bullet 5',
          accessor: 'bulletPoints5',
          minWidth: BULLET_WIDTH,
          Cell: renderEditable,
        },
      ]
    },
    {
      Header: <Inventory>Inventory</Inventory>,
      columns: [
        {
          Header: 'Stock',
          accessor: 'stock',
          Cell: readOnlyCell,
        },
        {
          Header: 'Sold Count',
          accessor: 'soldCount',
          Cell: readOnlyCell,
        },
        {
          Header: 'MIN Price',
          accessor: 'minPrice',
          Cell: readOnlyCell,
        },
        {
          Header: 'MAX Price',
          accessor: 'maxPrice',
          Cell: readOnlyCell,
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
            textAlign: 'center',
            paddingTop: '5.5px',
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
          Cell: renderEditable,
        },
        {
          Header: <Required title="Product ID" />,
          accessor: 'pid',
          Cell: renderEditable,
        },
        {
          Header: <Required title="Product ID Type" />,
          accessor: 'pidType',
          minWidth: 125,
          Cell: renderEditable,
        },
        {
          Header: <Required title="Title" />,
          accessor: 'title',
          minWidth: TITLE_WIDTH,
          Cell: renderEditable,
        },
        {
          Header: <Required title="Color" />,
          accessor: 'color',
          Cell: renderEditable,
        },
        {
          Header: <Required title="Color Map" />,
          accessor: 'colorMap',
          minWidth: 220,
          Cell: (cellInfo) => renderDropdown(cellInfo, 'color'),
        },
        {
          Header: <Required title="Size" />,
          accessor: 'size',
          Cell: renderEditable,
        },
        {
          Header: <Required title="Size Map" />,
          accessor: 'sizeMap',
          minWidth: 200,
          Cell: (cellInfo) => renderDropdown(cellInfo, 'size'),
        },
        {
          Header: <Required title="Material" />,
          accessor: 'material',
          Cell: renderEditable,
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
          Cell: renderEditable,
        },
        {
          Header: 'Bullet 2',
          accessor: 'bulletPoints2',
          minWidth: BULLET_WIDTH,
          Cell: renderEditable,
        },
        {
          Header: 'Bullet 3',
          accessor: 'bulletPoints3',
          minWidth: BULLET_WIDTH,
          Cell: renderEditable,
        },
        {
          Header: 'Bullet 4',
          accessor: 'bulletPoints4',
          minWidth: BULLET_WIDTH,
          Cell: renderEditable,
        },
        {
          Header: 'Bullet 5',
          accessor: 'bulletPoints5',
          minWidth: BULLET_WIDTH,
          Cell: renderEditable,
        },
      ]
    },
    {
      Header: <Inventory>Inventory</Inventory>,
      columns: [
        {
          Header: <Required title="Stock" />,
          accessor: 'stock',
          Cell: renderEditable,
        },
        {
          Header: 'Sold Count',
          accessor: 'soldCount',
          Cell: readOnlyCell,
        },
        {
          Header: <Required title="Price" />,
          accessor: 'price',
          Cell: renderEditable,
        },
      ]
    },
    {
      Header: <Images>Images</Images>,
      columns: [
        {
          Header: <Required title="Thumbnail" />,
          accessor: 'thumbnail',
          Cell: renderEditable,
        },
        {
          Header: <Required title="Main Image" />,
          accessor: 'mainImage',
          Cell: renderEditable,
        },
        {
          Header: 'Image1',
          accessor: 'image1',
          Cell: renderEditable,
        },
        {
          Header: 'Image2',
          accessor: 'image2',
          Cell: renderEditable,
        },
        {
          Header: 'Image3',
          accessor: 'image3',
          Cell: renderEditable,
        },
        {
          Header: 'Image4',
          accessor: 'image4',
          Cell: renderEditable,
        },
        {
          Header: 'Image5',
          accessor: 'image5',
          Cell: renderEditable,
        },
        {
          Header: 'Image6',
          accessor: 'image6',
          Cell: renderEditable,
        },
        {
          Header: 'Image7',
          accessor: 'image7',
          Cell: renderEditable,
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
            textAlign: 'center',
            paddingTop: '6px',
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
