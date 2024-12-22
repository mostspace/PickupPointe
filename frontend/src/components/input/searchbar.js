import {
  styled, alpha, OutlinedInput,
} from '@mui/material';
import PropTypes from 'prop-types';
import {useCallback, useEffect, useState} from "react";
import {debounce} from "lodash";

// --------------------------------------------------------------------------------------------------

const StyledSearchbar = styled(OutlinedInput)(({ theme }) => ({
  width: 310,
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
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    '&.Mui-focused': {
      width: '100%',
    },
  },
}));

const Searchbar = ({ defaultValue, onSearch, placeholder, ...props }) => {
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

  return (
    <StyledSearchbar
      value={keyword}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      {...props}
    />
  );
};

Searchbar.propTypes = {
  onSearch: PropTypes.func,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
};

export default Searchbar;