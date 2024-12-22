import React from 'react'

import { Helmet } from 'react-helmet-async';

// Sections
import { ActiveOrdersView } from 'src/sections/shopper/active-orders/view';

const OrdersHistory = () => {
  return (
    <>
      <Helmet>
        <title>Orders History</title>
      </Helmet>

      <ActiveOrdersView />
    </>
  )
}

export default OrdersHistory