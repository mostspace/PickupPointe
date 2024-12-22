import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import {Box, Button, Chip, Typography} from '@mui/material';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import {useDispatch, useSelector} from 'react-redux';
import {getAllLocations, getLocationByShop} from 'src/reducers/locationSlice';
import React, {useEffect} from 'react';
import AddIcon from "@mui/icons-material/Add";

// Icons for checkbox states
const icon = <CheckBoxOutlineBlankIcon fontSize='small' />;
const checkedIcon = (
  <CheckBoxOutlinedIcon
    style={{
      fontSize: 20,
      backgroundColor: 'transparent',
      color: 'primary',
      borderRadius: '4px',
    }}
  />
);

// Styling constants
const styles = {
  chip: {
    borderRadius: '6px',
    color: '#181818',
    backgroundColor: '#F5F5F5',
    fontSize: '12px',
    fontFamily: 'Gilroy',
    marginRight: '4px',
    marginTop: '2px',
    '& .MuiChip-deleteIcon': {
      color: '#181818',
      width: 14,
      height: 14,
    },
  },
  autocompleteInput: {
    '& .MuiOutlinedInput-root': {
      paddingRight: '36px !important',
    },
  },
  optionSelected: {
    backgroundColor: '#6666660a',
  },
  paperContainer: (showButtons) => ({
    paddingBottom: showButtons ? 2 : 0,
    backgroundColor: 'white',
  }),
  buttonContainer: {
    display: 'flex',
    gap: '8px',
    padding: '8px',
    borderTop: '2px solid #ccc',
    backgroundColor: 'white',
  },
  clearButton: {
    width: '100%',
    border: 'none',
    color: 'black',
  },
  saveButton: {
    width: '100%',
  },
};

export const getProfileLocationAddress = (address) => {
  if (address) {
    const {street, city, state, zipCode} = address
    return `${street}, ${city}, ${state}, ${zipCode}`;
  }
  return "";
}

export const parseLocationAddress = (address) => {
  const [street, city, zip] = address.split(", ");
  const [state, zipCode] = zip.split(" ");

  return {
    address: {
      street: street || "",
      city: city || "",
      state: state || "",
      countryCode: "US",
      zipCode: zipCode || ""
    }
  };
}

export const getLocationAddress = (location) => {
  if (location && location.address) {
    const {street, city, state, countryCode, zipCode} = location.address;
    return `${street}, ${city}, ${state}, ${countryCode} ${zipCode}`;
  }
  return "";
}

export const chipLocationAddress = (location) => {
  if (location && location.address) {
    const {street, city, state, countryCode, zipCode} = location.address;
    return `${street}, ${city}, ${state}`;
  }
  return "";
}

export default function CheckboxesTags({
  options,
  selectedOptions,
  onSelectionChange,
  onAddLocation,
  chipClassName,
  listClassName,
  ClassName,
  limitTags = 100,
  showButtons = false,
  onSave,
  onClear,
  disabled = false
}) {
  const exceedLimit = selectedOptions.length > limitTags;
  const dispatch = useDispatch();

  let selOptions = selectedOptions.map(options => options.location || options);
  const moreCount = exceedLimit ? selectedOptions.length - limitTags : 0;
  const { locations } = useSelector((state) => state.locations);
  const autocompleteOptions = [...options ? options : locations, { _id: "-1", name: "Add Location" }]

  useEffect(() => {
    if (locations.length === 0) {
      dispatch(getAllLocations());
    }
  }, []);

  return (
    <>
      <Autocomplete
        disabled={disabled}
        multiple
        disableClearable
        id='checkboxes-tags-demo'
        limitTags={limitTags}
        options={autocompleteOptions}
        value={selOptions}
        onChange={onSelectionChange}
        disableCloseOnSelect
        isOptionEqualToValue={(option, value) => option._id === value._id}
        getOptionLabel={(option) => option._id}
        className={ClassName}
        popupIcon={<KeyboardArrowDownOutlinedIcon />}
        renderInput={(params) => (
          <TextField
            {...params}
            label=''
            sx={styles.autocompleteInput}
            placeholder={selOptions.length === 0 ? 'Choose Location' : ''}
          />
        )}
        renderOption={(props, option, { selected }) => {
          if (option._id === "-1") {
            return (
              <li {...props} key={`li_addr_${option.id}`} onClick={onAddLocation}>
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
          return (
            <li
              {...props}
              key={option._id}
              style={selected ? styles.optionSelected : {}}
              className={listClassName}
            >
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {getLocationAddress(option)}
            </li>
          )
        }}
        renderTags={(value, getTagProps) => (
          <>
            {selOptions.map((option, index) => (
              <Chip
                key={`chip_tag_${index}`}
                label={chipLocationAddress(option)}
                {...getTagProps({ index })}
                deleteIcon={<CloseOutlinedIcon />}
                sx={styles.chip}
                className={chipClassName}
              />
            ))}
            {exceedLimit && (
              <Chip
                key='more'
                label={`${moreCount} more`}
                sx={{
                  ...styles.chip,
                  backgroundColor: '#F5F5F5', // Style for the "more" chip
                }}
                className={chipClassName}
              />
            )}
          </>
        )}
        PaperComponent={(props) => (
          <Box {...props} sx={styles.paperContainer(showButtons)}>
            {props.children}
            {showButtons && (
              <Box sx={styles.buttonContainer}>
                <Button
                  variant='outlined'
                  onClick={onClear}
                  sx={styles.clearButton}
                >
                  Clear
                </Button>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={onSave}
                  sx={styles.saveButton}
                >
                  Save
                </Button>
              </Box>
            )}
          </Box>
        )}
        noOptionsText="No locations"
      />
    </>
  );
}
