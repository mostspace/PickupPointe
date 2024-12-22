import { Button } from '@mui/material';
import React from 'react';

const SecondaryButton = ({ value, size, bg, color, weight, height, click, btnStatus }) => {
  return (
    <Button
      sx={{
        background: '#F5F5F5',
        width: size,
        fontSize: '14px',
        color: 'black',
        padding: '8px 40px',
        borderRadius: '8px',
        fontWeight: weight ? weight : '400',
        textTransform: 'unset',
        fontFamily: '"Gilroy", sans-serif',
        fontStyle: 'normal',
        letterSpacing: 'unset',
        height: height ? height : '44px',
        "&:hover": {
          background: '#F5F5F5',
        },
        "&:disabled": {
          background: '#ccc',
          color: '#999'
        }
      }}
      onClick={click}
      disabled={btnStatus}
    >
      {value}
    </Button>
  );
};

export default SecondaryButton;
