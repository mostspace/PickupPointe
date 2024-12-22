import React from 'react'

import { Helmet } from 'react-helmet-async';
// Sections
import { UpgradeDowngradeServicesView } from 'src/sections/vendor/manage-location/upgrade-downgrade-services/view';

const UpgradeDowngradeServices = () => {
  return (
    <>
      <Helmet>
        <title>Upgrade and Downgrade Services</title>
      </Helmet>

      <UpgradeDowngradeServicesView />
    </>
  )
}

export default UpgradeDowngradeServices