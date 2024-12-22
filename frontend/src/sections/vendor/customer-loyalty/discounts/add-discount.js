import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// @mui
import { FormControl, FormControlLabel, TextField, IconButton, RadioGroup, Radio, Autocomplete, } from "@mui/material";
// Icons
import RemoveIcon from "@mui/icons-material/Remove";
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
// Components
import {getLocationAddress} from 'src/components/choose-location-select';
// Reducers
import { fetchShops } from "src/reducers/shopSlice";

// --------------------------------------------------------------------------------------------------

export function AddDiscountItem({
  discount,
  index,
  handleDiscountChange,
  handleRemoveDiscount,
  discountTextError,
  id=-1,
  errors
}) {
  const dispatch = useDispatch();
  const { shops } = useSelector((state) => state.shops);
  const [selectedShop, setSelectedShop] = useState({});
  const [selectedLocation, setSelectedLocation] = useState({});
  
  useEffect(() => {
    dispatch(fetchShops());
  }, [dispatch]);

  const onShopSelect = (newValue) => setSelectedShop(newValue);
  const resetLocationFilter = () => setSelectedLocation({});

  return (
    // <div className="flex flex-col gap-[24px] border-[#d9d9d9] border rounded-xl p-4">
    <div className="flex flex-col sm:flex-row justify-between gap-[24px]">
      <div className="w-full flex flex-col gap-[16px]">
        <FormControl variant="standard" className="w-full">
          <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
            Discount code
          </label>
          <TextField
            size="small"
            variant="outlined"
            required
            fullWidth
            placeholder="Enter discount code"
            value={discount.discountCode}
            onChange={(e) =>
              handleDiscountChange(index, "discountCode", e.target.value)
            }
          />
          {errors?.discountCode && <p className="text-red-500 text-[12px] mt-1">{errors.discountCode}</p>}
          {/*{discountTextError && <p className="text-red-500 text-[12px] mt-1">{discountTextError}</p>}*/}
        </FormControl>
        <FormControl variant="standard" className="w-full">
          <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
            Discount title
          </label>
          <TextField
            size="small"
            variant="outlined"
            required
            fullWidth
            placeholder="Enter discount title"
            value={discount.title}
            onChange={(e) =>
              handleDiscountChange(index, "title", e.target.value)
            }
          />
          {errors?.title && <p className="text-red-500 text-[12px] mt-1">{errors.title}</p>}
        </FormControl>
        <FormControl variant="standard" className="w-full">
          <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
            Discount description
          </label>
          <TextField
            size="small"
            variant="outlined"
            required
            fullWidth
            placeholder="Enter discount description"
            value={discount.description}
            onChange={(e) =>
              handleDiscountChange(index, "description", e.target.value)
            }
          />
          {errors?.description  && <p className="text-red-500 text-[12px] mt-1">{errors.description }</p>}
        </FormControl>
        <div className="w-full flex flex-col gap-[16px]">
          <RadioGroup
            className="w-fit inline"
            value={discount.method}
            onChange={(e) => handleDiscountChange(index, "method", e.target.value)}
            aria-label="discount method"
            name={`method-${index}`}
          >
            <FormControlLabel
              className="m-0"
              value="dollars"
              control={
                <Radio
                  sx={{ "&.Mui-checked": { color: "#F14445" } }}
                  size="small"
                />
              }
              label={<span className="text-[14px]">In dollars $</span>}
            />
            <FormControlLabel
              className="m-0"
              value="percentage"
              control={
                <Radio
                  sx={{ "&.Mui-checked": { color: "#F14445" } }}
                  size="small"
                />
              }
              label={<span className="text-[14px]">In percentage %</span>}
            />
          </RadioGroup>
          {/*<IconButton
            className="bg-[#F5F5F5] p-[5px] w-[32px] h-[32px]"
            onClick={() => handleRemoveDiscount(id,index)}
          >
            <RemoveIcon className="text-[20px] text-heading" />
          </IconButton>*/}
        </div>
        <FormControl variant="standard" className="w-full">
          <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
            Discount amount
          </label>
          <TextField
            size="small"
            variant="outlined"
            required
            fullWidth
            placeholder="Enter discount amount"
            value={discount.discountAmount}
            onChange={(e) =>
              handleDiscountChange(index, "discountAmount", e.target.value)
            }
          />
          {errors?.discountAmount  && <p className="text-red-500 text-[12px] mt-1">{errors.discountAmount }</p>}
        </FormControl>
      </div>
      <div className="w-full flex flex-col gap-[16px]">
        <FormControl variant="standard" className="w-full">
          <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
            Choose shop
          </label>
          <Autocomplete
            disablePortal
            options={shops || []}
            getOptionLabel={(option) => option.name || ''}
            value={selectedShop}
            onChange={(e, newValue) => {resetLocationFilter(); onShopSelect(newValue); handleDiscountChange(index, "shop", newValue._id);}}
            popupIcon={<KeyboardArrowDownOutlinedIcon />}
            noOptionsText="No shops"
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Choose shop"
                className="line-clamp-1"
              />
            )}
          />
          {errors?.shop && <p className="text-red-500 text-[12px] mt-1">{errors.shop}</p>}
        </FormControl>

        <FormControl variant="standard" className="w-full">
          <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
            Choose location
          </label>
          <Autocomplete
            disablePortal
            disabled={!selectedShop?._id}
            options={selectedShop?.locations}
            getOptionLabel={(option) => getLocationAddress(option) || ''}
            value={selectedLocation}
            onChange={(event, newValue) => {setSelectedLocation(newValue); handleDiscountChange(index, "locations", newValue._id);}}
            popupIcon={<KeyboardArrowDownOutlinedIcon />}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Choose locations"
                className="line-clamp-1"
              />
            )}
          />
          {errors?.locations && <p className="text-red-500 text-[12px] mt-1">{errors.locations}</p>}
        </FormControl>
      </div>
    </div>
  );
}