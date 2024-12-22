import React from 'react'

import { Helmet } from 'react-helmet-async';
// Sections
import { GlobalSettingsView } from 'src/sections/vendor/global-settings/view';

const GlobalSettings = () => {
  return (
    <>
        <Helmet>
            <title>Global settings</title>
        </Helmet>

        <GlobalSettingsView />
    </>
  )
}

export default GlobalSettings
