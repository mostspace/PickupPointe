import React from 'react';
import Main from '../main';
import { _userList } from 'src/_mock/assets';

const PersonalInformationView = ({ userId }) => {
  // Assuming `userId` is passed as a prop
  const formData = _userList[0];

  if (!formData) {
    return <div>User not found</div>;
  }

  return (
    <>
      <Main formData={formData} />
    </>
  );
};

export default PersonalInformationView;
