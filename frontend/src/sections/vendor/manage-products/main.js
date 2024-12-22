import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
// Components
import Iconify from 'src/components/iconify';
import TabPanel from 'src/components/tab';
import Items from './items';
import Modifiers from 'src/components/modifiers';
import ButtonLoader from 'src/components/button-loader/ButtonLoader';
import Searchbar from 'src/components/input/searchbar';
import CategoryAutoComplete from 'src/components/category-auto-complete';
import ChooseLocation from 'src/components/choose-location-select';
import { tabProps } from "src/utils/tab-helpers";
// @mui
import {
  Tabs, Tab, Box, InputAdornment, Typography, Grid, Autocomplete, TextField
} from '@mui/material';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
// Reducers
import { addItemCategory, getAllCategories, removeItemCategory, selectAllCategories, updateItemCategory, selectIsLoading } from 'src/reducers/itemCategorySlice';
import { getAllLocations } from 'src/reducers/locationSlice';
import { fetchShops } from "src/reducers/shopSlice";

// --------------------------------------------------------------------------------------------------

const Main = () => {
  const dispatch = useDispatch();
  const [searchKey, setSearchKey] = useState('');
  const IsLoading = useSelector(selectIsLoading);

  const [payload, setPayload] = useState({
    shops: [],
    categories: [],
    locations: [],
    searchKey: ''
  });

  const debouncePayload = debounce((key, value) => {
    setPayload((prevPayload) => ({
      ...prevPayload,
      [key]: value,
    }));
  }, 500);

  // Handle Tab Change
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event, newValue) => setTabValue(newValue);

// ================= Choose categories ==============================
  const categories = useSelector(selectAllCategories);
  const [selectedCategories, setSelectedCategories] = useState([
    {id: -2, name: 'All'}
  ]);

  // Add new category handler
  const handleAddCategory = (id, name) => dispatch(addItemCategory({ category: name }));

  // Change category handler
  const handleCategoriesChange = useCallback((value) => {
    setSelectedCategories(value);
    debouncePayload('categories', value.some((element) => element.id == -2) ? [] : value.map(element => element.id)) 
  }, []);

  const handleSearchTextChange = useCallback((e) => {
    setSearchKey(e.target.value);
    debouncePayload('searchKey', e.target.value)
  }, []);

  // Delete category handler
  const handleDeleteCategory = (id) => {
    dispatch(removeItemCategory(id));
    setSelectedCategories((prevSelectedCategories) =>
      prevSelectedCategories.filter(
        (category) => category.id !== id
      )
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
    const selectedCategoriesTemp = selectedCategories.filter(element => element.id !== categoryToDeleteId);
    debouncePayload('categories', selectedCategoriesTemp.some((element) => element.id == -2) ? [] : selectedCategoriesTemp.map(element => element.id)); 
  };

  // ================= Choose location ==============================
  const { locations } = useSelector((state) => state.locations);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const handleLocationSelectionChange = useCallback((event, newValue) => {
    setSelectedOptions(newValue);
    debouncePayload('locations', newValue.map((elem) => elem._id));
  }, []);

  // ================= Choose shop ==============================
  const { shops } = useSelector((state) => state.shops);
  const [selectedShop, setSelectedShop] = useState(null);
  const handleShopChange = (event) => setSelectedShop(event.target.value);

  useEffect(() => {
    dispatch(getAllCategories());
    dispatch(getAllLocations());
    dispatch(fetchShops());
  }, [dispatch]);

  return (
    <div className='flex flex-col gap-[32px] sm:gap-[48px]'>
      {tabValue === 0 && (
        <div className='flex flex-col gap-[24px] sm:gap-[32px]'>
          <Grid container rowSpacing={1}>
            <Grid item xs={12} md={12} lg={5}>
              <Typography variant="h6" className="capitalize">Choose shop</Typography>
            </Grid>
            <Grid item xs={12} md={12} lg={7}>
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
            </Grid>
          </Grid>

          <Grid container rowSpacing={1}>
            <Grid item xs={12} md={12} lg={5}>
              <Typography variant='h6' className="capitalize">Choose location</Typography>
            </Grid>
            <Grid item xs={12} md={12} lg={7}>
              <ChooseLocation
                options={locations}
                selectedOptions={selectedOptions}
                listClassName={'line-clamp-1'}
                onSelectionChange={handleLocationSelectionChange}
              />
            </Grid>
          </Grid>

          <Grid container rowSpacing={1}>
            <Grid item xs={12} md={12} lg={5}>
              <Typography variant='h6' className="capitalize">Choose category</Typography>
            </Grid>
            <Grid item xs={12} md={12} lg={7}>
              <CategoryAutoComplete
                selectedCategories={selectedCategories}
                onChangeSelectedCategories={handleCategoriesChange}
                categories={categories}
                handleDeleteSelectedCategory={handleDeleteSelectedCategory}
                editCategoryName={handleEditCategory}
                deleteCategoryName={handleDeleteCategory}
                AddCategory={handleAddCategory}
              />
            </Grid>
          </Grid>
        </div>
      )}

      <div id='tabs' className='flex flex-col gap-[24px]'>
        <div id='tab-label' className={`w-full flex ${tabValue === 0 ? 'flex-col xs:flex-row xs:items-end xs:justify-between gap-2' : 'justify-end items-end'}`}>
          {tabValue === 0 && (
            <Searchbar
              placeholder='Search item#, item name or keyword...'
              startAdornment={
                <InputAdornment position='start'>
                  <Iconify
                    icon='eva:search-fill'
                    sx={{ color: 'text.disabled', width: 20, height: 20 }}
                  />
                </InputAdornment>
              }
              value={searchKey}
              onChange={handleSearchTextChange}
            />
          )}

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label='Manage Items'>
              <Tab 
                label='Items' 
                {...tabProps(0)} 
                className='!font-gilroy !text-[14px] !text-disabled !normal-case px-2 ss:px-3' 
              />
              <Tab 
                label='Modifier Groups' 
                {...tabProps(1)} 
                className='!font-gilroy !text-[14px] !text-heading !normal-case px-2 ss:px-3' 
              />
            </Tabs>
          </Box>
        </div>

        <div id='tab-panel' className='relative'>
          {IsLoading && (
            <div className='w-full h-full absolute flex flex-col items-center justify-center z-50'>
              <ButtonLoader />
            </div>
          )}

          <TabPanel value={tabValue} index={0}>
            <Items {...payload} />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Modifiers />
          </TabPanel>
        </div>
      </div>
    </div>
  );
};

export default Main;