import React from 'react'

import { Helmet } from 'react-helmet-async';
// Sections
import { MakeOrderView } from 'src/sections/shopper/make-order/view';

const MakeOrder = () => {
  return (
    <>
        <Helmet>
            <title>Make Order</title>
        </Helmet>

        <MakeOrderView />
    </>
  )
}

export default MakeOrder