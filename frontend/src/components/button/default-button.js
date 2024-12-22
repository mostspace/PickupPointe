import { Button } from '@mui/material';
import ButtonLoader from '../button-loader/ButtonLoader';

const DefaultButton = ({ value, size, bg, color, weight, height, click, btnStatus, loading, ...props }) => {
  const buttonStyles = {
    width: size ? size : 'auto',
    height: height || '44px',
    fontFamily: 'Gilroy',
    fontSize: '14px',
    padding: '8px 40px',
    lineHeight: '1.2',
    borderRadius: '8px',
    textTransform: 'unset',
  };

  return (
    <Button
      {...props}
      sx={{
        ...buttonStyles,
        ...(loading ? {
          color: "#F14445",
          border: "1px solid red",
          backgroundColor: "transparent",
          '&:hover': {
            backgroundColor: "transparent",
          },
        } : {
          color: '#ffffff',
          backgroundColor: '#F14445',
          '&:hover': {
            backgroundColor: '#E13031',
          },
          "&:disabled": {
            background: '#ccc',
            color: '#999'
          }
        })
      }}
      disabled={btnStatus || loading}
    >
      {loading ? (
        <>
          <ButtonLoader /> {value}
        </>
      ) : (
        value
      )}
    </Button>
  );
};

export default DefaultButton;
