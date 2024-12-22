import React, { useState, useEffect } from 'react';
import { useScrollTrigger } from '@mui/material';

import Fab from '@mui/material/Fab';
import NavigationIcon from '@mui/icons-material/Navigation';

export default function FloatingActionButtons() {
  const [showButton, setShowButton] = useState(false);
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100, // Adjust this value if needed
  });

  useEffect(() => {
    setShowButton(trigger);
  }, [trigger]);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-10 right-10 z-50" style={{ display: showButton ? 'block' : 'none' }}> 
      <Fab color="primary" aria-label="add" onClick={handleClick} sx={{ boxShadow: '0 0 2px #a7b2b2, 0 4px 12px rgba(0, 0, 0, .36), inset 0 0 0 0.5px hsla(0, 0%, 93%, .36)' }}>
        <NavigationIcon />
      </Fab>
    </div>
  );
}