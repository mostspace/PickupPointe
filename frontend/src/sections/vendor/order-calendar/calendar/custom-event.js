import React from 'react';

const CustomEventComponent = ({ event }) => {

  return (
    <div className={`custom-event text-heading font-medium font-gilroy mx-1 px-1 rounded-[3px] mt-1 overflow-hidden`} style={event.style}>
      <div className='text-[11px]'>{event.title}</div>
      {/*<div className='text-[11px]'>{event.description}</div>*/}
    </div>
  );
};

export default CustomEventComponent;
