import React from 'react'

import { Helmet } from 'react-helmet-async';
// Sections
import { AddDropOffView } from 'src/sections/vendor/manage-location/add-drop-off/view';

const AddDropOff = () => {
  return (
    <>
      <Helmet>
        <title>Add New Drop-Off</title>
      </Helmet>

      <AddDropOffView />
    </>
  )
}

export default AddDropOff