import React from 'react'

import { Helmet } from 'react-helmet-async';

// Sections
import { OrdersHistoryView } from 'src/sections/shopper/orders-history/view';

const OrdersHistory = () => {
  return (
    <>
      <Helmet>
        <title>Orders History</title>
      </Helmet>

      <OrdersHistoryView />
    </>
  )
}

export default OrdersHistory
