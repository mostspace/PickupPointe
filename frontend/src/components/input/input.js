
import { alpha, styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
      marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
      borderRadius: 8,
      position: 'relative',
      backgroundColor: '#ffffff',
      border: '1px solid rgba(0, 0, 0, 0.08)',
      borderColor: 'rgba(0, 0, 0, 0.08)',
      fontSize: 14,
      width: '100%',
      padding: '10px 12px',
      transition: theme.transitions.create([
        'border-color',
        'background-color',
        'box-shadow',
      ]),
      fontFamily: [
        'Gilroy',
        'sans-serif',
      ].join(','),
      '&:focus': {
        // boxShadow: `${alpha('rgba(0, 0, 0, 0.08)', 0.25)} 0 0 0 0.2rem`,
        borderColor: '#F14445',
      },
    },
}));    

export default BootstrapInput;