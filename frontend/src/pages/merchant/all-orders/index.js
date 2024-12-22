import React from 'react'
import { Helmet } from 'react-helmet-async';

// Sections
import Main from 'src/sections/merchant/all-orders';

const AllOrders = () => {
  return (
    <>
      <Helmet>
        <title>All orders</title>
      </Helmet>

      <Main />
    </>
  )
}

export default AllOrders
