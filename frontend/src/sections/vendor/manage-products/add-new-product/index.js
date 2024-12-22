import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
} from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import ButtonLoader from 'src/components/button-loader/ButtonLoader';
import ChooseLocation from 'src/components/choose-location-select';
import Iconify from 'src/components/iconify';

// --------------------------------------------------------------------------------------------------

// @mui
import {
  Avatar,
  Select,
  FormControl,
  Button,
  Popover,
  Box,
  Grid,
  RadioGroup,
  Radio,
  Autocomplete,
  Checkbox,
  MenuItem,
  Typography,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Chip,
  FormControlLabel,
  IconButton,
} from '@mui/material';

import { Link } from 'react-router-dom';
import { icPen } from 'src/assets';
import PropTypes from 'prop-types';

// Icons
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddIcon from '@mui/icons-material/Add';
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined';

// Components
import IOSSwitch from 'src/components/ios-switch';
import LightTooltip from 'src/components/LightTooltip';
import PhoneNumberMaskInput from 'src/components/phonenumber-mask-input';

import { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { _tags, _days } from 'src/_mock/assets';

import ModifierItem from '../product-details/modifiers/modifier-item';

// Assets
import { UploadImg } from 'src/assets';
import { countries } from 'src/_mock/assets';

import CategoryAutoComplete from 'src/components/category-auto-complete';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { addItemCategory, getAllCategories, removeItemCategory, selectAllCategories, updateItemCategory } from 'src/reducers/itemCategorySlice';
import { getModifiers } from 'src/api/vendor/modifier';
import LocationsItem from '../product-details/locations-item';
import { addItem } from 'src/api/vendor/items';
import { getAllMetrics } from 'src/reducers/metricSlice';
import { useRouter } from 'src/routes/hooks';
import { MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB } from 'src/utils/constant';
import PhoneNumberInput from 'src/components/phonenumber';
import SpecialTimedPromotions from '../special-time-promotions';

// --------------------------------------------------------------------------------------------------

const timeUnits = [
  { value: "minutes", label: "minutes" },
  { value: "hours", label: "hours" },
  { value: "days", label: "days" },
]

const AddNewProduct = ({ formData }) => {

  const router = useRouter();
  const [loading, setLoading] = useState(false)

  const { metrics: perMetrics } = useSelector(state => state.metrics)

  // Default Country
  const defaultCountry = countries.find(
    (country) => country.label === 'United States'
  );

  // RHF Hook Form
  const NewFormDataSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    itemId: Yup.string().required("Item id is required"),
    defaultPrice: Yup.number().moreThan(0, "Default price should not be 0"),
    categories: Yup.array().of(Yup.string().required("Each category is required"))
      .min(1, "At least one category is required")
      .required("Category is required"),
    perMetric: Yup.string().required("Per metric is required"),
    // variants: Yup.object().required(),
    description: Yup.string().required("Description is required"),
    // nutritionalInformation: Yup.string().required("Nutritional Information is required"),
    isInStock: Yup.boolean(),
    sourceItemSales: Yup.array().required(),
    attributes: Yup.object().required(),
    timePromotion: Yup.object().required(),
    // modifiers: Yup.object().required(),
    inclusions: Yup.object().required(),
    // locations: Yup.object().required(),
    importantNotes: Yup.object().required(),
    // photo: Yup.mixed(),
  });

  const defaultValues = useMemo(() => {
    const {
      name,
      itemId,
      defaultPrice,
      categories,
      perMetric,
      variants,
      description,
      nutritionalInformation,
      isInStock,
      sourceItemSales,
      attributes,
      timePromotion,
      modifiers,
      inclusions,
      locations,
      importantNotes,
      photo,
    } = formData || {};

    return {
      name: name || "",
      itemId: itemId || "",
      defaultPrice: defaultPrice || "",  // Default to empty if not provided
      categories: categories || [],
      perMetric: perMetric || "",
      variants: variants || { "isUse": false },
      description: description || "",
      nutritionalInformation: nutritionalInformation || "",
      isInStock: isInStock || true,
      sourceItemSales: sourceItemSales || [],
      attributes: attributes || { isAutoPay: true, isPerishable: true, prepareTime: { time: 1, unit: "days" }, lifeExpiration: { time: 1, unit: "days" } },
      timePromotion: timePromotion || {},
      modifiers: modifiers || [],
      inclusions: inclusions || {},
      locations: locations || [],
      importantNotes: importantNotes || { isVisibleToCustomers: true },
      photo: photo || null,  // Null for file type
    };
  }, [formData]);

  const methods = useForm({
    resolver: yupResolver(NewFormDataSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    register,
    formState: { errors: addProductErrors }
  } = methods;

  useEffect(() => {
    if (formData) {
      reset(defaultValues);
    }
  }, [formData, defaultValues, reset]);

  useEffect(() => {
    dispatch(getAllCategories());
    dispatch(getAllMetrics());
  }, []);

  useEffect(() => {
    if (!formData?.perMetric && perMetrics && perMetrics.length > 0) {
      setValue('perMetric', perMetrics[13]._id)
    }
  }, [perMetrics])

  const [modifierOptions, setModifiersOptions] = useState([]);

  const fetchModifiders = async () => {
    const res = await getModifiers();
    setModifiersOptions(res.modifiers)
  }

  useEffect(() => {
    fetchModifiders();
  }, [])

  // Choose Select
  const dispatch = useDispatch();
  // const [categories, setCategories] = useState(ITEM_CATEGORIES);
  const categories = useSelector(selectAllCategories);
  // Other Field Checkbox
  const [showOtherField, setShowOtherField] = useState(false);

  const handleCheckboxChange = (event) => {
    setShowOtherField(event.target.checked);
  };
  const handleAddCategory = (id, name) => {
    dispatch(addItemCategory({ category: name }));
  };

  // Upload product image
  const [avatarImg, setAvatarImg] = useState(UploadImg); // Initial image
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
      setValue("photo", file, { shouldDirty: true });
      reader.readAsDataURL(file);
    }
  };

  // Add Pickup Location Modal
  const [openAddPickupLocation, setOpenAddPickupLocation] =
    React.useState(false);

  const handleAddPickupLocationOpen = () => {
    setOpenAddPickupLocation(true);
  };

  const handleAddPickupLocationClose = () => {
    setOpenAddPickupLocation(false);
  };

  // Add New Location Modal
  const [openAddNewLocation, setOpenAddNewLocation] = React.useState(false);

  const handleAddNewLocationOpen = () => {
    setOpenAddNewLocation(true);
  };

  const handleAddNewLocationClose = () => {
    setOpenAddNewLocation(false);
  };

  // Delivery Details
  const [localDeliveryAvailable, setLocalDeliveryAvailable] =
    useState('deliver');
  const [showDeliverySection, setShowDeliverySection] = useState(true);
  const [showPickupSection, setShowPickupSection] = useState(false);

  const handleRadioTabChange = (event) => {
    const value = event.target.value;
    setLocalDeliveryAvailable(value);

    // Reset delivery options checkboxes when changing delivery availability type
    setShowDeliveryOption({
      post: false,
      courier: false,
    });

    if (value === 'pickup_and_deliver') {
      setShowPickupSection(true);
      setShowDeliverySection(true);
    } else if (value === 'deliver') {
      setShowPickupSection(false);
      setShowDeliverySection(true);
    } else if (value === 'pickup') {
      setShowPickupSection(true);
      setShowDeliverySection(false);
    }
  };

  // Handle Delivery Option
  const [showDeliveryOption, setShowDeliveryOption] = useState({
    post: false,
    courier: false,
  });

  const handleDeliveryOption = (event) => {
    const { value, checked } = event.target;

    setShowDeliveryOption((prevOptions) => ({
      ...prevOptions,
      [value]: checked,
    }));

    const isCourierChecked =
      value === 'courier' ? checked : showDeliveryOption.courier;
    const isPostChecked = value === 'post' ? checked : showDeliveryOption.post;
    const isPickupAndDeliverSelected =
      localDeliveryAvailable === 'pickup_and_deliver';
    const isDeliverSelected = localDeliveryAvailable === 'deliver';

    // Update setShowDeliverySection based on conditions
    if (isCourierChecked && isPostChecked) {
      setShowDeliverySection(true);
    } else if (!isCourierChecked && isPostChecked) {
      setShowDeliverySection(false);
    } else if (
      isCourierChecked &&
      !isPostChecked &&
      (isPickupAndDeliverSelected || isDeliverSelected)
    ) {
      setShowDeliverySection(true);
    } else {
      setShowDeliverySection(isPickupAndDeliverSelected || isDeliverSelected);
    }
  };

  // item with variants check
  const [itemWitchVariantCheck, setItemWitchVariantCheck] = useState(false);

  // Handle switch toggle
  const handleSwitchChange = (event) => {
    setItemWitchVariantCheck(event.target.checked);
    const variants = watch("variants");
    const newValue = {
      ...variants,
      isUse: event.target.checked,
    }
    setValue("variants", newValue);
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

  // Selected categories
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Special Timed Promotions
  // const [isTimedPromotion, setIsTimedPromotion] = useState(true);


  const handleTimePromotionIsUseChange = (event) => {
    const timePromotion = watch("timePromotion");
    const newValue = {
      ...timePromotion,
      isUse: event.target.checked,
    }
    setValue("timePromotion", newValue);
  };

  // State to keep track of modifier items
  const [modifiers, setModifiers] = useState([]); // Start with initial data
  const [filteredOptions, setFilteredOptions] = useState(modifierOptions);

  useEffect(() => {
    // Filter out options that are already present in the modifiers
    const updatedOptions = modifierOptions.filter(
      (option) => !modifiers.map(elem => elem._id).includes(option._id)
    );

    setFilteredOptions(updatedOptions);
  }, [modifiers, modifierOptions]);

  // Function to remove a modifier item by ID
  const handleRemoveModifier = (idToRemove) => {
    setModifiers((prevModifiers) =>
      prevModifiers.filter((modifier) => modifier.id !== idToRemove)
    );
  };

  // State to manage the rotation and popover
  const [isRotated, setIsRotated] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Handle IconButton click
  const handleButtonClick = (event) => {
    setIsRotated(!isRotated);
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  // Handle Popover close
  const handlePopoverClose = () => {
    setAnchorEl(null);
    setIsRotated(false);
  };
  // Determine if Popover is open
  const isPopoverOpen = Boolean(anchorEl);

  const handleMenuItemClick = (newModifierGroup) => {
    // Add the new modifier to the state
    setModifiers((prevModifiers) => [
      ...prevModifiers,
      newModifierGroup,
    ]);

    // Close the popover and reset rotation
    handlePopoverClose();
  };

  // Change category handler
  const handleCategoriesChange = (value) => {
    setSelectedCategories(value);
    setValue("categories", value.map(v => v._id));
  };

  // Delete category handler
  const handleDeleteCategory = (id) => {
    dispatch(removeItemCategory(id));
    // Also remove the category from the selected categories if it is selected
    setSelectedCategories((prevSelectedCategories) =>
      prevSelectedCategories.filter((category) => category.id !== id)
    );
  };

  const handleEditCategory = (id, newName) => {
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
  };

  const handlePerMetricChange = (event) => {
    setValue("perMetric", event.target.value);
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

  const handleTimePromotionNameChange = (event) => {
    const timePromotion = watch("timePromotion");
    const newValue = {
      ...timePromotion,
      name: event.target.value,
    }
    setValue("timePromotion", newValue);
  }

  const handleTimePromotionDiscount = (event) => {
    const timePromotion = watch("timePromotion");
    const newValue = {
      ...timePromotion,
      discount: event.target.value,
    }
    setValue("timePromotion", newValue);
  }

  const handleTimePromotionFrom = (value) => {
    const timePromotion = watch("timePromotion");
    const date = new Date(value);
    const newValue = {
      ...timePromotion,
      from: {
        hour: date.getHours(),
        minutes: date.getMinutes(),
      }
    }
    setValue("timePromotion", newValue);
  }

  const handleTimePromotionTo = (value) => {
    const timePromotion = watch("timePromotion");
    const date = new Date(value);
    const newValue = {
      ...timePromotion,
      to: {
        hour: date.getHours(),
        minutes: date.getMinutes(),
      }
    }
    setValue("timePromotion", newValue);
  }

  const handleInclusionChange = (event, field) => {
    const inclusions = watch("inclusions");
    const newValue = {
      ...inclusions,
      [field]: field !== "other" ? event.target.checked : event.target.value,
    }
    setValue("inclusions", newValue);
  }

  const handleImportantNodesChange = (field, value) => {
    const importantValues = watch("importantNotes");
    const newValue = {
      ...importantValues,
      [field]: value,
    }
    setValue("importantNotes", newValue);
  }

  const handleCustomerChange = (event) => {
    const isVisibleToCustomers = event.target.value === "customers";
    handleImportantNodesChange("isVisibleToCustomers", isVisibleToCustomers)
  }

  const onSubmit = async () => {
    //  event.preventDefault();
    const formData = watch();
    let data = new FormData();
    //  Object.keys(formData).map(item => {
    //   data.append(item, formData[item]);
    //   console.log("item--->", item, formData[item])
    //  })


    data.append("name", formData.name)
    data.append("itemId", formData.itemId)
    data.append("defaultPrice", formData.defaultPrice)
    data.append("categories", JSON.stringify(formData.categories))
    data.append("taxRate", formData.taxRate)
    data.append("perMetric", formData.perMetric)
    data.append("variants", JSON.stringify(formData.variants))
    data.append("description", formData.description)
    data.append("nutritionalInformation", formData.nutritionalInformation)
    data.append("isInStock", formData.isInStock)
    data.append("attributes", JSON.stringify(formData.attributes))
    data.append("sourceItemSales", JSON.stringify(formData.sourceItemSales))
    data.append("timePromotion", formData.timePromotion)
    data.append("modifiers", JSON.stringify(formData.modifiers))
    data.append("locations", JSON.stringify(formData.locations))
    data.append("inclusions", JSON.stringify(formData.inclusions))
    data.append("importantNotes", JSON.stringify(formData.importantNotes))
    data.append("photo", formData.photo)

    setLoading(true)
    try {
      await addItem(data);
      toast("Changes Saved", {
        type: 'success',
        className: 'toast-custom',
      })
      router.push('/vendor/manage-products');
    } catch (error) {
      const msg = error?.message ? `, ${error.message}` : ''
      toast("Failed" + msg, {
        type: 'error',
        className: 'toast-custom',
      })
    }
    setLoading(false)
  };

  return (
    <>
      <FormProvider {...methods} >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col gap-[48px]'>
            <div className='flex flex-col gap-[14px]'>
              <Typography variant='h5' className='capitalize'>
                Item Details
              </Typography>
              <div className='flex flex-col sm:flex-row justify-between sm:items-end gap-[14px] sm:gap-[24px]'>
                <div
                  className='w-fit relative cursor-pointer'
                  onClick={handleAvatarClick}
                >
                  <Avatar
                    variant='rounded'
                    alt='avatar'
                    src={avatarImg}
                    sx={{ width: 72, height: 72, border: '1px solid #dce0e4' }}
                  />
                  <input
                    type='file'
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept='image/jpeg,image/png'
                    onChange={handleFileChange}
                  />
                  <div className='absolute -right-2 -top-2 bg-[#F5F5F5] rounded-full p-[6px]'>
                    <img src={icPen} />
                  </div>
                </div>
                <FormControl variant='standard' className='w-full'>
                  <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
                    Item name
                  </label>
                  <TextField
                    size='small'
                    variant='outlined'
                    required
                    fullWidth
                    placeholder='Enter item name'
                    {...register("name", {
                      required: "name is required",
                    })}
                    error={addProductErrors.name}
                  />
                </FormControl>
                <FormControl variant='standard' className='w-full'>
                  <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
                    Item id
                  </label>
                  <TextField
                    size='small'
                    variant='outlined'
                    required
                    fullWidth
                    placeholder='Enter an item id'
                    {...register("itemId", {
                      required: "itemId is required",
                    })}
                    error={addProductErrors.itemId}
                  />
                </FormControl>
              </div>
              <div className='flex flex-col sm:flex-row justify-between gap-[14px] sm:gap-[24px]'>
                <FormControl className='w-full'>
                  <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
                    Category
                  </label>
                  <CategoryAutoComplete
                    selectedCategories={selectedCategories}
                    onChangeSelectedCategories={handleCategoriesChange}
                    categories={categories}
                    handleDeleteSelectedCategory={handleDeleteSelectedCategory}
                    editCategoryName={handleEditCategory}
                    deleteCategoryName={handleDeleteCategory}
                    AddCategory={handleAddCategory}
                    error={addProductErrors.categories}
                    required
                  />
                </FormControl>
                <div className='w-full flex justify-between gap-[24px]'>
                  <FormControl
                    variant='standard'
                    className='w-full !mb-2 sm:!mb-0'
                  >
                    <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
                      Default price
                    </label>
                    <RHFTextField
                      name='defaultPrice'
                      placeholder='0.00'
                      type='number'
                      // value={defaultPrice}
                      // onChange={handleDefaultPriceValue}
                      // onBlur={handleDefaultPriceBlur}
                      required
                      // {...register("defaultPrice", {
                      //   required: "DefaultPrice is required",
                      // })}
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
                    />
                  </FormControl>
                  <FormControl className='w-full'>
                    <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
                      Per metric
                    </label>
                    <Select
                      labelId='demo-simple-select-label'
                      size='small'
                      onChange={handlePerMetricChange}
                      value={watch('perMetric')}
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
                      checked={itemWitchVariantCheck}
                      onChange={handleSwitchChange}
                    />
                  }
                />
              </div>
              {itemWitchVariantCheck && (
                <div className='w-full'>
                  <FormControl className='w-full'>
                    <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
                      Attributes
                    </label>
                    <RHFAutocomplete
                      name='tags'
                      placeholder='+ Attributes'
                      multiple
                      freeSolo
                      options={_tags.map((option) => option)}
                      getOptionLabel={(option) => option}
                      renderOption={(props, option) => (
                        <li {...props} key={option}>
                          {option}
                        </li>
                      )}
                      onChange={(event, value) => handleVariantsChange(value)}
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
                </div>
              )}
              <div className='w-full'>
                <FormControl className='w-full'>
                  <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
                    Item description
                  </label>
                  <RHFTextField
                    name='description'
                    multiline
                    required
                    rows={3}
                    placeholder='Enter description'
                  />
                </FormControl>
              </div>
              <div className='w-full'>
                <FormControl className='w-full'>
                  <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
                    Nutritional information
                  </label>
                  <RHFTextField
                    name='nutritionalInformation'
                    multiline
                    rows={3}
                    placeholder='Enter nutritional information'
                  />
                </FormControl>
              </div>
              {/* <div className='w-full'>
                <FormControlLabel
                  className='!text-[10px]'
                  label={<span className='text-[14px] mb-2'>In stock</span>}
                  control={
                    <IOSSwitch
                      sx={{ m: 1 }}
                      defaultChecked
                      onChange={handleInStockChange}
                    />}
                />
              </div> */}
              <div className='w-full flex flex-col sm:flex-row justify-between gap-[14px] sm:gap-[24px] items-center'>
                <FormControl className='w-full'>
                  <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
                    Source of item sales
                  </label>
                  <RHFAutocomplete
                    name=''
                    placeholder='+ Item sales'
                    multiple
                    freeSolo
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
                    <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
                      Lead preparation time
                    </label>
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
                        defaultValue={1}
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
                        defaultValue={"days"}
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
              <div className='w-full flex flex-col sm:flex-row justify-between gap-[14px] sm:gap-[24px] items-center'>
                <FormControl className='w-full'>
                  <div className='flex gap-[5px] items-center'>
                    <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
                      Item shelf life expiration following drop-off
                    </label>
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
                        defaultValue={1}
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
                        defaultValue={"days"}
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
                      <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
                        Is this item auto-pay eligible?
                      </label>
                      <LightTooltip title='When the auto-pay feature is enabled, customers can opt to have their payment method automatically charged at checkout. This facilitates the seamless automatic purchase of items, which can then be picked up weekly or monthly on designated days at the checkout location. This ensures convenience and regularity in the retrieval of purchases without requiring manual payment for each order.'>
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
                          defaultChecked={false}
                          onChange={handleSourceItemAutoPay}
                        />
                      }
                    />
                  </div>

                  <div className='flex flex-col gap-[5px] items-start'>
                    <div className='flex gap-[5px] items-center'>
                      <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
                        Perishable item
                      </label>
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
                          defaultChecked
                          onChange={handleSourceItemPerishiable}
                        />
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* <div className='w-full flex flex-col gap-[14px]'>
              <div className='w-full flex justify-between items-center'>
                <Typography variant='h5' className='capitalize'>
                  Special timed promotions
                </Typography>
                <FormControlLabel
                  className='!text-[10px] m-0'
                  control={
                    <IOSSwitch
                      checked={watch("timePromotion").isUse || false}
                      onChange={handleTimePromotionIsUseChange}
                    />
                  }
                />
              </div>
              {!watch("timePromotion").isUse ? (
                // Check if the timed promotions is on or not
                <Typography variant='subtitle1' className='text-center mt-10'>
                  No times promotions created yet
                </Typography>
              ) : (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <div className='w-full flex flex-col gap-[16px]'>
                      <FormControl variant='standard' className='w-full'>
                        <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
                          Promotions name
                        </label>
                        <TextField
                          size='small'
                          variant='outlined'
                          required
                          fullWidth
                          placeholder='Enter promotion name'
                          onChange={handleTimePromotionNameChange}
                        />
                      </FormControl>
                      <FormControl variant='standard' className='w-full'>
                        <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
                          Discount
                        </label>
                        <TextField
                          size='small'
                          variant='outlined'
                          required
                          fullWidth
                          placeholder='Enter discount'
                          onChange={handleTimePromotionDiscount}
                        />
                      </FormControl>
                      <div className='flex justify-between gap-[14px] items-end'>
                        <FormControl variant='standard' className='w-full'>
                          <label className='font-normal text-normal leading-5 text-sm pb-1'>
                            Promotion time-frame from
                          </label>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                              onChange={handleTimePromotionFrom}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder='08 : 00 AM'
                                  id={`timeframe-textfield-${number}`}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        </FormControl>
                        <FormControl variant='standard' className='w-full'>
                          <label className='font-normal text-normal leading-5 text-sm pb-1'>
                            To
                          </label>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                              onChange={handleTimePromotionTo}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder='08 : 00 AM'
                                  id={`timeframe-textfield-${number}`}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        </FormControl>
                      </div>
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={6}
                    container
                    direction='row'
                    justifyContent={{ xs: 'center', md: 'end' }}
                    alignItems='start'
                  >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateCalendar
                        className='m-0'
                        sx={{
                          border:
                            '1px solid var(--stroke-8, rgba(0, 0, 0, 0.08))',
                          borderRadius: '16px',
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>
              )}
            </div> */}

            <SpecialTimedPromotions />

            <div className='w-full flex flex-col gap-[48px]'>
              <div className='w-full flex flex-col gap-[20px]'>
                <Typography variant='h5' className='capitalize'>
                  Customization Options
                </Typography>
                <div className='flex justify-between items-center'>
                  <Typography variant='h5' className='capitalize'>
                    Modifier Groups
                  </Typography>
                  <IconButton
                    sx={{
                      backgroundColor: '#f6f6f6',
                      transform: isRotated ? 'rotate(45deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease-in-out',
                    }}
                    onClick={handleButtonClick}
                  >
                    <AddIcon sx={{ color: '#181818', fontSize: '18px' }} />
                  </IconButton>
                </div>
                <div className='w-full flex flex-col gap-[20px]'>
                  {modifiers.length === 0 ? ( // Check if the modifiers array is empty
                    <Typography variant='subtitle1' className='text-center mt-10'>
                      No modifier Groups created yet
                    </Typography>
                  ) : (
                    modifiers.map((modifier, index) => (
                      <ModifierItem
                        key={`${index}item`}
                        modifier={modifier}
                        removeModifier={() => handleRemoveModifier(modifier.id)} // Pass the correct id
                        isPreview={true}
                      />
                    ))
                  )}
                </div>
              </div>
              {/* Modifier Type Popover */}
              <Popover
                open={isPopoverOpen}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{
                  maxHeight: 250,
                  width: 200,
                  padding: 10,
                  '& .MuiPaper-root': {
                    backgroundColor: '#fafafa',
                    '&::-webkit-scrollbar': {
                      width: '5px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: '#eaeaea',
                      borderRadius: '5px',
                    },
                  },
                }}
              >
                {filteredOptions.map((option, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => handleMenuItemClick(option)}
                    sx={{ fontFamily: 'Gilroy', fontWeight: 500 }}
                  >
                    {option.name}
                  </MenuItem>
                ))}
              </Popover>
            </div>

            <div className='flex flex-col gap-[14px]'>
              <Typography variant='h5' className='capitalize'>
                Inclusions with this item
              </Typography>
              <div className='flex flex-col sm:flex-row justify-between gap-0 sm:gap-[24px]'>
                <div className='w-full flex flex-col'>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={watch("inclusions").isEatingUtensilsIncluded}
                        onChange={event => handleInclusionChange(event, "isEatingUtensilsIncluded")}
                        size='small'
                      />
                    }
                    label={
                      <span className='text-[14px]'>
                        Eating utensils included
                      </span>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={watch("inclusions").isCondimentsIncluded}
                        onChange={event => handleInclusionChange(event, "isCondimentsIncluded")}
                        size='small'
                      />
                    }
                    label={
                      <span className='text-[14px]'>Condiments included</span>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={watch("inclusions").isIdsposableHeatingPads}
                        onChange={event => handleInclusionChange(event, "isIdsposableHeatingPads")}
                        size='small'
                      />
                    }
                    label={
                      <span className='text-[14px]'>Disposable Heating pads</span>
                    }
                  />
                </div>
                <div className='w-full flex flex-col'>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={watch("inclusions").isDisposableCoolingPads}
                        onChange={event => handleInclusionChange(event, "isDisposableCoolingPads")}
                        size='small'
                      />
                    }
                    label={
                      <span className='text-[14px]'>Disposable Cooling pads</span>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        size='small'
                        checked={watch("inclusions").isExtraFragile}
                        onChange={event => handleInclusionChange(event, "isExtraFragile")}
                      />
                    }
                    label={<span className='text-[14px]'>Extra fragile</span>}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={watch("inclusions").isLiquids}
                        onChange={event => handleInclusionChange(event, "isLiquids")}
                        size='small'
                      />
                    }
                    label={<span className='text-[14px]'>Liquids</span>}
                  />
                </div>
                <div className='w-full flex flex-col'>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size='small'
                        checked={watch("inclusions").isDiscountCertificates}
                        onChange={event => handleInclusionChange(event, "isDiscountCertificates")}
                      />
                    }
                    label={
                      <span className='text-[14px]'>Discount Certificates</span>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        size='small'
                        checked={showOtherField}
                        onChange={handleCheckboxChange}
                      />
                    }
                    label={<span className='text-[14px]'>Other</span>}
                  />
                  {showOtherField && (
                    <RHFTextField
                      fullWidth
                      name='newLabel.content'
                      placeholder='Describe what else'
                      className='mt-2 sm:mt-0'
                      onChange={event => handleInclusionChange(event, "other")}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-[14px] w-full'>
              <div className='flex justify-between items-center gap-[14px]'>
                <LocationsItem />
              </div>
            </div>

            <div className='flex flex-col gap-[14px] w-full'>
              <div className='sm:flex justify-between items-center'>
                <Typography variant='h5' className='capitalize'>
                  Important notes
                </Typography>
                <FormControl>
                  <RadioGroup
                    row
                    defaultValue='customers'
                    aria-label='tabs'
                    name='tabs'
                    onChange={handleCustomerChange}
                  >
                    <FormControlLabel
                      value='customers'
                      control={
                        <Radio
                          sx={{ '&.Mui-checked': { color: '#F14445' } }}
                          size='small'
                        />
                      }
                      label={
                        <span className='text-[14px]'>
                          Visible to customers
                          <LightTooltip title='These notes will be visible to the customer upon item checkout and order receipt.'>
                            <InfoOutlinedIcon
                              sx={{
                                fontSize: '16px',
                                marginBottom: '3px',
                                marginLeft: '5px',
                              }}
                            />
                          </LightTooltip>
                        </span>
                      }
                    />
                    <FormControlLabel
                      value='team'
                      control={
                        <Radio
                          sx={{
                            '&.Mui-checked': {
                              color: '#F14445',
                              fontSize: '12px',
                            },
                          }}
                          size='small'
                        />
                      }
                      label={
                        <span className='text-[14px]'>
                          Internal notes
                          <LightTooltip title='These notes will be visible internally and to the pickup point reception upon pickup of your item if you are subscribed to the Pro plan.'>
                            <InfoOutlinedIcon
                              sx={{
                                fontSize: '16px',
                                marginBottom: '3px',
                                marginLeft: '5px',
                              }}
                            />
                          </LightTooltip>
                        </span>
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </div>
              <FormControl className='w-full'>
                <RHFTextField
                  name=''
                  onChange={event => handleImportantNodesChange("description", event.target.value)}
                  multiline
                  rows={4}
                  placeholder='Enter description'
                />
              </FormControl>
            </div>

            <div className='flex justify-end items-center gap-[8px] mt-[8px]'>
              <Link to='/vendor/manage-products'>
                <Button
                  sx={{
                    padding: '8px 40px',
                    height: '44px',
                    fontFamily: 'Gilroy',
                    fontSize: '14px',
                    color: '#181818',
                    borderRadius: '8px',
                    backgroundColor: '#F5F5F5',
                    textTransform: 'unset',
                  }}
                >
                  Back
                </Button>
              </Link>
              {
                loading ? <Button
                  className="w-48"
                  sx={{
                    padding: '8px 40px',
                    height: '44px',
                    fontFamily: 'Gilroy',
                    fontSize: '14px',
                    color: '#181818',
                    borderRadius: '8px',
                    border: "1px solid red",
                    backgroundColor: "transparent",
                  }}
                  disabled={loading}
                >
                  <ButtonLoader />
                </Button> : <Button
                  type="submit"
                  className="w-48"
                  sx={{
                    padding: '8px 40px',
                    height: '44px',
                    fontFamily: 'Gilroy',
                    fontSize: '14px',
                    color: "rgba(254, 254, 255, 1)", // Change text color if needed
                    borderRadius: "8px",
                    backgroundColor: "rgba(241, 68, 69, 1)", // Change background color
                    textTransform: "unset",
                    "&:hover": {
                      backgroundColor: "rgba(300, 68, 69, 1)", // Change hover background color
                    },
                  }}
                >
                  Save Changes
                </Button>
              }
            </div>
          </div>
        </form>
        {/* Add Pickup Location */}
        {/* <React.Fragment>
          <Dialog className="w-full !font-gilroy"
              open={openAddPickupLocation}
              onClose={handleAddPickupLocationClose}
              scroll="paper"
              sx={{
                width: "100% !important",
              }}
          >
            <DialogTitle id="" className='pt-[32px] sm:!pt-[64px]'>
              <h1 className='text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center font-gilroy'>Add pickup location</h1>
            </DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>
              <DialogContentText
                id="scroll-dialog-description"
                tabIndex={-1}
              >
                <Stepper activeStep={activeStep} className='mb-[40px] mt-5'>
                  {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    if (isStepSkipped(index)) {
                      stepProps.completed = false;
                    }
                    return (
                      <Step key={label} {...stepProps}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
                <div className='w-full flex flex-col gap-[16px] mt-5 sm:px-[60px]'>
                  {activeStep === steps.length ? ( 
                    <h5 className='text-[20px] font-normal text-heading leading-[30px]'>Finish</h5>
                  ) : (
                    <React.Fragment>
                      {activeStep === 0 && (
                        <div className='flex flex-col gap-[16px] sm:px-[100px] pb-[150px]'>
                          <Typography variant='h5' className='capitalize'>Choose pickup location</Typography>
                          <FormControl className="w-full">
                            <Select
                              labelId="demo-simple-select-label"
                              size="small"
                              defaultValue={1}
                              >
                              <MenuItem value={1} className="!text-[12px] sm:!text-[14px] !font-gilroy">Whole Foods Market 14</MenuItem>
                              <MenuItem value={2} className="!text-[12px] sm:!text-[14px] !font-gilroy">Store #34819</MenuItem>
                              <MenuItem value={3} className="!text-[12px] sm:!text-[14px] !font-gilroy">Store #32322</MenuItem>
                              <MenuItem value={4} className="!text-[12px] sm:!text-[14px] !font-gilroy">Visalia Farmers Market 7</MenuItem>
                            </Select>
                          </FormControl>
                        </div>
                      )}
                      {activeStep === 1 && (
                        <div className='flex flex-col gap-[14px] font-gilroy'>
                          <FormControl variant="standard" className='w-full'>
                            <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Store hours</label>
                            <TextField
                                size="small"
                                variant='outlined'
                                required
                                fullWidth
                                placeholder='Enter store hours'
                            />
                          </FormControl>
                          <div className="flex flex-col sm:flex-row justify-between gap-[14px]">
                            <FormControl variant="standard" className='w-full'>
                              <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Manager</label>
                              <TextField
                                size="small"
                                variant='outlined'
                                required
                                fullWidth
                                placeholder='Enter manager'
                              />
                            </FormControl>
                            <FormControl variant="standard" className='w-full'>
                              <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Phone number</label>
                              <TextField
                                InputProps={{
                                  inputComponent: PhoneNumberMaskInput,
                                }}
                                size="small"
                                variant='outlined'
                                required
                                fullWidth
                                placeholder='Enter phone number'
                              />
                            </FormControl>
                          </div>
                          <FormControl variant="standard" className='w-full'>
                            <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Rack space</label>
                            <TextField
                                size="small"
                                variant='outlined'
                                required
                                fullWidth
                                placeholder='Enter rack space'
                            />
                          </FormControl>
                          <FormControl variant="standard" className='w-full'>
                            <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Price at this location</label>
                            <TextField
                                size="small"
                                variant='outlined'
                                required
                                fullWidth
                                placeholder='Enter price at this location'
                            />
                          </FormControl>
                        </div>
                      )}
                      {activeStep === 2 && (
                        <div className='flex flex-col gap-[14px] font-gilroy'>
                          <FormControl className="w-full">
                            <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Source of item sales</label>
                            <RHFAutocomplete
                              name="item_sales"
                              placeholder="+ Item"
                              multiple
                              freeSolo
                              options={item_sales.map((option) => option)}
                              getOptionLabel={(option) => option}
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
                                    size="small"
                                    color="tags"
                                    variant="soft"
                                    className="text-heading font-gilroy"
                                  />
                                ))
                              }
                            />
                          </FormControl>
                          <div className="flex flex-col gap-[5px]">
                            <div className="flex gap-[5px] items-center">
                              <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Lead preparation time</label>
                              <LightTooltip title="Some items may require a preparation time before it is ready for pickup. You can set an order cut-off time based on the pickup date the customer chooses. If the order cutoff time has expired then the customer will not be able to order this product or they will be required to choose a later pickup date." >
                                <InfoOutlinedIcon sx={{fontSize: '16px', marginBottom: '3px' }} /> 
                              </LightTooltip> 
                            </div>
                            <div className="flex items-cen ter gap-[14px]">
                              <FormControl variant="standard" className=''>
                                <TextField
                                  size="small"
                                  variant='outlined'
                                  required
                                  fullWidth
                                  placeholder='0'
                                />
                              </FormControl>
                              <FormControl variant="standard" className=''>
                                <TextField
                                  size="small"
                                  variant='outlined'
                                  required 
                                  fullWidth
                                  placeholder='Days'
                                />
                              </FormControl>
                            </div>
                          </div>
                          <div className="flex flex-col gap-[5px]">
                            <div className="flex gap-[5px] items-center">
                              <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Item shelf life expiration following drop-off</label>
                              <LightTooltip title="You indicated that this item is perishable. If this product has an expiration date, you can set an automatic sale end date following the drop-off date. If the product has not been sold or picked up before the expiration date has elapsed, then we will automatically remove this item from being listed." >
                                <InfoOutlinedIcon sx={{fontSize: '16px', marginBottom: '3px' }} /> 
                              </LightTooltip> 
                            </div>
                            <div className="flex items-cen ter gap-[14px]">
                              <FormControl variant="standard" className=''>
                                <TextField
                                  size="small"
                                  variant='outlined'
                                  required
                                  fullWidth
                                  placeholder='0'
                                />
                              </FormControl>
                              <FormControl variant="standard" className=''>
                                <TextField
                                  size="small"
                                  variant='outlined'
                                  required 
                                  fullWidth
                                  placeholder='Days'
                                />
                              </FormControl>
                              <FormControl variant="standard" className=''>
                                <TextField
                                  size="small"
                                  variant='outlined'
                                  required 
                                  fullWidth
                                  placeholder='Following drop-off'
                                />
                              </FormControl>
                            </div>
                          </div>
                          <div className="flex flex-col gap-[2px] items-start">
                            <div className="flex gap-[5px] items-center">
                              <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Perishable item</label>
                              <LightTooltip title="Is this item perishable or will it expire during it's shelf life? Most food drops, produce or packaged consumable goods will be perishable. If so, you can enable this feature and input a maximum shelf-life for this item from the day it is dropped-off at the location. Please ensure you are following proper legal compliance with your products in regards to online sales and shelf life." >
                                <InfoOutlinedIcon sx={{fontSize: '16px', marginBottom: '3px' }} /> 
                              </LightTooltip> 
                            </div>
                            <FormControlLabel className="max-w-fit"
                              label=""
                              control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
                            />
                          </div>
                          <div className="flex flex-col gap-[5px]">
                            <div className="flex gap-[5px] items-center">
                              <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Location sell limit</label>
                              <LightTooltip title="Set a limit of how many units of this item can be sold before the scheduled pickup day, if the limit is met, we will remove the listing for the pickup time(s) you have set." >
                                <InfoOutlinedIcon sx={{fontSize: '16px', marginBottom: '3px' }} /> 
                              </LightTooltip>
                            </div>
                            <div className="flex items-cen ter gap-[14px]">
                              <FormControl variant="standard" className=''>
                                <TextField
                                  size="small"
                                  variant='outlined'
                                  required
                                  fullWidth
                                  placeholder='0'
                                />
                              </FormControl>
                              <FormControl variant="standard" className=''>
                                <TextField
                                  size="small"
                                  variant='outlined'
                                  required 
                                  fullWidth
                                  placeholder='Per pickup day'
                                />
                              </FormControl>
                            </div>
                          </div>
                          <FormControl className="w-full flex flex-col">
                            <Typography variant="label" className="text-normal">Default pickup days for this item</Typography>
                            <div className="w-full">
                              <FormControlLabel control={<Checkbox size="small" />} label={<span className="text-[14px]">Mon</span>} />
                              <FormControlLabel control={<Checkbox size="small" />} label={<span className="text-[14px]">Tue</span>} />
                              <FormControlLabel control={<Checkbox size="small" />} label={<span className="text-[14px]">Wed</span>} />
                              <FormControlLabel control={<Checkbox size="small" />} label={<span className="text-[14px]">Thu</span>} />
                              <FormControlLabel control={<Checkbox size="small" />} label={<span className="text-[14px]">Fri</span>} />
                              <FormControlLabel control={<Checkbox size="small" />} label={<span className="text-[14px]">Sat</span>} />
                              <FormControlLabel control={<Checkbox size="small" />} label={<span className="text-[14px]">Sun</span>} />
                            </div>
                          </FormControl>
                          <div className='flex flex-col sm:flex-row justify-between gap-[14px]'>
                            <FormControl variant="standard" className='w-full'>
                              <label className='font-normal text-normal leading-5 text-sm pb-1'>Pick-up time-frame from</label>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      placeholder="08 : 00 AM"
                                      id={`timeframe-textfield-${number}`}
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            </FormControl>
                            <FormControl variant="standard" className='w-full'>
                              <label className='font-normal text-normal leading-5 text-sm pb-1'>To</label>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      placeholder="08 : 00 AM"
                                      id={`timeframe-textfield-${number}`}
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            </FormControl>
                          </div>
                          <div className="flex flex-col gap-[2px] items-start">
                            <div className="flex gap-[5px] items-center">
                              <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Is this item auto-pay eligible?</label>
                              <LightTooltip title="When the auto-pay feature is enabled, customers can opt to have their payment method automatically charged at checkout. This facilitates the seamless automatic purchase of items, which can then be picked up weekly or monthly on designated days at the checkout location. This ensures convenience and regularity in the retrieval of purchases without requiring manual payment for each order." >
                                <InfoOutlinedIcon sx={{fontSize: '16px', marginBottom: '3px' }} /> 
                              </LightTooltip>
                            </div>
                            <FormControlLabel className="max-w-fit"
                              label=""
                              control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
                            />
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  )}
                </div>
              </DialogContentText>
            </DialogContent>
            <DialogActions className="!px-[22px] !pb-[32px] sm:!pb-[64px] sm:!px-[80px] !gap-[14px]">
              <Button 
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{
                  width: '100%',
                  height: '44px',
                  fontFamily: 'Gilroy',
                  fontSize: '14px',
                  color: '#181818',
                  borderRadius: '8px',
                  backgroundColor: '#F5F5F5',
                  textTransform: 'unset',
                }}
              >
                Cancel
              </Button>
              <Button className='w-full'
                sx={{
                  width: '100%',
                  height: '44px',
                  fontFamily: 'Gilroy',
                  fontSize: '14px',
                  color: '#ffffff',
                  borderRadius: '8px',
                  backgroundColor: '#F14445',
                  textTransform: 'unset',
                  '&:hover': {
                    backgroundColor: '#E13031',
                  }
                }}
                onClick={activeStep ===steps.length - 1 ? handleAddPickupLocationClose : handleNext}
              > 
                {activeStep === steps.length - 1 ? 'Finish' : 'Continue'}
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment> */}

        <React.Fragment>
          <Dialog
            className='w-full !font-gilroy'
            open={openAddPickupLocation}
            onClose={handleAddPickupLocationClose}
            scroll='paper'
            sx={{
              width: '100% !important',
            }}
          >
            <DialogTitle id='' className='pt-[32px] sm:!pt-[64px] pb-[40px]'>
              <div className='text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center font-gilroy'>
                Assign location to item
              </div>
            </DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>
              <DialogContentText id='scroll-dialog-description' tabIndex={-1}>
                <div className='w-full flex flex-col gap-[16px] sm:px-[100px] pb-[100px]'>
                  <div className='w-full flex flex-col gap-[5px]'>
                    <Typography variant='h5' className='capitalize'>
                      Location
                    </Typography>
                    <FormControl className='w-full'>
                      <ChooseLocation
                        selectedOptions={watch("locations")}
                        onSelectionChange={(e, newValue) => {
                          setValue("locations", newValue);
                        }} />
                    </FormControl>
                  </div>
                  <div className='w-full'>
                    <div className='flex'>
                      <Button
                        sx={{
                          width: 'inherit',
                          padding: '5px 5px',
                          fontFamily: 'Gilroy',
                          fontSize: '14px',
                          color: '#181818',
                          borderRadius: '8px',
                          backgroundColor: 'transparent',
                          textTransform: 'unset',
                        }}
                        onClick={handleAddNewLocationOpen}
                      >
                        <AddIcon
                          className='mr-2'
                          sx={{ color: '#181818', fontSize: '18px' }}
                        />{' '}
                        Add new location
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContentText>
            </DialogContent>
            <DialogActions className='!px-[22px] !pb-[32px] sm:!pb-[64px] sm:!px-[80px] !gap-[14px]'>
              <Button
                onClick={handleAddPickupLocationClose}
                sx={{
                  width: '100%',
                  height: '44px',
                  fontFamily: 'Gilroy',
                  fontSize: '14px',
                  color: '#181818',
                  borderRadius: '8px',
                  backgroundColor: '#F5F5F5',
                  textTransform: 'unset',
                }}
              >
                Cancel
              </Button>
              <Button
                className='w-full'
                sx={{
                  width: '100%',
                  height: '44px',
                  fontFamily: 'Gilroy',
                  fontSize: '14px',
                  color: '#ffffff',
                  borderRadius: '8px',
                  backgroundColor: '#F14445',
                  textTransform: 'unset',
                  '&:hover': {
                    backgroundColor: '#E13031',
                  },
                }}
                onClick={handleAddPickupLocationClose}
              >
                Assign
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>

        {/* Add New Pickup Location Modal */}
        <React.Fragment>
          <Dialog
            className='w-full !font-gilroy'
            open={openAddNewLocation}
            onClose={handleAddNewLocationClose}
            scroll='paper'
            sx={{
              width: '100% !important',
            }}
          >
            <DialogTitle id='' className='pt-[32px] sm:!pt-[64px]'>
              <div className='text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center font-gilroy'>
                Add new location{' '}
                <AddLocationAltOutlinedIcon className='text-[24px] sm:text-[30px] ml-2 mb-1 sm:mb-2' />
              </div>
            </DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>
              <DialogContentText id='scroll-dialog-description' tabIndex={-1}>
                <div className='flex flex-col gap-[14px] font-gilroy sm:px-[60px] py-[16px]'>
                  <FormControl variant='standard' className=''>
                    <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
                      Location name
                    </label>
                    <TextField
                      size='small'
                      variant='outlined'
                      required
                      fullWidth
                      placeholder='Enter location name'
                    />
                  </FormControl>

                  <div className='flex flex-col gap-[14px]'>
                    <div className='flex flex-col'>
                      <div className='flex flex-col sm:flex-row justify-between gap-[14px] items-center'>
                        <FormControl variant='standard' className='w-full'>
                          <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
                            Country
                          </label>
                          <Autocomplete
                            fullWidth
                            autoHighlight
                            options={countries}
                            getOptionLabel={(option) => option.label}
                            defaultValue={defaultCountry}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder='Choose a country'
                                inputProps={{
                                  ...params.inputProps,
                                  autoComplete: 'new-password',
                                }}
                              />
                            )}
                            renderOption={(props, option) => {
                              if (!option.label) {
                                return null;
                              }

                              return (
                                <li {...props} key={option.label}>
                                  <Iconify
                                    key={option.label}
                                    icon={`circle-flags:${option.code.toLowerCase()}`}
                                    width={28}
                                    sx={{ mr: 1 }}
                                  />
                                  {option.label}
                                </li>
                              );
                            }}
                          />
                        </FormControl>
                        <FormControl variant='standard' className='w-full'>
                          <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
                            State
                          </label>
                          <RHFTextField
                            name='state'
                            placeholder='Enter state'
                          />
                        </FormControl>
                        <FormControl variant='standard' className='w-full'>
                          <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
                            City
                          </label>
                          <RHFTextField name='city' placeholder='Enter city' />
                        </FormControl>
                      </div>
                    </div>

                    <div className='flex flex-col'>
                      <div className='flex flex-col sm:flex-row justify-between gap-[14px] items-center'>
                        <FormControl
                          variant='standard'
                          className='w-full sm:w-[67%]'
                        >
                          <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
                            Address
                          </label>
                          <RHFTextField
                            name='address'
                            placeholder='Location address'
                          />
                        </FormControl>
                        <FormControl
                          variant='standard'
                          className='w-full sm:w-[33%]'
                        >
                          <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
                            Zip code
                          </label>
                          <RHFTextField
                            name='zipCode'
                            placeholder='Enter zip code'
                          />
                        </FormControl>
                      </div>
                    </div>
                  </div>

                  {/* <FormControl variant="standard" className='w-full !mt-[14px] sm:!mt-0'>
                    <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Business phone number</label>
                    <TextField
                      InputProps={{
                        inputComponent: PhoneNumberMaskInput,
                      }}
                      size="small"
                      variant='outlined'
                      required
                      fullWidth
                      placeholder='Enter phone number'
                    />
                  </FormControl> */}

                  <FormControl variant='standard' className=''>
                    <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
                      Location phone number
                    </label>
                    {/* <TextField
                      InputProps={{
                        inputComponent: PhoneNumberMaskInput,
                      }}
                      size='small'
                      variant='outlined'
                      required
                      fullWidth
                      placeholder='Enter contact number'
                    /> */}
                    <PhoneNumberInput
                        name="phonenumber"
                        placeholder="Enter contact number"
                        fullWidth
                        register={register}
                        onChange={() => {}}
                    />
                  </FormControl>

                  <div className='flex justify-between w-full gap-[14px] items-end'>
                    <FormControl variant='standard' className='w-full'>
                      <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
                        Location contact
                      </label>
                      <TextField
                        size='small'
                        variant='outlined'
                        required
                        fullWidth
                        placeholder='Enter first name'
                      />
                    </FormControl>
                    <FormControl
                      variant='standard'
                      className='w-full !mt-[14px] sm:!mt-0'
                    >
                      <TextField
                        size='small'
                        variant='outlined'
                        required
                        fullWidth
                        placeholder='Enter last name'
                      />
                    </FormControl>
                  </div>

                  <div className='flex flex-col gap-[14px]'>
                    <div className='w-full flex justify-between gap-[24px]'>
                      <FormControl className='w-full'>
                        <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
                          How does this location fulfill orders?
                        </label>
                        <RadioGroup
                          row
                          value={localDeliveryAvailable}
                          onChange={handleRadioTabChange}
                          aria-label='delivery-options'
                          name='delivery-options'
                        >
                          <FormControlLabel
                            value='pickup'
                            control={
                              <Radio
                                sx={{ '&.Mui-checked': { color: '#F14445' } }}
                                size='small'
                              />
                            }
                            label={
                              <span className='text-[14px]'>Pickup only</span>
                            }
                          />
                          <FormControlLabel
                            value='deliver'
                            control={
                              <Radio
                                sx={{ '&.Mui-checked': { color: '#F14445' } }}
                                size='small'
                              />
                            }
                            label={
                              <span className='text-[14px]'>Delivery only</span>
                            }
                          />
                          <FormControlLabel
                            value='pickup_and_deliver'
                            control={
                              <Radio
                                sx={{
                                  '&.Mui-checked': {
                                    color: '#F14445',
                                    fontSize: '12px',
                                  },
                                }}
                                size='small'
                              />
                            }
                            label={
                              <span className='text-[14px]'>
                                Pickup and delivery available
                              </span>
                            }
                          />
                        </RadioGroup>
                        {(localDeliveryAvailable === 'pickup_and_deliver' ||
                          localDeliveryAvailable === 'deliver') && (
                            <div className='w-full'>
                              <FormControl className='mt-1'>
                                <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
                                  Delivery method
                                </label>
                                <div className='w-full'>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        size='small'
                                        checked={showDeliveryOption.courier}
                                        onChange={handleDeliveryOption}
                                        value='courier'
                                      />
                                    }
                                    label={
                                      <span className='text-[14px]'>
                                        Door-to-door courier delivery
                                      </span>
                                    }
                                  />
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        size='small'
                                        checked={showDeliveryOption.post}
                                        onChange={handleDeliveryOption}
                                        value='post'
                                      />
                                    }
                                    label={
                                      <span className='text-[14px]'>
                                        Post mail delivery
                                      </span>
                                    }
                                  />
                                </div>
                              </FormControl>
                              {showDeliveryOption.courier && (
                                <div className='flex flex-col gap-[14px] mt-4'>
                                  <FormControl className='w-full'>
                                    <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
                                      Set your maximum courier delivery distance
                                      radius in miles
                                    </label>
                                    <RHFTextField
                                      name='newLabel.content'
                                      placeholder='Enter miles amount'
                                      className='mt-2 w-full sm:mt-0 sm:w-[50%]'
                                      type='number'
                                      autoWidth
                                    />
                                  </FormControl>
                                  {/* <FormControl className="mt-2">
                                  <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>When you make courier deliveries for this item, will they be delivered from a different location than this location? If so, please indicate below and we will use a separate delivery originating address to calculate the distance radius.</label>
                                  <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Note: You can make an originating delivery address private so your customers are unable to see the address of where the delivery is originating by setting the dial to ON in the location details section.</label>
                                  <RadioGroup
                                    row
                                    value={differentLocationValue}
                                    onChange={handleDifferentLocationRadioTabChange}
                                    aria-label="tabs"
                                    name="tabs"
                                  >
                                    <FormControlLabel
                                      value="yes"
                                      control={<Radio sx={{ '&.Mui-checked': { color: '#F14445', fontSize: '12px' } }} size="small"/>}
                                      label={<span className="text-[14px]">Yes</span>}
                                    />
                                    <FormControlLabel
                                      value="no"
                                      control={<Radio sx={{ '&.Mui-checked': { color: '#F14445' } }} size="small" />}
                                      label={<span className="text-[14px]">No</span>}
                                    />
                                  </RadioGroup>
                                  {differentLocationValue === 'yes' && (
                                    <div className="w-full">
                                      <FormControl className="w-full mt-1 sm:w-auto">
                                        <Select
                                          labelId="demo-simple-select-label"
                                          size="small"
                                          defaultValue={1}
                                          autoWidth
                                        >
                                          <MenuItem value={1} className="!text-[12px] sm:!text-[14px] !font-gilroy">Store #32322 - 7384 Hayward Way #034 Laguna, CA 93453</MenuItem>
                                          <MenuItem value={2} className="!text-[12px] sm:!text-[14px] !font-gilroy">Store #32323 - 7384 Hayward Way #034 Laguna, CA 93453</MenuItem>
                                          <MenuItem value={3} className="!text-[12px] sm:!text-[14px] !font-gilroy">Store #32324 - 7384 Hayward Way #034 Laguna, CA 93453</MenuItem>
                                        </Select>
                                      </FormControl>
                                    </div>
                                  )}
                                </FormControl> */}
                                </div>
                              )}
                            </div>
                          )}
                      </FormControl>
                    </div>
                  </div>

                  {showPickupSection && (
                    <FormControl
                      variant='standard'
                      className='flex flex-col gap-[14px]'
                    >
                      <div className='flex flex-col'>
                        <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
                          Default pickup days for this location
                        </label>
                        <RHFAutocomplete
                          name='tags'
                          placeholder='+ Days'
                          multiple
                          freeSolo
                          options={_days.map((option) => option)}
                          getOptionLabel={(option) => option}
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
                                className='text-heading font-gilroy'
                              />
                            ))
                          }
                        />
                      </div>
                      <div className='flex flex-col'>
                        <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
                          Default pickup time-frame for this location
                        </label>
                        <div className='w-full flex flex-col sm:flex-row justify-between gap-[14px]'>
                          <div className='w-full flex flex-col gap-[5px]'>
                            <Typography variant='label'>From</Typography>
                            <div className='flex items-center'>
                              <FormControl className='w-[60%]'>
                                <Select
                                  labelId='demo-simple-select-label'
                                  size='small'
                                  defaultValue={0}
                                  className='!rounded-r-[0px]'
                                >
                                  {Array.from({ length: 13 }, (_, i) => i).map(
                                    (i) => (
                                      <MenuItem
                                        key={i}
                                        value={i}
                                        className='!text-[12px] sm:!text-[14px] !font-gilroy'
                                      >
                                        {i}
                                      </MenuItem>
                                    )
                                  )}
                                </Select>
                              </FormControl>
                              <FormControl className='w-[40%]'>
                                <Select
                                  labelId='demo-simple-select-label'
                                  size='small'
                                  defaultValue={1}
                                  className='!rounded-l-[0px] -ml-[1px]'
                                >
                                  <MenuItem
                                    value={1}
                                    className='!text-[12px] sm:!text-[14px] !font-gilroy'
                                  >
                                    AM
                                  </MenuItem>
                                  <MenuItem
                                    value={2}
                                    className='!text-[12px] sm:!text-[14px] !font-gilroy'
                                  >
                                    PM
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            </div>
                          </div>
                          <div className='w-full flex flex-col gap-[5px]'>
                            <Typography variant='label'>To</Typography>
                            <div className='flex items-center'>
                              <FormControl className='w-[60%]'>
                                <Select
                                  labelId='demo-simple-select-label'
                                  size='small'
                                  defaultValue={0}
                                  className='!rounded-r-[0px]'
                                >
                                  {Array.from({ length: 13 }, (_, i) => i).map(
                                    (i) => (
                                      <MenuItem
                                        key={i}
                                        value={i}
                                        className='!text-[12px] sm:!text-[14px] !font-gilroy'
                                      >
                                        {i}
                                      </MenuItem>
                                    )
                                  )}
                                </Select>
                              </FormControl>
                              <FormControl className='w-[40%]'>
                                <Select
                                  labelId='demo-simple-select-label'
                                  size='small'
                                  defaultValue={1}
                                  className='!rounded-l-[0px] -ml-[1px]'
                                >
                                  <MenuItem
                                    value={1}
                                    className='!text-[12px] sm:!text-[14px] !font-gilroy'
                                  >
                                    AM
                                  </MenuItem>
                                  <MenuItem
                                    value={2}
                                    className='!text-[12px] sm:!text-[14px] !font-gilroy'
                                  >
                                    PM
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            </div>
                          </div>
                        </div>
                      </div>
                    </FormControl>
                  )}

                  {showDeliverySection && (
                    <FormControl
                      variant='standard'
                      className='flex flex-col gap-[14px]'
                    >
                      <div className='flex flex-col'>
                        <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
                          Default delivery days for this location
                        </label>
                        <RHFAutocomplete
                          name='delivery_days'
                          placeholder='+ Days'
                          multiple
                          freeSolo
                          options={_days.map((option) => option)}
                          getOptionLabel={(option) => option}
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
                                className='text-heading font-gilroy'
                              />
                            ))
                          }
                        />
                      </div>
                      <div className='flex flex-col'>
                        <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
                          Default delivery time-frame for this location
                        </label>
                        <div className='w-full flex flex-col sm:flex-row justify-between gap-[14px]'>
                          <div className='w-full flex flex-col gap-[5px]'>
                            <Typography variant='label'>From</Typography>
                            <div className='flex items-center'>
                              <FormControl className='w-[60%]'>
                                <Select
                                  labelId='demo-simple-select-label'
                                  size='small'
                                  defaultValue={0}
                                  className='!rounded-r-[0px]'
                                >
                                  {Array.from({ length: 13 }, (_, i) => i).map(
                                    (i) => (
                                      <MenuItem
                                        key={i}
                                        value={i}
                                        className='!text-[12px] sm:!text-[14px] !font-gilroy'
                                      >
                                        {i}
                                      </MenuItem>
                                    )
                                  )}
                                </Select>
                              </FormControl>
                              <FormControl className='w-[40%]'>
                                <Select
                                  labelId='demo-simple-select-label'
                                  size='small'
                                  defaultValue={1}
                                  className='!rounded-l-[0px] -ml-[1px]'
                                >
                                  <MenuItem
                                    value={1}
                                    className='!text-[12px] sm:!text-[14px] !font-gilroy'
                                  >
                                    AM
                                  </MenuItem>
                                  <MenuItem
                                    value={2}
                                    className='!text-[12px] sm:!text-[14px] !font-gilroy'
                                  >
                                    PM
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            </div>
                          </div>
                          <div className='w-full flex flex-col gap-[5px]'>
                            <Typography variant='label'>To</Typography>
                            <div className='flex items-center'>
                              <FormControl className='w-[60%]'>
                                <Select
                                  labelId='demo-simple-select-label'
                                  size='small'
                                  defaultValue={0}
                                  className='!rounded-r-[0px]'
                                >
                                  {Array.from({ length: 13 }, (_, i) => i).map(
                                    (i) => (
                                      <MenuItem
                                        key={i}
                                        value={i}
                                        className='!text-[12px] sm:!text-[14px] !font-gilroy'
                                      >
                                        {i}
                                      </MenuItem>
                                    )
                                  )}
                                </Select>
                              </FormControl>
                              <FormControl className='w-[40%]'>
                                <Select
                                  labelId='demo-simple-select-label'
                                  size='small'
                                  defaultValue={1}
                                  className='!rounded-l-[0px] -ml-[1px]'
                                >
                                  <MenuItem
                                    value={1}
                                    className='!text-[12px] sm:!text-[14px] !font-gilroy'
                                  >
                                    AM
                                  </MenuItem>
                                  <MenuItem
                                    value={2}
                                    className='!text-[12px] sm:!text-[14px] !font-gilroy'
                                  >
                                    PM
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            </div>
                          </div>
                        </div>
                      </div>
                    </FormControl>
                  )}

                  <FormControl className='w-full flex flex-col gap-[3px] mt-1'>
                    <div className='flex gap-[5px] items-center'>
                      <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>
                        Keep this location’s address private and unlisted
                      </label>
                      <LightTooltip title='If you would like to hide this location’s address from customers, then enable this option. Some vendors may want certain location’s address information private if they have deliveries originating from a private location or warehouse.'>
                        <InfoOutlinedIcon
                          sx={{ fontSize: '16px', marginBottom: '5px' }}
                        />
                      </LightTooltip>
                    </div>
                    <FormControlLabel
                      className='max-w-fit'
                      label=''
                      control={<IOSSwitch sx={{ m: 1 }} />}
                    />
                  </FormControl>
                </div>
              </DialogContentText>
            </DialogContent>
            <DialogActions className='!px-[22px] !pb-[32px] sm:!pb-[64px] sm:!px-[80px] !gap-[14px]'>
              <Button
                sx={{
                  width: '100%',
                  height: '44px',
                  fontFamily: 'Gilroy',
                  fontSize: '14px',
                  color: '#181818',
                  borderRadius: '8px',
                  backgroundColor: '#F5F5F5',
                  textTransform: 'unset',
                }}
                onClick={handleAddNewLocationClose}
              >
                Cancel
              </Button>
              <Button
                className='w-full'
                sx={{
                  width: '100%',
                  height: '44px',
                  fontFamily: 'Gilroy',
                  fontSize: '14px',
                  color: '#ffffff',
                  borderRadius: '8px',
                  backgroundColor: '#F14445',
                  textTransform: 'unset',
                  '&:hover': {
                    backgroundColor: '#E13031',
                  },
                }}
                onClick={handleAddNewLocationClose}
              >
                Add location
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      </FormProvider>
    </>
  );
};

AddNewProduct.propTypes = {
  formData: PropTypes.object,
};

export default AddNewProduct;
