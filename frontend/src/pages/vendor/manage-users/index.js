import React from 'react';

import { Helmet } from 'react-helmet-async';
// Sections
import { ManageUsersView } from 'src/sections/vendor/manage-users/view';

const ManageUsers = () => {
  return (
    <>
      <Helmet>
        <title>Manage users</title>
      </Helmet>

      <ManageUsersView />
    </>
  );
};

export default ManageUsers;
