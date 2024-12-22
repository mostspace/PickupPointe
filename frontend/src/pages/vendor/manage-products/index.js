import React from 'react'

import { Helmet } from 'react-helmet-async';
// Sections
import { ManageProductsView } from 'src/sections/vendor/manage-products/view';

const ManageProducts = () => {
  return (
    <>
      <Helmet>
        <title>Manage menu</title>
      </Helmet>

      <ManageProductsView />
    </>
  )
}

export default ManageProducts
