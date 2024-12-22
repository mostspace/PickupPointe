import React from 'react';
import { Typography } from '@mui/material';
import { icClock, icRatingStar, icDelivery, icMapPointe, icDollar, icTagVuesax } from 'src/assets';

const ShopItem = ({
  shopImage,
  shopLogo,
  shopName,
  remainingTime,
  savingRate,
  categories,
  rating,
  delivery,
  distance
}) => {

  return (
    <div className="w-full flex flex-col click-item bg-[#FEFEFF] rounded-[20px] border-[#f9f9fa] p-[4px] shadow-sm cursor-pointer hover:shadow-md transition duration-300 ease-in-out">
      <div className="w-full rounded-[16px] h-[256px] overflow-hidden relative">
        {/* Header section */}
        <div className='w-full h-fit p-[8px] flex justify-between items-center absolute z-10 bg-dark-fade'>
          <div className='flex items-center justify-center'>
            <img loading='lazy' src={shopLogo} className='h-[32px]' alt="Service" />
          </div>
          <div className='flex justify-center items-center rounded-full bg-white gap-[8px] h-[32px] px-[12px]'>
            <img src={icClock} className='w-[18px]' alt="left time" />
            <Typography variant='text1' className='font-medium leading-[12px]'>{remainingTime === 0 ? "Schedule order" : `${remainingTime} h left`}</Typography>
          </div>
        </div>

        <div className='w-full absolute bottom-0 z-20 p-[5px]'>
          <div className='w-full flex justify-center items-center'>
            <div className='w-full bg-white p-[3px] rounded-full'>
              <div className='w-full bg-white rounded-full p-[6px] flex justify-center items-center text-center border border-dashed'>
                <div className='w-fit flex justify-center items-center gap-[6px]'>
                  <img src={icTagVuesax} />
                  <Typography variant='label' className='text-primary'><strong className='font-gilroyMedium'>Save <span className='font-gilroyBold'>{savingRate}%</span></strong> vs. Other Delivery Apps!</Typography>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image or No Image Placeholder */}
        <div className="w-full h-full flex justify-center items-center flex-grow overflow-hidden rounded-[8px] relative">
          {shopImage ? (
            <img
              loading="lazy"
              src={shopImage}
              className="hover:scale-105 duration-300 w-full h-full object-cover absolute inset-0"
              alt={shopName}
            />
          ) : (
            <Typography variant='subtitle1'>No Image</Typography>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-[20px] p-[12px]">
        <div className='flex flex-col gap-[3px]'>
          <Typography variant='subtitle1' className='font-gilroyMedium line-clamp-1'>{shopName}</Typography>
          <Typography variant='text1' className='line-clamp-1'>{categories?.map((category) => category.category).join(", ")}</Typography>
        </div>
        <div className='flex flex-col gap-[4px]'>
          {/* <div className='flex items-center gap-[6px]'>
            <img src={icDollar} className='w-[16px]' alt="Dollar Icon" />
            <Typography variant='label' className='text-[#a3a3a3]'>Delivery fee: ${delivery_fee}</Typography>
          </div> */}
          <div className='flex flex-wrap gap-[12px] items-center'>
            <div className='flex items-center gap-[6px]'>
              <img src={icRatingStar} className='w-[16px]' alt="Rating Star" />
              <Typography variant='text1'>{rating}</Typography>
            </div>
            <div className='flex items-center gap-[6px]'>
              <img src={icDelivery} className='w-[16px]' alt="Delivery Icon" />
              <Typography variant='text1'>{delivery}</Typography>
            </div>
            <div className='flex items-center gap-[6px]'>
              <img src={icMapPointe} className='w-[16px]' alt="Map Pointer Icon" />
              <Typography variant='text1'>{Number(distance).toFixed(2)} miles</Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopItem;