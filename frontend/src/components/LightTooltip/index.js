import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import {styled } from "@mui/material";

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip 
      {...props} 
      classes={{ popper: className }} 
      enterTouchDelay={0}
      leaveTouchDelay={3000}
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#FEFEFF',
    border: '1px solid var(--stroke-12, rgba(0, 0, 0, 0.12))',
    color: '#181818',
    boxShadow: '0px 1px 5px 0px rgba(27, 26, 33, 0.10)',
    borderRadius: '12px',
    fontSize: '14px',
    fontFamily: 'Gilroy',
    padding: '22px 16px',
    lineHeight: '22px',
    fontWeight: '400',
  },
}));

export default LightTooltip;
  