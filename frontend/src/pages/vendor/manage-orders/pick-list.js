import React from 'react'

import { Helmet } from 'react-helmet-async';
// Sections
import PickListView from 'src/sections/vendor/manage-orders/pick-list';

const PickList = () => {
  return (
    <>
      <Helmet>
        <title>Pick List</title>
      </Helmet>

      <PickListView />
    </>
  )
}

export default PickList
