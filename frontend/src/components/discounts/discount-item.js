import React, { useState, useCallback, useEffect  } from "react";
import { useSelector, useDispatch } from "react-redux";
// @mui
import { 
  FormControl, FormControlLabel, IconButton, TextField, RadioGroup, Radio, Autocomplete,
} from "@mui/material";
// Components
import ChooseLocation from 'src/components/choose-location-select';
// Icons
import RemoveIcon from "@mui/icons-material/Remove";
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
// Reducers
import { fetchShops } from "src/reducers/shopSlice";
// -------------------------------------------------------------------------------------------------

export default function DiscountItem({
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
  const { locations } = useSelector((state) => state.locations);

  const [selectedShop, setSelectedShop] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  
  const handleLocationSelectionChange = useCallback((event, newValue) => {
    setSelectedOptions(newValue);
  }, []);

  useEffect(() => {
    dispatch(fetchShops());
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-[24px] border-[#d9d9d9] border rounded-xl p-4">
      <div className="flex flex-col sm:flex-row gap-[24px] justify-between items-start">
        <FormControl variant="standard" className="w-full">
          <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
            Choose shop
          </label>
          <Autocomplete
            disablePortal
            options={shops || []}
            getOptionLabel={(option) => option.name || ''}
            value={selectedShop}
            onChange={(event, newValue) => setSelectedShop(newValue)}
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
        </FormControl>
        <FormControl variant="standard" className="w-full">
          <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
            Choose location
          </label>
          <ChooseLocation
            options={locations}
            selectedOptions={selectedOptions}
            listClassName={'line-clamp-1'}
            onSelectionChange={handleLocationSelectionChange}
          />
        </FormControl>
      </div>
      <div className="w-full flex flex-col sm:flex-row items-start gap-[24px] justify-between">
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
          {discountTextError && <p className="text-red-500 text-[12px] mt-1">{discountTextError}</p>}
        </FormControl>
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
        <div className="flex gap-[16px] justify-between w-full items-center">
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
          <IconButton
            className="bg-[#F5F5F5] p-[5px] w-[32px] h-[32px]"
            onClick={() => handleRemoveDiscount(id,index)}
          >
            <RemoveIcon className="text-[20px] text-heading" />
          </IconButton>
        </div>
      </div>
    </div>
  );
}