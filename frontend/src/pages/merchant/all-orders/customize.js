import React from 'react'
import { Helmet } from 'react-helmet-async';

// Sections
import { CustomizeView } from 'src/sections/merchant/all-orders/customize/view';

const Customize = () => {
  return (
    <>
      <Helmet>
        <title>Customize</title>
      </Helmet>

      <CustomizeView/>
    </>
  )
}

export default Customize
