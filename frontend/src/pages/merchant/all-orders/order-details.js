import React from 'react'
import { Helmet } from 'react-helmet-async';

// Sections
import { OrderDetailsView } from 'src/sections/merchant/all-orders/order-details/view';

const AllOrders = () => {
  return (
    <>
      <Helmet>
        <title>Order Details</title>
      </Helmet>

      <OrderDetailsView/>
    </>
  )
}

export default AllOrders
