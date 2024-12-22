import React from 'react'

import { Helmet } from 'react-helmet-async';
// Sections
import { LoyaltyView } from 'src/sections/shopper/loyalty/view';

const Loyalty = () => {
  return (
    <>
      <Helmet>
        <title>Loyalty & Discount</title>
      </Helmet>

      <LoyaltyView />
    </>
  )
}

export default Loyalty
