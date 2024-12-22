import React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';

// Define the marks
const marks = [
  {
    value: 5,
    label: '5',
  },
  {
    value: 10,
    label: '10',
  },
  {
    value: 15,
    label: '15',
  },
  {
    value: 20,
    label: '20',
  },
  {
    value: 25,
    label: '25',
  },
  {
    value: 30,
    label: '30',
  },
  {
    value: 35,
    label: '35',
  },
  {
    value: 40,
    label: '40',
  },
  {
    value: 45,
    label: '45',
  },
  {
    value: 50,
    label: '50',
  },
];

// Styled Slider component
const IOSSlider = styled(Slider)(({ theme }) => ({
  color: '#F14445',
  height: 5,
  padding: '14px 0',
  '& .MuiSlider-thumb': {
    height: 12,
    width: 12,
    backgroundColor: '#fff',
    boxShadow: '0 1px 5px 1px rgba(27, 26, 33, 0.2)',
    '&:focus, &:hover, &.Mui-active': {
      boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 0.1)',
      '@media (hover: none)': {
        boxShadow: '0 1px 5px 1px rgba(27, 26, 33, 0.2)',
      },
    },
    '&:before': {
      boxShadow:
        '0px 0px 1px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 1px 0px rgba(0,0,0,0.12)',
    },
  },
  '& .MuiSlider-track': {
    border: 'none',
    height: 5,
  },
  '& .MuiSlider-rail': {
    boxShadow: 'inset 0px 0px 4px -3px #000',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  '& .MuiSlider-mark': {
    backgroundColor: 'transparent', // Makes marks visible only as labels
    height: 8,
    width: 2,
    marginTop: -1.5,
  },
  '& .MuiSlider-markLabel': {
    color: theme.palette.text.primary,
    fontFamily: 'Gilroy',
    fontSize: 12,
    top: 34, // Adjusts the position of the label
    transform: 'translateX(-50%)', // Center aligns the labels over the marks
    '@media (max-width: 600px)': {
      // Media query for mobile devices
      transform: 'none', // Removes custom positioning
      fontSize: 10, // Optionally adjust font size on mobile
    },
  },
  '& .MuiSlider-valueLabel': {
    fontSize: 12,
    fontWeight: 'normal',
    top: -6,
    fontFamily: 'Gilroy',
    backgroundColor: 'white',
    boxShadow: '0 1px 5px 1px rgba(27, 26, 33, 0.2)',
    color: theme.palette.text.primary,
    padding: '4px',
    borderRadius: '4px',
    '&::before': {
      display: 'none',
    },
    '& *': {
      background: 'white',
      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
    },
  },
  '& .MuiSlider-markLabel[data-index="0"]': {
    '@media (max-width: 600px)': {
        textAlign: 'center',
    },
    transform: 'translateX(0)', // Aligns the first mark label to the left
    textAlign: 'left',
  },
  '& .MuiSlider-markLabel[data-index="9"]': {
    '@media (max-width: 600px)': {
        transform: 'translateX(-50%)',
        textAlign: 'center',
    },
    transform: 'translateX(-100%)', // Aligns the last mark label to the right
    textAlign: 'right',
  },
}));

// Slider component
export default function LocationSlider({isDisabled, onChange, value}) {
  return (
    <Box sx={{ width: '100%', fontFamily: 'Gilroy'  }}>
      <IOSSlider
        min={5}
        max={50}
        aria-label="Custom marks"
        getAriaValueText={valuetext}
        step={5}
        marks={marks}
        valueLabelDisplay="auto" // Display the tooltip
        valueLabelFormat={(value) => `${value} miles`} // Format the label
        disabled={isDisabled}
        onChange={onChange}
        value={value}
        sx={isDisabled ? {
          '& .MuiSlider-markLabel': {
            color: '#B0B0B0',
          },
        } : {}}
      />
    </Box>
  );
}

// Function to format value text
function valuetext(value) {
  return `${value} miles`;
}
