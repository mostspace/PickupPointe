import React from 'react'
import { Helmet } from 'react-helmet-async';

// Sections
import { ManageItemOutOfStockView } from "src/sections/merchant/manage-items/out-of-stock/view";

const ManageItemOutOfStock = () => {
  return (
    <>
      <Helmet>
        <title>Manage Item out of stock</title>
      </Helmet>

      <ManageItemOutOfStockView/>
    </>
  )
}

export default ManageItemOutOfStock