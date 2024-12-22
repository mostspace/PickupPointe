import React from 'react'

import { Helmet } from 'react-helmet-async';
// Sections
import { EditShopDetailsView } from 'src/sections/vendor/manage-shop/edit-shop-details/view';

const EditShopDetails = () => {
  return (
    <>
        <Helmet>
            <title>Edit Shop Details</title>
        </Helmet>

        <EditShopDetailsView />
    </>
  )
}

export default EditShopDetails
