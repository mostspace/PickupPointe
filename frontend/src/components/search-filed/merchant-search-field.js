import React, { useState, useRef, useEffect, useCallback } from "react";
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import Iconify from "src/components/iconify/iconify";
import { Select, MenuItem } from "@mui/material";

const SearchField = ({
  placeholder = 'Search item name...',
  iconColor = '#A3A3A3',
  fontSize = 14,
  defaultValue = '',
  onSearch = () => {},
  categories = [],
  ...rest
}) => {
  const theme = useTheme();
  const [keyword, setKeyword] = useState(defaultValue || '');
  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      onSearch(searchTerm);
    }, 500),
    [onSearch]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleChange = (e) => {
    const value = e.target.value;
    setKeyword(value);
    debouncedSearch(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      debouncedSearch.cancel();
      onSearch(keyword);
    }
  };

  const handleIconClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const inputRef = useRef(null);
  const [isDisabled, setIsDisabled] = useState(false);

  return (
    <div className="w-full flex items-center justify-end">
        <OutlinedInput
          id="search-field"
          type="text"
          sx={{
          fontSize,
          borderRadius: "6px 0 0 6px",
          marginRight: "-1px",
          width: 50,
          height: 40,
          transition: theme.transitions.create(['box-shadow', 'width'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }),
          '&.Mui-focused': {
            width: 464,
          },
          '& fieldset': {
            borderWidth: `1px !important`,
            borderColor: `${theme.palette.grey[400]} !important`,
          },
          [theme.breakpoints.down('sm')]: {
            width: '100%',
          },
          }}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          value={keyword}
          onChange={handleChange}
          startAdornment={
          <InputAdornment position="start" onClick={handleIconClick}>
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
          </InputAdornment>
          }
          disabled={isDisabled}
          inputRef={inputRef}
          {...rest}
        />
        <Select
          sx={{
          fontSize,
          borderRadius: "0 6px 6px 0",
          minWidth: 70,
          height: 40,
          '& fieldset': {
            borderWidth: `1px !important`,
            borderColor: `${theme.palette.grey[400]} !important`,
          },
          }}
          size="small"
          defaultValue={1}
        >
          <MenuItem key={1} value={1} className="!text-[12px] sm:!text-[14px] !font-gilroy">
            All
          </MenuItem>
          {categories.map((category, index) => (
          <MenuItem key={index} value={category} className="!text-[12px] sm:!text-[14px] !font-gilroy">
            {category}
          </MenuItem>
          ))}
        </Select>
    </div>
  );
};

SearchField.propTypes = {
  placeholder: PropTypes.string,
  iconColor: PropTypes.string,
  fontSize: PropTypes.number,
  defaultValue: PropTypes.string,
  onSearch: PropTypes.func,
};

export default SearchField;