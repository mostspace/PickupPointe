import React from 'react'

import { Helmet } from 'react-helmet-async';
// Sections
import { VendorProfileView } from 'src/sections/shopper/vendor-profile/view';

const VendorProfile = () => {
  return (
    <>
        <Helmet>
            <title>Vendor Profile</title>
        </Helmet>

        <VendorProfileView />
    </>
  )
}

export default VendorProfile