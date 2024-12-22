import React from 'react'

import { Helmet } from 'react-helmet-async';
// Sections
import { ManageOrdersView } from 'src/sections/vendor/manage-orders/view';

const ManageOrders = () => {
  return (
    <>
      <Helmet>
        <title>Manage Orders</title>
      </Helmet>

      <ManageOrdersView />
    </>
  )
}

export default ManageOrders
