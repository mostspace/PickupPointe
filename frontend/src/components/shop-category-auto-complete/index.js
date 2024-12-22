import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Checkbox,
  Chip,
  ListItemText,
  Typography,
} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

// Memoize the component to prevent unnecessary re-renders
const ShopCategoryAutoComplete = React.memo(
  ({
    selectedCategories,
    onChangeSelectedCategories,
    categories,
  }) => {
    const [categoriesWithAddOption, setCategoriesWithAddOption] = useState([]);

    useEffect(() => {
      setCategoriesWithAddOption([
        ...categories,
      ]);
    }, [categories]);

    // Memoize the rendered tags to avoid unnecessary renders
    const renderTags = useMemo(
      () => (value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            key={option._id}
            label={option.category}
            deleteIcon={
              <CloseOutlinedIcon sx={{ height: "16px", width: "16px" }} />
            }
            sx={{
              height: "24px",
              marginRight: "4px",
              borderRadius: "6px",
              marginTop: "3px",
              fontFamily: "Gilroy",
              fontSize: '12px',
            }}
            {...getTagProps}
          />
        )),
    );

    return (
      <>
        <Autocomplete
          multiple
          disableCloseOnSelect
          size="lg"
          value={selectedCategories}
          onChange={(event, newValue) => onChangeSelectedCategories(newValue)}
          options={categoriesWithAddOption}
          getOptionLabel={(option) => option.category || ""}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          renderTags={renderTags}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              size="lg"
              placeholder={
                selectedCategories.length === 0 ? "Choose category" : ""
              }
            />
          )}
          renderOption={(props, option, { selected }) => {
            return (
              <li {...props} key={option._id}>
                <div className="flex items-center">
                  <Checkbox size="small" checked={selected} sx={{ marginRight: 1 }} />
                  <img src={option.photo} className="mr-3 w-[20px] h-[20px]" loading="lazy"/>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                        {option.category}
                      </Typography>
                    }
                  />
                </div>
              </li>
            );
          }}
        />
      </>
    );
  }
);

export default ShopCategoryAutoComplete;
