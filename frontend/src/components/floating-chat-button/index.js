import React from 'react';

import Fab from '@mui/material/Fab';

import {icChat} from 'src/assets';

export default function FloatingChatButton() {

  return (
    <div className="fixed bottom-16 sm:bottom-40 right-6 sm:right-12 z-50"> 
      <Fab aria-label="add" sx={{padding: '16px'}}>
        <img src={icChat} className='w-[32px] h-[32px]'/>
      </Fab>
    </div>
  );
}