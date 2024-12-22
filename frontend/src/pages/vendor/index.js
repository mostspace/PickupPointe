import React from 'react'

import { Helmet } from 'react-helmet-async';
// Sections
import { VendorDashboardView } from 'src/sections/vendor/dashboard/view';

const VendorDashboard = () => {
  return (
    <>
        <Helmet>
            <title>Vendor Dashboard</title>
        </Helmet>

        <VendorDashboardView />
    </>
  )
}

export default VendorDashboard
