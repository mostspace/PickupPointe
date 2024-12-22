import React from 'react'

import { Helmet } from 'react-helmet-async';
// Sections
import { RateUsView } from 'src/sections/merchant/settings/rate-us/view';

const RateUs = () => {
  return (
    <>
      <Helmet>
        <title>Rate us</title>
      </Helmet>

      <RateUsView />
    </>
  )
}

export default RateUs
