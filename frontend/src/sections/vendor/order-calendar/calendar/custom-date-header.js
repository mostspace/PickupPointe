import React from 'react';

const CustomDateHeader = ({ label, status }) => {
  return (
    <div className='flex justify-between items-center px-1 mt-2' style={{minWidth: 118.6}}>
      <div className='font-gilroy text-[12px] text-heading'>{label}</div>
    </div>
  );
};

export default CustomDateHeader;
