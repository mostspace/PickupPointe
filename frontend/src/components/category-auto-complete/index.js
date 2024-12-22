import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Checkbox,
  Chip,
  IconButton,
  MenuItem,
  Popover,
  Divider,
  ListItemText,
  Box,
  Typography,
} from "@mui/material";
import MoreHorizRounded from "@mui/icons-material/MoreHorizRounded";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import SaveAsOutlinedIcon from "@mui/icons-material/SaveAsOutlined";
import AddIcon from "@mui/icons-material/Add";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

// Memoize the component to prevent unnecessary re-renders
const CategoryAutoComplete = React.memo(
  ({
    selectedCategories,
    onChangeSelectedCategories,
    categories,
    handleDeleteSelectedCategory,
    editCategoryName,
    deleteCategoryName,
    AddCategory,
    error,
    required
  }) => {
    const [openSettingMenu, setOpenSettingMenu] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [inputValue, setInputValue] = useState(""); // To handle both add and edit input
    const [isEditing, setIsEditing] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [categoriesWithAddOption, setCategoriesWithAddOption] = useState([]);

    useEffect(() => {
      setCategoriesWithAddOption([
        ...categories,
        { id: -2, name: "All" },
        { id: -1, name: "Add Category" }, // Special option for adding a new category
      ]);
    }, [categories]);

    const handleAddCategory = useCallback(() => {
      setIsAdding(true);
      setInputValue(""); // Clear input value for new category
    }, []);

    // Handle input change for both add and edit
    const handleInputChange = useCallback((event) => {
      setInputValue(event.target.value);
    }, []);

// Handle category addition
const handleAddNewCategory = useCallback(() => {
  if (inputValue.trim()) {
    const newCategory = {
      id: categoriesWithAddOption.length, // Use the length of categoriesWithAddOption for unique ID
      name: inputValue.trim(),
    };

    setCategoriesWithAddOption((prevCategories) => [
      ...prevCategories.slice(0, -1), // Exclude the 'Add Category' option temporarily
      newCategory,
      { id: -1, name: "Add Category" }, // Re-add the 'Add Category' option
    ]);

    AddCategory(newCategory.id,newCategory.name)

    setIsAdding(false);
    setInputValue("");
  }
}, [inputValue, categoriesWithAddOption.length , AddCategory]);


    // Handle category edit
    const handleEditCategory = useCallback(() => {
      if (editingCategoryId && inputValue.trim()) {
        editCategoryName(editingCategoryId, inputValue.trim());
        setIsEditing(false);
        setInputValue("");
        setOpenSettingMenu(null);
      }
    }, [editingCategoryId, inputValue, editCategoryName]);

    // Handle button click based on action (add or edit)
    const handleButtonClick = useCallback(() => {
      if (isAdding) {
        handleAddNewCategory();
      } else if (isEditing) {
        handleEditCategory();
      }
    }, [isAdding, isEditing, handleAddNewCategory, handleEditCategory]);

    // Handle key press for both add and edit input
    const handleKeyPress = useCallback(
      (event) => {
        if (event.key === "Enter") {
          handleButtonClick();
        }
      },
      [handleButtonClick]
    );

    // Handle more icon click
    const handleMoreClick = useCallback(
      (event, categoryId) => {
        event.stopPropagation(); // Prevent event from bubbling up
        if (openSettingMenu && selectedCategoryId === categoryId) {
          // If already open and clicking the same category, close it
          handleSettingMenuClose();
        } else {
          // Otherwise, open it for the selected category
          setSelectedCategoryId(categoryId);
          setOpenSettingMenu(event.currentTarget);

          // Set the name for the category being edited
          const categoryToEdit = categoriesWithAddOption.find(
            (cat) => cat.id === categoryId
          );
          if (categoryToEdit) {
            setInputValue(categoryToEdit.name);
          }
        }
      },
      [openSettingMenu, selectedCategoryId, categoriesWithAddOption]
    );

    // Handle setting menu close
    const handleSettingMenuClose = useCallback(() => {
      setOpenSettingMenu(null);
      setSelectedCategoryId(null);
      setIsEditing(false);
      setIsAdding(false);
    }, []);

    // Handle category deletion
    const handleDeleteCategory = useCallback(() => {
      if (selectedCategoryId) {
        // Remove the category from the main categories list
        deleteCategoryName(selectedCategoryId);
        // Close the popover menu
        handleSettingMenuClose();
      }
    }, [selectedCategoryId, deleteCategoryName, handleSettingMenuClose]);

    // Memoize the rendered tags to avoid unnecessary renders
    const renderTags = useMemo(
      () => (value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            key={option.id}
            label={option.name}
            deleteIcon={
              <CloseOutlinedIcon sx={{ height: "16px", width: "16px" }} />
            }
            onDelete={() => handleDeleteSelectedCategory(option.id)}
            sx={{
              height: "24px",
              marginRight: "4px",
              borderRadius: "6px",
              marginTop: "3px",
              fontFamily: 'Gilroy',
              fontSize: '12px',
            }}
            {...getTagProps}
          />
        )),
      [handleDeleteSelectedCategory]
    );

    return (
      <>
        <Autocomplete
          multiple
          size="lg"
          value={selectedCategories}
          onChange={(event, newValue) => onChangeSelectedCategories(newValue)}
          options={categoriesWithAddOption}
          getOptionLabel={(option) => option.name || ""}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          popupIcon={<KeyboardArrowDownOutlinedIcon />}
          renderTags={renderTags}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              size="lg"
              required={required ? selectedCategories.length === 0 : false}
              placeholder={
                selectedCategories.length === 0 ? "Choose category" : ""
              }
              error={error ? true : false}
            />
          )}
          renderOption={(props, option, { selected }) => {
            // Render a special list item for "+ Add Category"
            if (option.id === -1) {
              return (
                <li {...props} key={option.id} onClick={handleAddCategory}>
                  <AddIcon
                    size="small"
                    className="text-normal"
                    sx={{ marginRight: 1, marginLeft: 1 }}
                  />
                  <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                    {option.name}
                  </Typography>
                </li>
              );
            }

            // Render regular category options
            return (
              <li {...props} key={option.id}>
                <Checkbox size="small" checked={selected} sx={{ marginRight: 1 }} />
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                      {option.name}
                    </Typography>
                  }
                />
                <IconButton
                  className="more-button"
                  onClick={(event) => handleMoreClick(event, option.id)}
                  sx={{ marginLeft: "auto" }}
                >
                  <MoreHorizRounded className="text-[16px] text-heading" />
                </IconButton>
              </li>
            );
          }}
        />

        <Popover
          open={Boolean(openSettingMenu)}
          anchorEl={openSettingMenu}
          onClose={handleSettingMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              p: 1,
              width: 150,
              "& .MuiMenuItem-root": {
                px: 1,
                typography: "body2",
                borderRadius: 0.75,
                fontFamily: "Gilroy",
              },
            },
          }}
          disableAutoFocus
          disableEnforceFocus
        >
          <MenuItem
            onClick={() => {
              handleSettingMenuClose();
              setIsEditing(true);
              setEditingCategoryId(selectedCategoryId);
            }}
          >
            Edit
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={handleDeleteCategory}
            sx={{ color: "error.main", fontFamily: "Gilroy" }}
          >
            Delete
          </MenuItem>
        </Popover>

        {(isEditing || isAdding) && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 2,
              fontFamily: "Gilroy",
            }}
          >
            <TextField
              className="!font-gilroy"
              placeholder={isAdding ? "Enter new category" : "Edit category"}
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              variant="outlined"
              sx={{
                flexGrow: 1,
                marginRight: "8px",
                fontFamily: "Gilroy !important",
              }}
              autoFocus
            />
            <IconButton onClick={handleButtonClick} color="primary">
              {isAdding ? <ControlPointIcon /> : <SaveAsOutlinedIcon />}
            </IconButton>
            <IconButton onClick={handleSettingMenuClose} color="error">
              <CloseOutlinedIcon />
            </IconButton>
          </Box>
        )}
      </>
    );
  }
);

export default CategoryAutoComplete;
