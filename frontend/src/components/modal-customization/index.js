import React, { useEffect, useState } from 'react';
// @mui
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  Grid,
  IconButton,
  Typography,
  Button,
  Radio,
  FormControlLabel,
} from '@mui/material';
// Components
import ProductItem from 'src/components/product-item';
import IncrementerButton from 'src/components/incrementer-button';
// Assets
import {ic_cart, UploadImg} from 'src/assets';
// Icons
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import PropTypes from 'prop-types';
import CustomizationOptions from 'src/components/customization-options';
import { useDispatch, useSelector } from 'react-redux';
import { addModifierPrices } from 'src/reducers/cartSlice';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Item from "../customization-options/item.js";

function ModalCustomization({
  isOpenModal,
  onCloseModal,
  selectedProduct,
  quantities,
  onDecrease,
  onIncrease,
  available = 100,
  onAddToCart,
  redirect
}) {
  const marketState = useSelector((state) => state.market);
  const vendorProfile = marketState.shop;
  const [modifierPrices, setModifierPrices] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState("");

  const handleChangePrice = (prices, selected) => {
    setSelectedItems(Array.from(selected));
    setModifierPrices(prices);
  }

  const handleCloseModal = () => {
    onCloseModal();
    setTimeout(() => {
      setModifierPrices([]);
      setSelectedItems([]);
      setSelectedVariant("");
      setQuantity(1);
    }, 1000);
  }

  return (
    <React.Fragment>
      <Dialog
        className='w-full'
        open={isOpenModal}
        onClose={handleCloseModal}
        scroll='paper'
        sx={{
          width: '100% !important',
        }}
      >
        <IconButton className='absolute right-7 top-7 bg-secondary' onClick={onCloseModal}>
          <CloseOutlinedIcon sx={{ color: '#181818', fontSize: '20px' }} />
        </IconButton>
        <DialogTitle className='pt-[32px] sm:!pt-[64px] pb-[32px] sm:px-[40px]'>
          <Typography variant='h5' className='text-[20px] sm:text-[32px]'>Customization options</Typography>
        </DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
          <DialogContentText tabIndex={-1}>
            <Grid container spacing={4} className='sm:px-[20px]'>
              <Grid item xs={12} md={5}>
                {selectedProduct && (
                  <ProductItem
                    item={selectedProduct}
                    quantity={quantities[selectedProduct._id]}
                    unit=''
                    onDecrease={() => {}}
                    onIncrease={() => {}}
                    disabledDecrease={quantities[selectedProduct._id] <= 0}
                    disabledIncrease={quantities[selectedProduct._id] >= available}
                    onAddToCart={() => {}}
                    cart={false}
                    incrementer={false}
                  />
                )}
                {selectedProduct?.variants?.isUse && selectedProduct?.variants?.attributes?.length > 0 && (
                  <div className="w-full flex flex-col gap-[24px] p-[15px] border rounded-[8px] mt-[24px]">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <Typography variant="h6">Pick one</Typography>
                      </div>
                    </div>
                    <div className="item-container overflow-hidden transition-all duration-100 max-h-screen">
                      <div className="flex flex-col gap-[12px]">
                        {selectedProduct?.variants?.attributes?.map((item) => (
                          <div
                            key={`variant_options_${item}`}
                            className={`modifier-item w-full border rounded-[6px] px-[16px] cursor-pointer ${selectedVariant === item ? 'border-red-500' : 'border-gray-300'}`}
                            onClick={() => setSelectedVariant(item)}
                          >
                            <div className="flex items-center">
                              <FormControlLabel
                                control={<Radio checked={selectedVariant === item}
                                sx={{color: '#A3A3A3', '&.Mui-checked': {color: '#F14445',}, margin: '0'}}
                                />}
                                name={`radio-buttion-variant}`}
                                label={(
                                  <Typography variant="subtitle2"><span className={"capitalize"}>{item}</span></Typography>
                                )}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </Grid>
              <Grid item xs={12} md={7}>
                <CustomizationOptions
                  modifiers={selectedProduct?.modifiers}
                  selectedModifiers={selectedItems}
                  handleChangePrice={handleChangePrice}
                />
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions className='!px-[22px] !py-[32px] sm:!px-[60px] !gap-[14px]'>
          <div className='w-full flex justify-end items-center gap-[32px]'>
            {selectedProduct && (
              <IncrementerButton
                quantity={quantity}
                unit=''
                onDecrease={() => { setQuantity(quantity - 1 < 0 ? 0 : quantity - 1); }}
                onIncrease={() => { setQuantity(quantity + 1 > available ? available : quantity + 1); }}
                disabledDecrease={quantity - 1 <= 0}
                disabledIncrease={quantity + 1 >= available}
              />
            )}
            <Button
              className=''
              onClick={() => {
                if (onAddToCart) {
                  onAddToCart({
                    vendor: vendorProfile._id,
                    itemId: selectedProduct._id,
                    modifierPrices,
                    selectedItems,
                    quantity,
                    selectedVariant
                  });
                }
                handleCloseModal();
                if (redirect) {
                  setTimeout(() => { redirect(); }, 300);
                }
              }}
              sx={{
                height: '44px',
                fontFamily: 'Gilroy',
                fontSize: '14px',
                color: '#ffffff',
                borderRadius: '8px',
                backgroundColor: '#F14445',
                padding: '0 24px',
                textTransform: 'unset',
                '&:hover': {
                  backgroundColor: '#E13031',
                }
              }}
              startIcon={<img src={ic_cart} className='mr-2'/>}
            >
              Add to cart
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

ModalCustomization.propTypes = {
  isOpenModal: PropTypes.bool.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  selectedProduct: PropTypes.object,
  quantities: PropTypes.object,
  onDecrease: PropTypes.func.isRequired,
  onIncrease: PropTypes.func.isRequired,
  available: PropTypes.number,
};

export default ModalCustomization;