import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

// ----------------------------------------------------------------------

export default function Select(theme) {
    return {
      MuiSelect: {
        defaultProps: {
          IconComponent: KeyboardArrowDownOutlinedIcon,
        },
        styleOverrides: {
            icon: {
              right: 9,
              width: 24,
              height: 24,
              top: 'calc(50% - 12px)', // This centers the icon vertically
            },
        },
      },
    };
  }
  