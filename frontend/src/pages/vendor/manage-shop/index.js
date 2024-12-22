import React from 'react'

import { Helmet } from 'react-helmet-async';
// Sections
import { ManageShopView } from 'src/sections/vendor/manage-shop/view';

const ViewShop = () => {
  return (
    <>
      <Helmet>
        <title>Manage Shop</title>
      </Helmet>

      <ManageShopView />
    </>
  )
}

export default ViewShop
