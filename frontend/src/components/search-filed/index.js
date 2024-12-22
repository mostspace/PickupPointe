import OutlinedInput from '@mui/material/OutlinedInput';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';

const SearchField = ({
  placeholder = 'Search name, email or keyword...',
  iconColor = '#A3A3A3',
  fontSize = 14,
  width = '100%',
  defaultValue = '',
  onSearch = () => {},
  ...rest
}) => {
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

  const handleClickSearch = () => {
    debouncedSearch.cancel();
    onSearch(keyword);
  };
 
  return (
    <OutlinedInput
      id='search-field'
      type='text'
      sx={{ fontSize, width }}
      placeholder={placeholder}
      onKeyDown={handleKeyDown}
      value={keyword}
      onChange={handleChange}
      endAdornment={
        <InputAdornment position='end'>
          <SearchOutlinedIcon 
            style={{cursor: "pointer"}} 
            sx={{ color: iconColor }} 
            onClick={handleClickSearch}
          />
        </InputAdornment>
      }
      {...rest}
    />
  );
};

SearchField.propTypes = {
  placeholder: PropTypes.string,
  iconColor: PropTypes.string,
  fontSize: PropTypes.number,
  width: PropTypes.string,
  defaultValue: PropTypes.string,
  onSearch: PropTypes.func,
};

export default SearchField;
