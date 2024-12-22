import React from 'react'

import { Helmet } from 'react-helmet-async';
// Sections
import Main from 'src/sections/merchant/settings';

const Settings = () => {
  return (
    <>
      <Helmet>
        <title>Settings</title>
      </Helmet>

      <Main />
    </>
  )
}

export default Settings
