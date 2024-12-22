import React from 'react'
import { Helmet } from 'react-helmet-async';
// Sections
import { DropOffDetailsView } from 'src/sections/vendor/manage-inventory/drop-off-details/view';

const DropOffDetails = () => {
  return (
    <>
      <Helmet>
        <title>Drop-Off Details</title>
      </Helmet>

      <DropOffDetailsView />
    </>
  )
}

export default DropOffDetails
