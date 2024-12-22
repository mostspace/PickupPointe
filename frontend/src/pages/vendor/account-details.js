import React from 'react'

import { Helmet } from 'react-helmet-async';
// Sections
import { AccountDetailsView } from 'src/sections/vendor/account-details/view';

const AccountDetails = () => {
  return (
    <>
      <Helmet>
        <title>Account details</title>
      </Helmet>

      <AccountDetailsView />
    </>
  )
}

export default AccountDetails
