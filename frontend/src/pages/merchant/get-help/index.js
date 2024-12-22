import React from 'react'
import { Helmet } from 'react-helmet-async';

// Sections
import { GetHelpView } from 'src/sections/merchant/get-help/view';

const GetHelp = () => {
  return (
    <>
      <Helmet>
        <title>Get help from Pickup Pointe team</title>
      </Helmet>

      <GetHelpView/>
    </>
  )
}

export default GetHelp