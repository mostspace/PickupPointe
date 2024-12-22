import React from 'react'

import { Helmet } from 'react-helmet-async';
// Sections
import { ShopperSupportView } from 'src/sections/shopper/support/view';

const ShopperSupport = () => {
  return (
    <>
      <Helmet>
        <title>Shopper Support</title>
      </Helmet>

      <ShopperSupportView />
    </>
  )
}

export default ShopperSupport
