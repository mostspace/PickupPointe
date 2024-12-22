// @mui
import { styled } from '@mui/material/styles';
import { ListItemIcon, ListItemButton } from '@mui/material';

// ----------------------------------------------------------------------

export const StyledNavItem = styled((props) => <ListItemButton disableGutters {...props} />)(({ theme }) => ({
  padding: '12px',
  height: 50,
  fontFamily: 'Gilroy',
  position: 'relative',
  fontWeight: 500,
  textTransform: 'normal',
  color: theme.palette.text.secondary,
  borderRadius: theme.shape.borderRadius,
  '&.active': {
    color: theme.palette.text.primary, // Correct theme access
    backgroundColor: 'rgba(145, 158, 171, 0.05)', // Correct background color from theme
    fontFamily: 'Gilroy-Medium',
    filter: 'brightness(0.5)', // Adjusted dim effect for active state
  },
}));

export const StyledNavItemIcon = styled(ListItemIcon)({
  width: 22,
  height: 22,
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});
