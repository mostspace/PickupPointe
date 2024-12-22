import React from 'react'

import { Helmet } from 'react-helmet-async';
// Sections
import { OrderLocalView } from 'src/sections/shopper/order-local/view';

const OrderLocal = () => {
  return (
    <>
        <Helmet>
            <title>Order Local</title>
        </Helmet>

        <OrderLocalView />
    </>
  )
}

export default OrderLocal