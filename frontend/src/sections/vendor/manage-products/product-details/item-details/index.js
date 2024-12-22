import { useEffect, useState, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

// @mui
import {
  Avatar, Select, FormControl, Box, MenuItem, InputAdornment, TextField, Chip, FormControlLabel, Typography,
} from '@mui/material';

// Icons
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Components
import IOSSwitch from 'src/components/ios-switch';
import LightTooltip from 'src/components/LightTooltip';
import CategoryAutoComplete from 'src/components/category-auto-complete';
import { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

// Assets
import { icPen, UploadImg } from 'src/assets';
import { _tags } from 'src/_mock/assets';

// Reducers
import { addItemCategory, getAllCategories, removeItemCategory, selectAllCategories, updateItemCategory } from 'src/reducers/itemCategorySlice';
import { getAllMetrics } from 'src/reducers/metricSlice';

// Constant
import { MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB } from 'src/utils/constant';

// --------------------------------------------------------------------------------------------------

const timeUnits = [
  { value: "minutes", label: "minutes" },
  { value: "hours", label: "hours" },
  { value: "days", label: "days" },
]

// --------------------------------------------------------------------------------------------------

const ItemDetails = ({errors}) => {
  
  // RHF Hook Form
  const {
    setValue,
    register,
    watch,
    getValues
  } = useFormContext();

  const dispatch = useDispatch();

  const { metrics: perMetrics } = useSelector(state => state.metrics)

  // Upload product image
  const [avatarImg, setAvatarImg] = useState(watch('photo')); // Initial image
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast(`Max file size: ${MAX_FILE_SIZE_MB}MB`, {
        type: 'error',
        className: 'toast-custom',
      })
      return;
    }
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarImg(e.target.result);
      };
      reader.readAsDataURL(file);
      setValue("photo", file);
      setValue("photoStatus", "changed")
    }
  };
  
  // Category
  const categories = useSelector(selectAllCategories);
  const [selectedCategories, setSelectedCategories] = useState(
    watch('categories').map(item => ({ ...item, name: item.category, id: item._id }))
  );

  // Change category handler
  const handleCategoriesChange = (value) => {
    setSelectedCategories(value);
    setValue("selectedCategories", value.map(v => v._id));
    setValue("categories", value);
  };

  // Delete category handler
  const handleDeleteCategory = (id) => {
    dispatch(removeItemCategory(id));
    // Also remove the category from the selected categories if it is selected
    setSelectedCategories((prevSelectedCategories) =>
      prevSelectedCategories.filter((category) => category.id !== id)
    );
  };

  const handleAddCategory = (id, name) => {
    dispatch(addItemCategory({ category: name }));
  };

  const handleEditCategory = (id, newName) => {
    // Update the main categories list
    dispatch(updateItemCategory({
      id,
      data: {
        category: newName,
      }
    }));

    // Also update the selected categories if the category is selected
    setSelectedCategories((prevSelectedCategories) =>
      prevSelectedCategories.map((selectedCategory) =>
        selectedCategory.id === id
          ? { ...selectedCategory, name: newName }
          : selectedCategory
      )
    );
  };

  const handleDeleteSelectedCategory = (categoryToDeleteId) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.filter((category) => category.id !== categoryToDeleteId)
    );
    setValue("categories", selectedCategories.filter((category) => category.id !== categoryToDeleteId));
  };

  // Per metric
  const handlePerMetricChange = (event) => {
    setValue("perMetric", event.target.value);
  }
  const [itemSwitchVariantCheck, setItemSwitchVariantCheck] = useState(getValues("variants").isUse);

  // Handle switch toggle
  const handleSwitchChange = (event) => {
    setItemSwitchVariantCheck(event.target.checked);
    const variants = watch("variants");
    const newValue = {
      ...variants,
      isUse: event.target.checked,
    }
    setValue("variants", newValue);
  };

  // Handle make featured item switch toggle
  const [featuredItemSwitchCheck, setFeaturedItemSwitchCheck] = useState(false);

  const handleFeaturedItemSwitchChange = (event) => {
    setFeaturedItemSwitchCheck(event.target.checked);
    setValue("featured_item", event.target.checked);
  };

  //set Variants Value
  const handleVariantsChange = (selectedVariants) => {
    const variants = watch("variants");
    const newValue = {
      ...variants,
      attributes: selectedVariants,
    }
    setValue("variants", newValue);
  }

  const handleSourceItemsChange = (_, value) => {
    setValue("sourceItemSales", value);
  }

  const handlePrepareTimeTimeChange = (event) => {
    const attributes = watch('attributes');
    const newValue = {
      ...attributes,
      prepareTime: {
        ...attributes.prepareTime,
        time: event.target.value,
      }
    }
    setValue("attributes", newValue);
  }

  const handlePrepareTimeUnitChange = (event) => {
    const attributes = watch('attributes');
    const newValue = {
      ...attributes,
      prepareTime: {
        ...attributes.prepareTime,
        unit: event.target.value,
      }
    }
    setValue("attributes", newValue);
  }

  const handleExpiryTimeTimeChange = (event) => {
    const attributes = watch('attributes');
    const newValue = {
      ...attributes,
      lifeExpiration: {
        ...attributes.lifeExpiration,
        time: event.target.value,
      }
    }
    setValue("attributes", newValue);
  }

  const handleExpiryTimeUnitChange = (event) => {
    const attributes = watch('attributes');
    const newValue = {
      ...attributes,
      lifeExpiration: {
        ...attributes.lifeExpiration,
        unit: event.target.value,
      }
    }
    setValue("attributes", newValue);
  }

  const handleSourceItemAutoPay = (event) => {
    const attributes = watch('attributes');
    const newValue = {
      ...attributes,
      isAutoPay: event.target.checked,
    }
    setValue("attributes", newValue);
  }

  const handleSourceItemPerishiable = (event) => {
    const attributes = watch('attributes');
    const newValue = {
      ...attributes,
      isPerishable: event.target.checked,
    }
    setValue("attributes", newValue);
  }

  useEffect(() => {
    if (!avatarImg) {
      setAvatarImg(watch('photo'));
    }
  }, [watch('photo')])

  useEffect(() => {
    setSelectedCategories(watch('categories').map(item => ({ ...item, name: item.category, id: item._id })))
  }, [watch('categories')]);

  useEffect(() => {
    dispatch(getAllCategories());
    dispatch(getAllMetrics());
  }, []);

  useEffect(() => {
    const initialValue = getValues("featured_item");
    setFeaturedItemSwitchCheck(initialValue);
  }, [watch('featured_item')])

  useEffect(() => {
    const initialValue = getValues("variants");
    setItemSwitchVariantCheck(initialValue.isUse)
  }, [watch('variants')])

  return (
    <>
      <div className='flex flex-col gap-[14px]'>
        <Typography variant='h5' className='capitalize'>Item Details</Typography>
        <div className='flex flex-col sm:flex-row justify-between sm:items-end gap-[14px] sm:gap-[16px]'>
          <div className='w-full flex items-end gap-[14px] sm:gap-[16px]'>
            <div className='w-fit relative cursor-pointer' onClick={handleAvatarClick}>
              <Avatar variant='rounded' alt='avatar' src={avatarImg || UploadImg} sx={{ width: 72, height: 72, border: '1px solid #dce0e4' }} />
              <input type='file' ref={fileInputRef} style={{ display: 'none' }} accept='image/jpeg,image/png' onChange={handleFileChange} />
              <div className='absolute -right-2 -top-2 bg-[#F5F5F5] rounded-full p-[6px]'>
                <img src={icPen} />
              </div>
            </div>
            <FormControl variant='standard' className='w-full'>
              <Typography variant='label1'>Item name</Typography>
              <TextField
                size='small'
                variant='outlined'
                required
                fullWidth
                placeholder='Enter item name'
                {...register("name", {
                  required: "name is required",
                })}
                onChange={(e) => setValue('name', e.target.value)}
              />
            </FormControl>
          </div>
          <div className='w-full flex items-end gap-[14px] sm:gap-[16px]'>
            <FormControl variant='standard' className='w-full'>
              <Typography variant='label1'>Item id</Typography>
              <TextField
                size='small'
                variant='outlined'
                required
                fullWidth
                placeholder='Enter an item id'
                {...register("itemId", {
                  required: "itemId is required",
                })}
                onChange={(e) => setValue('itemId', e.target.value)}
              />
            </FormControl>
            <FormControl variant='standard' className='w-full'>
              <div className='flex items-center gap-[3px]'>
                <Typography variant='label1'>Make featured item</Typography>
                <LightTooltip title={<span>To feature this item on your shop profile, simply toggle the switch to "on." Once activated, this item will be highlighted on your public storefront, making it visible to visitors as a featured product.<br/>Note: Featured items are displayed in the order they are activated. If this is your first featured item, it will appear at the top of your shop's storefront.</span>}>
                  <InfoOutlinedIcon sx={{ fontSize: '16px', marginBottom: '5px' }} />
                </LightTooltip>
              </div>
              <div className='flex'>
                <FormControlLabel
                  className='!text-[10px]'
                  control={
                    <IOSSwitch
                      sx={{ m: 1 }}
                      {...register("featured_item")}
                      checked={featuredItemSwitchCheck}
                      onChange={handleFeaturedItemSwitchChange}
                    />
                  }
                />
              </div>
            </FormControl>
          </div>
        </div>
        <div className='flex flex-col sm:flex-row justify-between gap-[14px] sm:gap-[16px]'>
          <FormControl className='w-full'>
            <Typography variant='label1'>Category</Typography>
            <CategoryAutoComplete
              selectedCategories={selectedCategories}
              onChangeSelectedCategories={handleCategoriesChange}
              categories={categories}
              handleDeleteSelectedCategory={handleDeleteSelectedCategory}
              editCategoryName={handleEditCategory}
              deleteCategoryName={handleDeleteCategory}
              AddCategory={handleAddCategory}
              required
            />
          </FormControl>
          <div className='w-full flex justify-between gap-[14px] sm:gap-[16px]'>
            <FormControl variant='standard' className='w-full !mb-2 sm:!mb-0'>
              <Typography variant='label1'>Default price</Typography>
              <RHFTextField
                name='defaultPrice'
                placeholder='0.00'
                type='number'
                required
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Box component='span' sx={{ color: 'text.disabled' }}>
                        $
                      </Box>
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => setValue('defaultPrice', e.target.value)}
              />
            </FormControl>
            <FormControl className='w-full'>
              <Typography variant='label1'>Per metric</Typography>
              <Select
                labelId='demo-simple-select-label'
                size='small'
                value={watch("perMetric")}
                onChange={handlePerMetricChange}
              >
                {perMetrics.map(per => (
                  <MenuItem
                    key={per._id}
                    value={per._id}
                    className='!text-[12px] sm:!text-[14px] !font-gilroy'
                  >
                    {per.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className='w-full'>
          <FormControlLabel
            className='!text-[10px]'
            label={
              <span className='text-[14px] mb-2'>Item with variants?</span>
            }
            control={
              <IOSSwitch
                sx={{ m: 1 }}
                checked={itemSwitchVariantCheck}
                onChange={handleSwitchChange}
              />
            }
          />
        </div>
        {itemSwitchVariantCheck && (
          <div className='w-full'>
            <FormControl className='w-full'>
              <Typography variant='label1'>
                Attributes
              </Typography>
              <RHFAutocomplete
                name='tags'
                placeholder='+ Attributes'
                multiple
                freeSolo
                options={_tags.map((option) => option)}
                defaultValue={watch("variants").attributes}
                getOptionLabel={(option) => option}
                onChange={(e, newValue) => handleVariantsChange(newValue)}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
                renderTags={(selected, getTagProps) =>
                  selected.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option}
                      label={option}
                      size='small'
                      color='tags'
                      variant='soft'
                      className='text-heading font-gilroy m-[3px]'
                    />
                  ))
                }
              />
            </FormControl>
          </div>
        )}
        <div className='w-full'>
          <FormControl className='w-full'>
            <Typography variant='label1'>
              Item description
            </Typography>
            <RHFTextField
              name='description'
              multiline
              required
              rows={3}
              placeholder='Enter description'
              defaultValue={watch("description")}
              onChange={(e) => setValue('description', e.target.value)}
            />
          </FormControl>
        </div>
        <div className='w-full'>
          <FormControl className='w-full'>
            <Typography variant='label1'>
              Nutritional information
            </Typography>
            <RHFTextField
              name='nutritionalInformation'
              multiline
              rows={5}
              placeholder='Enter nutritional information'
              onChange={(e) =>
                setValue(
                  'nutritionalInformation',
                  e.target.value.replace(/<[^>]*>/g, '')
                )
              }
              // onChange={(e) => setValue('nutritionalInformation', e.target.value)}
            />
          </FormControl>
        </div>
        <div className='w-full flex flex-col sm:flex-row justify-between gap-[14px] sm:gap-[16px] items-center'>
          <FormControl className='w-full'>
            <Typography variant='label1'>
              Source of item sales
            </Typography>
            <RHFAutocomplete
              name='source_item_sales'
              placeholder='+ Item sales'
              multiple
              freeSolo
              defaultValue={watch("sourceItemSales")}
              options={_tags.map((option) => option)}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
              onChange={handleSourceItemsChange}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size='small'
                    color='tags'
                    variant='soft'
                    className='text-heading font-gilroy'
                  />
                ))
              }
            />
          </FormControl>
          <FormControl className='w-full'>
            <div className='flex gap-[5px] items-center'>
              <Typography variant='label1'>
                Lead preparation time
              </Typography>
              <LightTooltip title='Some items may require a preparation time before it is ready for pickup. You can set an order cut-off time based on the pickup date the customer chooses. If the order cutoff time has expired then the customer will not be able to order this product or they will be required to choose a later pickup date.'>
                <InfoOutlinedIcon
                  sx={{ fontSize: '16px', marginBottom: '3px' }}
                />
              </LightTooltip>
            </div>
            <div className='flex justify-between gap-[14px]'>
              <FormControl className='w-full'>
                <Select
                  labelId='demo-simple-select-label'
                  size='small'
                  value={watch("attributes")?.prepareTime?.time || 1}
                  onChange={handlePrepareTimeTimeChange}
                >
                  {Array.from({ length: 60 }, (_, i) => i + 1).map((i) => (
                    <MenuItem
                      key={i}
                      value={i}
                      className='!text-[12px] sm:!text-[14px] !font-gilroy'
                    >
                      {i}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl className='w-full'>
                <Select
                  labelId='demo-simple-select-label'
                  size='small'
                  value={watch("attributes")?.prepareTime?.unit || "minutes"}
                  onChange={handlePrepareTimeUnitChange}
                >
                  {timeUnits.map(unit => (
                    <MenuItem
                      key={unit.value}
                      value={unit.value}
                      className='!text-[12px] sm:!text-[14px] !font-gilroy'
                    >
                      {unit.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </FormControl>
        </div>
        <div className='w-full flex flex-col sm:flex-row justify-between gap-[14px] sm:gap-[16px] items-center'>
          <FormControl className='w-full'>
            <div className='flex gap-[5px] items-center'>
              <Typography variant='label1'>
                Item shelf life expiration following drop-off
              </Typography>
              <LightTooltip title='You indicated that this item is perishable. If this product has an expiration date, you can set an automatic sale end date following the drop-off date. If the product has not been sold or picked up before the expiration date has elapsed, then we will automatically remove this item from being listed.'>
                <InfoOutlinedIcon
                  sx={{ fontSize: '16px', marginBottom: '3px' }}
                />
              </LightTooltip>
            </div>
            <div className='flex justify-between gap-[14px]'>
              <FormControl className='w-full'>
                <Select
                  labelId='demo-simple-select-label'
                  size='small'
                  defaultValue={watch("attributes")?.lifeExpiration?.time || 1}
                  onChange={handleExpiryTimeTimeChange}
                >
                  {Array.from({ length: 60 }, (_, i) => i + 1).map((i) => (
                    <MenuItem
                      key={i}
                      value={i}
                      className='!text-[12px] sm:!text-[14px] !font-gilroy'
                    >
                      {i}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl className='w-full'>
                <Select
                  labelId='demo-simple-select-label'
                  size='small'
                  defaultValue={watch("attributes")?.lifeExpiration?.unit || "days"}
                  onChange={handleExpiryTimeUnitChange}
                >
                  {timeUnits.map(unit => (
                    <MenuItem
                      key={unit.value}
                      value={unit.value}
                      className='!text-[12px] sm:!text-[14px] !font-gilroy'
                    >
                      {unit.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </FormControl>
          <div className='w-full flex gap-[48px]'>
            <div className='flex flex-col gap-[5px] items-start'>
              <div className='flex gap-[5px] items-center'>
                <Typography variant='label1'>
                  Perishable item
                </Typography>
                <LightTooltip title="Is this item perishable or will it expire during it's shelf life? Most food drops, produce or packaged consumable goods will be perishable. If so, you can enable this feature and input a maximum shelf-life for this item from the day it is dropped-off at the location. Please ensure you are following proper legal compliance with your products in regards to online sales and shelf life.">
                  <InfoOutlinedIcon
                    sx={{ fontSize: '16px', marginBottom: '5px' }}
                  />
                </LightTooltip>
              </div>
              <FormControlLabel
                className='max-w-fit'
                label=''
                control={
                  <IOSSwitch
                    sx={{ m: 1 }}
                    defaultChecked={watch("attributes").isPerishable}
                    onChange={handleSourceItemPerishiable}
                  />
                }
              />
            </div>
            <div className='flex flex-col gap-[5px] items-start'>
              <div className='flex gap-[5px] items-center'>
                <Typography variant='label1'>
                  Is this item auto-pay eligible?
                </Typography>
                <LightTooltip title='When the auto-pay feature is enabled, customers can opt to have their payment method automatically charged at checkout. This facilitates the seamless automatic purchase of items, which can then be picked up weekly or monthly on designated days at the checkout location. This ensures convenience and regularity in the retrieval of purchases without requiring manual payment for each order.'>
                  <InfoOutlinedIcon
                    sx={{ fontSize: '16px', marginBottom: '5px' }}
                  />
                </LightTooltip>
              </div>
              <FormControlLabel className='max-w-fit' label=''
                control={
                  <IOSSwitch
                    sx={{ m: 1 }}
                    defaultChecked={watch("attributes").isAutoPay}
                    onChange={handleSourceItemAutoPay}
                  />
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemDetails;