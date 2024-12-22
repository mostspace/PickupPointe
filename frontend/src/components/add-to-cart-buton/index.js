import PropTypes from 'prop-types';
import { forwardRef, useState } from 'react';
// @mui
import { Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
// components
import Iconify from 'src/components/iconify';
import IncrementerButton from '../incrementer-button';

// ----------------------------------------------------------------------

const AddToCartButton = forwardRef(
  (
    {
      cart,
      quantity,
      unit = '',
      onIncrease,
      onDecrease,
      disabledIncrease,
      disabledDecrease,
      className = '',
      onAddToCart,
      handleCustomizationOptionsOpen
    },
    ref
  ) => {
    const [timeoutIncre, setIncreTimeout] = useState(null);
    const [isShowIncrementer, setShowIncrementer] = useState(false);

    if (cart) {
      return null;
    }

    const shouldShowIncrementor = !quantity || quantity <= 0;
    if (shouldShowIncrementor) {
      return (
        <IconButton
          className={`bg-white/90 hover:bg-primary hover:text-white ${className}`}
          onClick={onAddToCart}
        >
          <Iconify
            icon='mingcute:add-line'
            width={16}
          />
        </IconButton>
      );
    }

    return (
      <div
        ref={ref}
        className={className}
        onMouseEnter={() => {
          timeoutIncre && clearTimeout(timeoutIncre);
          setShowIncrementer(true);
        }}
        onMouseLeave={() => {
          setIncreTimeout(setTimeout(() => setShowIncrementer(false), 100));
        }}
      >
        {!isShowIncrementer && (
          <IconButton className='bg-primary/90 hover:bg-primary min-w-[32px] h-[32px]'>
            <Typography className='text-white font-medium'>
              {quantity}
            </Typography>
          </IconButton>
        )}
        {isShowIncrementer && (
          <IconButton
            className={`bg-primary/90 hover:bg-primary min-w-[32px] h-[32px] text-white`}
            onClick={onAddToCart}
          >
            <Iconify
              icon='mingcute:add-line'
              width={16}
            />
          </IconButton>
        )}
      </div>
    );
  }
);

AddToCartButton.propTypes = {
  cart: PropTypes.bool,
  disabledDecrease: PropTypes.bool,
  disabledIncrease: PropTypes.bool,
  onDecrease: PropTypes.func,
  onIncrease: PropTypes.func,
  handleCustomizationOptionsOpen: PropTypes.func,
  quantity: PropTypes.number,
  className: PropTypes.string,
  unit: PropTypes.string,
  onAddToCart: PropTypes.func,
};
AddToCartButton.displayName = 'AddToCartButton';

export default AddToCartButton;
