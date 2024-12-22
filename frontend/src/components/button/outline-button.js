import { Button } from '@mui/material';
import React from 'react';

const OutlineButton = ({ value, size, bg, color, weight, height, click, btnStatus, ...props }) => {
  return (
    <Button {...props}
      variant="outlined" 
      sx={{
        width: 'auto',
        height: '44px',
        fontFamily: 'Gilroy',
        fontSize: '14px',
        padding: '8px 40px',
        color: '#ffffff',
        borderRadius: '8px',
        backgroundColor: '#F14445',
        textTransform: 'unset',
        '&:hover': {
          backgroundColor: '#E13031',
        }
      }}
      disabled={btnStatus}
    >
      {value}
    </Button>
  );
};

export default OutlineButton;
