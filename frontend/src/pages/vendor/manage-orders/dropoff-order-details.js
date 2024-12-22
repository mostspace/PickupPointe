import React from 'react'

import { Helmet } from 'react-helmet-async';
// Sections
import DropoffOrderDetailsView from 'src/sections/vendor/manage-orders/dropoff-order-details';

const DropOffOrderDetails = () => {
  return (
    <>
      <Helmet>
        <title>Drop-Off Order Details</title>
      </Helmet>

      <DropoffOrderDetailsView />
    </>
  )
}

export default DropOffOrderDetails
