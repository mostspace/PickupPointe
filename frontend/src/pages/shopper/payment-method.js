import React from 'react'

import { Helmet } from 'react-helmet-async';
// Sections
import { PaymentMethodView } from 'src/sections/shopper/payment-method/view';

const PaymentMethod = () => {
  return (
    <>
      <Helmet>
        <title>Payment Method</title>
      </Helmet>

      <PaymentMethodView />
    </>
  )
}

export default PaymentMethod
