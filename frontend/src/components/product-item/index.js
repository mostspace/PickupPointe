import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
// @mui
import {
  Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, IconButton
} from '@mui/material'
// Components
import AddToCartButton from 'src/components/add-to-cart-buton'
import IncrementerButton from 'src/components/incrementer-button'
// Assets
import { ic_cart, icDeal, soldOutImg} from 'src/assets'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import {discountType, scheduleType} from "src/constants";
import dayjs from "dayjs";
import {useSelector} from "react-redux";
import { useSocket } from 'src/contexts/socketContext.js';
import {toast} from "react-toastify";
// ==============================================================================================

const ProductItem = ({ item, imgSrc, name, description, priceRange, quantity, unit, onDecrease, onIncrease,
  disabledDecrease, disabledIncrease, onAddToCart, cart, incrementer, handleCustomizationOptionsOpen }) => {

  const canEditItemOnImageClick = !cart && quantity > 0;
  const {locationId} = useSelector(state => state.market);
  const [disableAddCart, setDisableAddCart] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    const key = `${locationId}.${item._id}`;

    if (locationId && item._id) {
      socket.emit("order.get_current_stock", key)
      socket.on(`order.current_stock.${key}`, count => {
        console.log(count, count === 0)
        setDisableAddCart(count === 0);
      });
    }
    return () => {
      socket.off(`order.current_stock.${key}`)
    }
  }, [locationId, item._id]);



  const onEditItem = ()=>{
    if(!canEditItemOnImageClick){
      return;
    }
    onAddToCart();
  }

  // Product detail modal
  const [openDetailModal, setOpenDetailModal] = React.useState(false);
  const handleDetailModalOpen = () => setOpenDetailModal(true);
  const handleDetailModalClose = () => setOpenDetailModal(false);

  const getDiscountTypeDesc = (type, value = 0) => {
    type = type.toString()
    switch (type) {
      case discountType['one-free']:
        return `Buy One Get One Free - ${value}% Off`;
      case discountType['percent-off']:
        return `${value}% Off`;
      case discountType['dollar-off']:
        return `$${value} Off`;
    }
  }

  const getOrdinal = (day) => {
    const suffix = ['th', 'st', 'nd', 'rd'];
    const value = day % 100;
    return day + (suffix[(value - 20) % 10] || suffix[value] || suffix[0]);
  };

  const getDiscountPeriodDesc = (timeFrom, timeTo, type, date) => {
    type = type.toString();
    let desc = "From ";
    let startTime = new Date();
    startTime.setHours(timeFrom.hour);
    startTime.setMinutes(timeFrom.minute);

    let endTime = new Date();
    endTime.setHours(timeTo.hour);
    endTime.setMinutes(timeTo.minute);

    if (type === scheduleType['day']) {
      desc += `${dayjs(startTime).format("h:mm A")} to ${dayjs(endTime).format("h:mm A")}`;
    } else if (type === scheduleType['week']) {
      desc += `${dayjs(startTime).format("h:mm A")} to ${dayjs(endTime).format("h:mm A")} every ${date.join(", ")}`;
    } else if (type === scheduleType['month']) {
      desc += `${dayjs(startTime).format("h:mm A")} to ${dayjs(endTime).format("h:mm A")} on the `;
      const formattedDays = date.map(getOrdinal);
      desc += formattedDays.length > 1 ? `${formattedDays.slice(0, -1).join(', ')} and ${formattedDays[formattedDays.length - 1]}` : formattedDays[0];
      desc += " of every month";
    } else if (type === scheduleType['year']) {
      let startDate = new Date();
      startDate.setMonth(date.from.month - 1);
      startDate.setDate(date.from.day);

      let endDate = new Date();
      endDate.setMonth(date.to.month - 1);
      endDate.setDate(date.to.day);

      desc +=`${dayjs(startDate).format('MMM D, YYYY')} to ${dayjs(endDate).format('MMM D, YYYY')}`;
      desc += `, From ${dayjs(startTime).format("h:mm A")} to ${dayjs(endDate).format("h:mm A")}`;
    } else {
      return "";
    }
    return desc;
  }

  return (
    <>
      <div
        className="flex flex-col click-item bg-[#FEFEFF] rounded-[16px] border-[#f9f9fa] shadow-[0_1px_4px_0_rgba(0,0,0,0.04)] z-10 hover:shadow-md transition duration-300 ease-in-out overflow-hidden cursor-pointer"
      >
        <div className='flex justify-center items-center bg-[#f8fbf5] h-[164px] rounded-t-[16px] relative'>
          <img
            loading="lazy"
            src={item.photo}
            onClick={handleDetailModalOpen}
            alt={item.name}
            className={`hover:scale-105 duration-300 w-full h-full object-cover absolute inset-0`}
          />

          {incrementer && (
            <AddToCartButton
              className='absolute bottom-[12px] right-[12px] z-50'
              cart={cart}
              quantity={quantity}
              unit={unit}
              onDecrease={(event) => {
                event.stopPropagation();
                onDecrease();
              }}
              onIncrease={(event) => {
                event.stopPropagation();
                onIncrease();
              }}
              disabledDecrease={disabledDecrease}
              disabledIncrease={disabledIncrease && disableAddCart}
              onAddToCart={(event) => {
                event.stopPropagation();
                /*disableAddCart
                  ? toast("This item is currently out of stock.", {type: "error", className: 'toast-custom'})
                  : */onAddToCart();
              }}
              handleCustomizationOptionsOpen={handleCustomizationOptionsOpen}
            />
          )}

          {disableAddCart && (
            <div className='w-full h-[35px] bg-[rgba(24,24,24,0.45)] backdrop-blur-md absolute bottom-[10px] z-50 flex justify-center items-center'>
              <Typography variant='subtitle3' className='text-white font-gilroyMedium pb-1'>Currently Out of Stock</Typography>
            </div>
            // <img 
            //   src={soldOutImg}
            //   alt={"sold out"}
            //   className="absolute top-[15px] left-[15px] object-contain z-10"
            // />
          )}
        </div>
        <div onClick={handleDetailModalOpen} className="flex flex-col gap-[24px] p-[20px]">
          <div className="flex flex-col gap-[9px]">
            <div className="flex flex-col gap-[4px]">
              <Typography variant="h6" className="capitalize line-clamp-1">
                {item.name}
              </Typography>
              <Typography variant="label" className='line-clamp-2'>{item.description}</Typography>
            </div>
            <div className="flex flex-col gap-[12px]">
              <div className="flex justify-between">
                <Typography variant="subtitle3">Price</Typography>
                <Typography variant="subtitle2">${item.defaultPrice}</Typography>
              </div>
              <div className='flex justify-between items-center gap-[8px]'>
                <div className="flex gap-[8px] items-center">
                  <img src={icDeal} className="w-[16px]"/>
                  <Typography variant="subtitle3" className='text-[14px] sm:text-[12px]'>Deal: <i>Buy one get one free</i></Typography>
                  {/* <Typography variant="subtitle2">{stock}</Typography> */}
                </div>
              </div>
            </div>
          </div>
          {cart && (
            <div className={`flex items-center ${incrementer ? 'justify-between' : 'justify-end'}`}>
              {incrementer && (
                <>
                  <IncrementerButton
                    quantity={quantity}
                    unit={unit}
                    onDecrease={onDecrease}
                    onIncrease={onIncrease}
                    disabledDecrease={disabledDecrease}
                    disabledIncrease={disabledIncrease}
                    handleCustomizationOptionsOpen={() => {
                      console.log("bbbbbbbbbbbbbbbbb")
                    }}
                  />
                  {/* <IconButton
                    className="bg-primary hover:bg-primary"
                    onClick={onAddToCart}
                  >
                    <img src={ic_cart} />
                  </IconButton> */}
                  <Button
                    className=''
                    onClick={onAddToCart}
                    sx={{
                      height: '44px',
                      fontFamily: 'Gilroy',
                      fontSize: '14px',
                      color: '#ffffff',
                      borderRadius: '8px',
                      padding: '0 10px',
                      backgroundColor: '#F14445',
                      textTransform: 'unset',
                      '&:hover': {
                        backgroundColor: '#E13031',
                      }
                    }}
                    startIcon={<img src={ic_cart} className='mr-1'/>}
                  >
                    Add to cart
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <React.Fragment>
        <Dialog
          className="w-full"
          open={openDetailModal}
          onClose={handleDetailModalClose}
          scroll='paper'
          sx={{ width: "100% !important" }}
        >
          <IconButton className='absolute right-7 top-7 bg-secondary' onClick={handleDetailModalClose}>
            <CloseOutlinedIcon sx={{ color: '#181818', fontSize: '20px' }} />
          </IconButton>
          <DialogTitle className='pt-[32px] sm:!pt-[64px] sm:px-[80px]'>
            <Typography variant='h3' className='font-giloryMedium'>Item Details</Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText tabIndex={-1}>
              <div className="flex flex-col gap-[32px] sm:px-[60px] py-[15px] sm:py-[32px]">
                <div className='flex flex-col gap-[16px]'>
                  <img loading='lazy' src={item.photo} alt={item.name} className='object-cover w-full h-[236px] rounded-[8px]' />
                  <div className='flex flex-col gap-[5px]'>
                    <Typography variant='h5'>{item.name}</Typography>
                    <Typography variant='h5'>${item.defaultPrice}</Typography>
                  </div>
                </div>
                <div className='flex flex-col gap-[8px]'>
                  <Typography variant='h6' className='font-gilroyMedium'>Description of item</Typography>
                  <Typography variant='subtitle2'>{item.description}</Typography>
                </div>
                <div className='flex flex-col gap-[8px]'>
                  <Typography variant='h6' className='font-gilroyMedium'>Nutritional facts of item</Typography>
                  <div className='flex flex-col gap-[5px]'>
                    <Typography variant='subtitle2'>{item.nutritionalInformation}</Typography>
                  </div>
                  {/* <div className='flex flex-col gap-[5px]'>
                    <Typography variant='subtitle2'>Serving Size: Generally 1 slice (depending on the size of the pizza)</Typography>
                    <Typography variant='subtitle2'>Calories: Approximately 250-300 per slice</Typography>
                    <Typography variant='subtitle2'>Total Fat: Around 10-14g per slice</Typography>
                    <Typography variant='subtitle2'>Saturated Fat: Approximately 5-7g</Typography>
                    <Typography variant='subtitle2'>Cholesterol: About 20-30mg</Typography>
                  </div> */}
                </div>
                {item.isUseTimePromotion && (
                  <div className='flex flex-col gap-[8px]'>
                    <Typography variant='h6' className='font-gilroyMedium'>Promotion & deals</Typography>
                    <div className='flex flex-col gap-[8px]'>
                      {item.timePromotions.map((timePromotion, idx) => (
                        <div className='w-full border rounded-[8px] p-[16px] flex flex-col gap-[6px]' key={`time_promotion_${idx}`}>
                          <div className='flex flex-col'>
                            <Typography variant='subtitle2' className='font-gilroyMedium'>
                              {timePromotion.name} ⦁ {getDiscountTypeDesc(timePromotion.type, timePromotion.value)}
                            </Typography>
                            <Typography variant='subtitle3'>
                              {getDiscountPeriodDesc(timePromotion.from, timePromotion.to, timePromotion.scheduleType, timePromotion.scheduleDate)}
                            </Typography>
                          </div>
                          <Typography variant='subtitle3'>
                            {timePromotion.description}
                          </Typography>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {item.importantNotes.isVisibleToCustomers && item.importantNotes.description && (
                  <div className='flex flex-col gap-[8px]'>
                    <Typography variant='h6' className='font-gilroyMedium'>Item notes</Typography>
                    <Typography variant='subtitle2'>{item.importantNotes.description}</Typography>
                  </div>
                )}
              </div>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </React.Fragment>
    </>
  );
};

ProductItem.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  priceRange: PropTypes.string.isRequired,
  stock: PropTypes.number.isRequired,
  quantity: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
  onDecrease: PropTypes.func.isRequired,
  onIncrease: PropTypes.func.isRequired,
  handleCustomizationOptionsOpen: PropTypes.func.isRequired,
  disabledDecrease: PropTypes.bool.isRequired,
  disabledIncrease: PropTypes.bool.isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default ProductItem;