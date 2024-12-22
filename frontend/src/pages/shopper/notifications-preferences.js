import React from 'react'

import { Helmet } from 'react-helmet-async';
// Sections
import { NotificationsPreferencesView } from 'src/sections/shopper/notifications-preferences/view';

const NotificationsPreferences = () => {
  return (
    <>
      <Helmet>
        <title>Notifications Preferences</title>
      </Helmet>

      <NotificationsPreferencesView />
    </>
  )
}

export default NotificationsPreferences
