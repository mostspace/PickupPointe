import React from 'react'

import { Helmet } from 'react-helmet-async';
// Sections
import { FindLocalVendorsView } from 'src/sections/shopper/find-local-vendor/view';

const FindLocalVendors = () => {
  return (
    <>
        <Helmet>
            <title>Find Local Vendors</title>
        </Helmet>

        <FindLocalVendorsView />
    </>
  )
}

export default FindLocalVendors