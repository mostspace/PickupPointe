import React from 'react'

import { Helmet } from 'react-helmet-async';
// Sections
import { PersonalInformationView } from 'src/sections/shopper/personal-information/view';

const PersonalInformation = () => {
  return (
    <>
        <Helmet>
            <title>Account details</title>
        </Helmet>

        <PersonalInformationView />
    </>
  )
}

export default PersonalInformation
