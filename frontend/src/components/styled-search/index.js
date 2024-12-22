
// @mui
import {
  styled, alpha, OutlinedInput,
} from '@mui/material';

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 320,
  height: 40,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 464,
    // boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    '&.Mui-focused': {
      width: '100%',
    },
  },
}));

export default StyledSearch;