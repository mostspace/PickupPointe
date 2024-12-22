import React from 'react'

import { Helmet } from 'react-helmet-async';
// Sections
import AutopayOrderDetailsView from 'src/sections/vendor/manage-orders/autopay-order-details';

const AutopayOrderDetails = () => {
  return (
    <>
      <Helmet>
        <title>Auto-pay Order Details</title>
      </Helmet>

      <AutopayOrderDetailsView />
    </>
  )
}

export default AutopayOrderDetails
