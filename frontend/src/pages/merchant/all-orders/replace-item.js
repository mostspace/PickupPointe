import React from 'react'
import { Helmet } from 'react-helmet-async';

// Sections
import { ReplaceItemView } from 'src/sections/merchant/all-orders/replace-item/view';

const ReplaceItem = () => {
  return (
    <>
      <Helmet>
        <title>Replace item</title>
      </Helmet>

      <ReplaceItemView/>
    </>
  )
}

export default ReplaceItem
