import React from 'react'

import { Helmet } from 'react-helmet-async';

// Sections
import { VendorDetailsView } from 'src/sections/home/vendor-details/view';

const VendorDetails = () => {
  return (
    <>
      <Helmet>
        <title>Pickup Pointe</title>
      </Helmet>

      <VendorDetailsView />
    </>
  )
}

export default VendorDetails