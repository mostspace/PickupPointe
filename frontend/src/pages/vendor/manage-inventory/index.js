import React from 'react'

import { Helmet } from 'react-helmet-async';
// Sections
import { ManageInventoryView } from 'src/sections/vendor/manage-inventory/view';

const ManageInventory = () => {
  return (
    <>
        <Helmet>
            <title>Manage Inventory</title>
        </Helmet>

        <ManageInventoryView />
    </>
  )
}

export default ManageInventory
