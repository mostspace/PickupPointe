import React from 'react'
import { Helmet } from 'react-helmet-async';

// Sections
import { OutOfStockView } from 'src/sections/merchant/all-orders/out-of-stock/view';

const OutOfStock = () => {
  return (
    <>
      <Helmet>
        <title>Item out of stock</title>
      </Helmet>

      <OutOfStockView/>
    </>
  )
}

export default OutOfStock
