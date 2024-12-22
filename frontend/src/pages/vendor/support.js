import React from 'react'

import { Helmet } from 'react-helmet-async';
// Sections
import { VendorSupportView } from 'src/sections/vendor/support/view';

const VendorSupport = () => {
  return (
    <>
      <Helmet>
        <title>Vendor Support</title>
      </Helmet>

      <VendorSupportView />
    </>
  )
}

export default VendorSupport
