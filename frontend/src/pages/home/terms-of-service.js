import React from 'react'

import { Helmet } from 'react-helmet-async';

// Sections
import { TermsOfServiceView } from 'src/sections/home/terms-of-service/view';

const TermsOfService = () => {
  return (
    <>
      <Helmet>
        <title>Pickup Pointe - Terms of Service</title>
      </Helmet>

      <TermsOfServiceView />
    </>
  )
}

export default TermsOfService