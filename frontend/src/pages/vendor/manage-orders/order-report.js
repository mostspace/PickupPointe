import React from 'react'

import { Helmet } from 'react-helmet-async';
// Sections
import OrderReportView from 'src/sections/vendor/manage-orders/order-report';

const OrderReport = () => {
  return (
    <>
      <Helmet>
        <title>Order Report</title>
      </Helmet>

      <OrderReportView />
    </>
  )
}

export default OrderReport
