import React, { useState } from 'react'

const EditableTable = ({ cellInfo, editablePid }) => {
  const [data, setData] = useState(cellInfo.value)

  const handleBlur = (e) => {
    e.persist()
    setData(e.target.innerHTML)
  }

  if (editablePid === cellInfo.original.productId) {
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        dangerouslySetInnerHTML={{
          __html: data
        }}
      />
    )
  }

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: data
      }}
    />
  )
}

export default EditableTable
