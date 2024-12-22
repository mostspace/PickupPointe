import React from 'react'
import { Helmet } from 'react-helmet-async';
// Sections
import OrderDetailsView from 'src/sections/vendor/manage-orders/order-details';

const OrderDetails = () => {
  return (
    <>
      <Helmet>
        <title>Order Details</title>
      </Helmet>

      <OrderDetailsView />
    </>
  )
}

export default OrderDetails
