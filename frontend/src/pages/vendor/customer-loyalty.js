import React from 'react'

import { Helmet } from 'react-helmet-async';
// Sections
import { CustomerLoyaltyView } from 'src/sections/vendor/customer-loyalty/view';

const CustomerLoyalty = () => {
  return (
    <>
      <Helmet>
        <title>Customer Loyalty</title>
      </Helmet>

      <CustomerLoyaltyView />
    </>
  )
}

export default CustomerLoyalty
