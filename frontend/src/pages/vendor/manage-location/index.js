import React from 'react'
import { Helmet } from 'react-helmet-async';
// Sections
import { ManageLocationView } from 'src/sections/vendor/manage-location/view';

const ManageLocation = () => {
  return (
    <>
      <Helmet>
        <title>Manage Location</title>
      </Helmet>

      <ManageLocationView />
    </>
  )
}

export default ManageLocation;