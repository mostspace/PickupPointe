import React from 'react'

import { Helmet } from 'react-helmet-async';
// Sections
import { GiveUsFeedbackView } from 'src/sections/merchant/settings/give-us-feedback/view';

const GiveUsFeedback = () => {
  return (
    <>
      <Helmet>
        <title>Give us feedback</title>
      </Helmet>

      <GiveUsFeedbackView />
    </>
  )
}

export default GiveUsFeedback
