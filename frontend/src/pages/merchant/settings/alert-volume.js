import React from 'react'

import { Helmet } from 'react-helmet-async';
// Sections
import { AlertVolumeView } from 'src/sections/merchant/settings/alert-volume/view';

const AlertVolume = () => {
  return (
    <>
      <Helmet>
        <title>Alert volume for new orders</title>
      </Helmet>

      <AlertVolumeView />
    </>
  )
}

export default AlertVolume
