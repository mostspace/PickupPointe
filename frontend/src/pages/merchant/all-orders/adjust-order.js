import React from 'react'
import { Helmet } from 'react-helmet-async';

// Sections
import { AdjustOrderView } from 'src/sections/merchant/all-orders/adjust-order/view';

const AdjustOrder = () => {
  return (
    <>
      <Helmet>
        <title>Adjust order</title>
      </Helmet>

      <AdjustOrderView/>
    </>
  )
}

export default AdjustOrder
