import React from 'react'
import { Helmet } from 'react-helmet-async';

// Sections
import { AddAdditionalChargeView } from 'src/sections/merchant/all-orders/add-additional-charge/view';

const AddAdditionalCharge = () => {
  return (
    <>
      <Helmet>
        <title>Add additional charge</title>
      </Helmet>

      <AddAdditionalChargeView/>
    </>
  )
}

export default AddAdditionalCharge
