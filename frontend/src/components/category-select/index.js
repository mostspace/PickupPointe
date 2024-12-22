import React, { useState, useRef } from "react";
import PropTypes from "prop-types";

// @mui
import {
  Radio,
  Typography,
  TextField,
  IconButton,
  Box,
  Autocomplete,
  Popover,
  MenuItem,
  Divider,
} from "@mui/material";

// Icons
import { MoreHorizRounded } from "@mui/icons-material";
import SaveAsOutlinedIcon from '@mui/icons-material/SaveAsOutlined';
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const CategorySelect = ({
  categories,
  onAddCategory,
  onChange,
  onDeleteCategory,
  onEditCategory,
}) => {
  const [category, setCategory] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // State for the popover menu
  const [openSettingMenu, setOpenSettingMenu] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState(""); // State for editing category
  const [isEditing, setIsEditing] = useState(false); // State to manage edit mode

  // State to control Autocomplete open state
  const [isAutocompleteOpen, setAutocompleteOpen] = useState(false);

  // Ref for Autocomplete
  const autocompleteRef = useRef(null);

  // Prepare options for the Autocomplete component
  const categoryOptions = categories.map((category) => ({
    id: category.id,
    label: category.name,
    items: category.items,
  }));

  // Handle category change
  const handleCategoryChange = (event, newValue) => {
    if (newValue && newValue.id === -1) {
      // Entering add mode when "Add Category" is selected
      setIsAdding(true);
      setCategory(null);
    } else {
      setCategory(newValue);
      onChange(newValue?.id || null); // Pass the selected category id
    }
  };

  // Add category
  const handleAddCategory = () => {
    if (newCategory.trim() !== "") {
      const newCategoryId = categories.length + 1;
      onAddCategory(newCategoryId, newCategory);
      setNewCategory("");
      setIsAdding(false); // Exit adding mode after adding a category
    }
  };

  // Delete category
  const handleDeleteCategory = () => {
    if (selectedCategoryId !== null) {
      onDeleteCategory(selectedCategoryId);
      setOpenSettingMenu(null); // Close the popover menu
    }
  };

  // Edit category
  const handleEditCategory = () => {
    if (selectedCategoryId !== null) {
      const newName = editCategoryName.trim();
      if (newName !== "") {
        onEditCategory(selectedCategoryId, newName);
        setEditCategoryName(""); // Clear the input field after editing
        setIsEditing(false); // Exit edit mode
        setOpenSettingMenu(null); // Close the popover menu
        // Open Autocomplete dropdown menu
        // autocompleteRef.current?.focus();
      }
    }
  };

  // Handle popover menu
  const handleMoreClick = (event, categoryId) => {
    event.stopPropagation(); // Prevent event from bubbling up
    if (openSettingMenu && selectedCategoryId === categoryId) {
      // If already open and clicking the same category, close it
      handleSettingMenuClose();
    } else {
      // Otherwise, open it for the selected category
      setSelectedCategoryId(categoryId);
      setOpenSettingMenu(event.currentTarget);
      // Set the name for the category being edited
      const categoryToEdit = categories.find((cat) => cat.id === categoryId);
      if (categoryToEdit) {
        setEditCategoryName(categoryToEdit.name);
      }
    }
  };

  // Handle input changes
  const handleInputChange = (event) => {
    setNewCategory(event.target.value);
  };

  // Handle key press for adding category
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleAddCategory(); // Add category on Enter key press
    }
  };

  const handleSettingMenuClose = () => {
    setOpenSettingMenu(null);
    setEditCategoryName(""); // Clear the input field when closing the menu
    setIsEditing(false); // Exit edit mode when closing the menu
  };

  const handleEditInputChange = (event) => {
    setEditCategoryName(event.target.value);
  };

  return (
    <div className="relative">
      <Autocomplete
        ref={autocompleteRef}
        sx={{ fontFamily: 'Gilroy' }}
        value={category}
        onChange={handleCategoryChange}
        options={[
          ...categoryOptions,
          { id: -1, label: "Add Category" }, // Special option for adding a category
        ]}
        getOptionLabel={(option) => option.label}
        renderInput={(params) => (
          <TextField {...params} placeholder="Select Category" variant="outlined" />
        )}
        renderOption={(props, option) => (
          <li {...props}>
            <Divider />
            {option.id === -1 ? (
              // Render Add Category button as an option
              <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                <AddCircleOutlineIcon sx={{ marginRight: "8px" }} />
                <Typography variant="subtitle2">New [Additional]</Typography>
              </Box>
            ) : isEditing && selectedCategoryId === option.id ? (
              // Render editable input field for the category being edited
              <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                <TextField
                  value={editCategoryName}
                  onChange={handleEditInputChange}
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      handleEditCategory();
                    }
                  }}
                  placeholder="Edit category name"
                  variant="outlined"
                  sx={{ flexGrow: 1, marginRight: "8px" }}
                  autoFocus // Automatically focus the input field
                />
                <IconButton onClick={handleEditCategory} color="primary">
                  <SaveAsOutlinedIcon />
                </IconButton>
              </Box>
            ) : (
              // Render regular category options
              <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                <Radio
                  checked={category?.id === option.id}
                  size="small"
                  sx={{
                    padding: "0 8px 0 0", // Remove default padding and add custom padding
                  }}
                />
                <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                  {option.label} ({option.items})
                </Typography>
                
                <IconButton
                  className="more-button"
                  onClick={(event) => handleMoreClick(event, option.id)}
                  sx={{
                    marginLeft: "auto", // Aligns the icon to the far right
                  }}
                >
                  <MoreHorizRounded className="text-[16px] text-heading" />
                </IconButton>
              </Box>
            )}
          </li>
        )}
      />
      {isAdding && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mt: 2,
            fontFamily: "Gilroy",
          }}
        >
          {/* Render TextField when adding a new category */}
          <TextField
            className="!font-gilroy"
            placeholder="Enter new category"
            value={newCategory}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress} // Handle Enter key press
            variant="outlined"
            sx={{ flexGrow: 1, marginRight: "8px", fontFamily: "Gilroy !important" }}
            autoFocus // Automatically focus the input field
          />
          <IconButton onClick={handleAddCategory} color="primary">
            <AddCircleOutlineIcon />
          </IconButton>
        </Box>
      )}

      {/* Handle Location Card More Popper Menu */}
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
        // Prevent the popover from closing when interacting with it
        disableAutoFocus
        disableEnforceFocus
      >
        <MenuItem onClick={() => {
          handleSettingMenuClose();
          setIsEditing(true); // Enable editing mode
        }}>
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
    </div>
  );
};

CategorySelect.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onAddCategory: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onDeleteCategory: PropTypes.func.isRequired,
  onEditCategory: PropTypes.func.isRequired,
};

CategorySelect.defaultProps = {
  categories: [],
};

export default CategorySelect;