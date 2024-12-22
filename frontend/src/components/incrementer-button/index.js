import PropTypes from 'prop-types';
import { forwardRef } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
// components
import Iconify from 'src/components/iconify';
import { Button } from '@mui/material';
import useCartProductItem from 'src/hooks/use-cart-product-item';

// ----------------------------------------------------------------------

const IncrementerButton = forwardRef(
  ({ quantity, unit='', onIncrease, onDecrease, disabledIncrease, disabledDecrease, handleCustomizationOptionsOpen, sx, ...other }, ref) => {
    return (
      (
        <Stack
          ref={ref}
          flexShrink={0}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            p: 0.5,
            width: 108,
            borderRadius: 1,
            typography: 'subtitle2',
            border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.2)}`,
            ...sx,
          }}
          {...other}
        >
          <IconButton
            size="small"
            onClick={onDecrease}
            disabled={disabledDecrease}
            sx={{ borderRadius: 0.75 }}
          >
            <Iconify icon="eva:minus-fill" width={16} />
          </IconButton>
    
          <div className='px-2' onClick={() => {
            if (handleCustomizationOptionsOpen) {
              handleCustomizationOptionsOpen();
            } else {
              console.error('handleCustomizationOptionsOpen is not defined');
            }          
          }}>
            {quantity + unit}
          </div>
    
          <IconButton
            size="small"
            onClick={onIncrease}
            disabled={disabledIncrease}
            sx={{ borderRadius: 0.75 }}
          >
            <Iconify icon="mingcute:add-line" width={16} />
          </IconButton>
        </Stack>
      )
    )
  }
);

IncrementerButton.propTypes = {
  disabledDecrease: PropTypes.bool,
  disabledIncrease: PropTypes.bool,
  onDecrease: PropTypes.func,
  onIncrease: PropTypes.func,
  handleCustomizationOptionsOpen: PropTypes.func,
  quantity: PropTypes.number,
  sx: PropTypes.object,
};

export default IncrementerButton;
