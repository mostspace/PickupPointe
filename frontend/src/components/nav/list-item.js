
// @mui
import { styled } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';

const CustomListItem = styled(ListItemButton, {
    shouldForwardProp: (prop) =>
      prop !== 'active' && prop !== 'open' && prop !== 'offsetTop' && prop !== 'subItem',
    })(({ active, open, offsetTop, subItem, theme }) => {
    return {
      ...theme.typography.subtitle2,
      padding: 0,
      height: '100%',
      fontFamily: 'Gilroy-Medium',
      color: theme.palette.text.primary,
      transition: theme.transitions.create(['opacity'], {
        duration: theme.transitions.duration.shorter,
      }),
      '&:hover': {
        fontWeight: '600',
        filter: 'brightness(0)',
        backgroundColor: 'transparent',
      },
      // offsetTop
      ...(offsetTop && {
        color: theme.palette.text.primary,
      }),
      // Active
      ...(active && {
        color: '#181818',
        fontWeight: '900',
        transition: '0.3s',
        fontFamily: 'Gilroy-Bold',
        filter: 'brightness(0)',
        // '&::before': dotActive,
      }),
      // Open
      ...(open && {
        fontWeight: '600',
      }),
    };
});

export default CustomListItem;