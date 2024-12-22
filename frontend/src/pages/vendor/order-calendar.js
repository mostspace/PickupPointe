import React from 'react'

import { Helmet } from 'react-helmet-async';
// Sections
import { OrderCalendarView } from 'src/sections/vendor/order-calendar/view';

const OrderCalendar = () => {
  return (
    <>
      <Helmet>
        <title>Order Calendar</title>
      </Helmet>

      <OrderCalendarView />
    </>
  )
}

export default OrderCalendar
