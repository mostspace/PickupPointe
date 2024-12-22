import React from 'react'

import { Helmet } from 'react-helmet-async';
// Sections
import { NotificationsView } from 'src/sections/vendor/notifications/view';

const Notifications = () => {
  return (
    <>
        <Helmet>
            <title>Notifications</title>
        </Helmet>

        <NotificationsView />
    </>
  )
}

export default Notifications
