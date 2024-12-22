import React from 'react'
import { Helmet } from 'react-helmet-async';

// Sections
import Main from 'src/sections/merchant/manage-items';

const ManageItems = () => {
  return (
    <>
      <Helmet>
        <title>Manage items</title>
      </Helmet>

      <Main />
    </>
  )
}

export default ManageItems
