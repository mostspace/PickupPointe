import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';

// Define styles for different status chips and common chip styles
const chipStyles = {
  Active: {
    backgroundColor: '#DFF7E2',
    color: '#3ACC48',
  },
  Suspended: {
    backgroundColor: '#FBE8D2',
    color: '#DD7E26',
  },
  Inactive: {
    backgroundColor: '#FBD9DA',
    color: '#F14445',
  },
  common: {
    borderRadius: '5px',
    padding: '2px 4px',
    fontSize: '12px',
    fontStyle: 'normal',
    fontWeight: '400',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100px',
    textAlign: 'center',
  },
};

// Define styles for menu items in the dropdown
const menuItemStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '20px',
};

// Define styles for the select component
const selectStyles = {
  '.MuiSelect-select': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'start',
    paddingLeft: '5px'
  },
};

// Define the possible statuses and their labels
const statuses = {
  Active: 'Active',
  Suspended: 'Suspended',
  Inactive: 'Inactive',
};

// UserStatusSelect component for selecting user status
const UserStatusSelect = ({ status, onChange }) => {
  // Render a menu item with a chip and a checkmark icon if selected
  const renderMenuItem = (value, label) => (
    <MenuItem key={value} value={value} sx={menuItemStyles}>
      <Chip
        label={label}
        style={{
          ...chipStyles[value], // Apply specific styles based on the status
          ...chipStyles.common, // Apply common styles
        }}
        className='font-gilroy'
      />
      {/* {status === value ? <DoneOutlinedIcon className='text-primary' /> : null}{' '} */}
      {/* Show checkmark icon if selected */}
    </MenuItem>
  );

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth sx={{ paddingLeft: 0 }}>
        <Select
          labelId='user-status-select-label'
          value={status}
          onChange={onChange} // Handle status change
          IconComponent={KeyboardArrowDownOutlinedIcon} // Custom icon for the dropdown
          renderValue={(selected) => (
            <Chip
              label={statuses[selected]} // Display the selected status
              style={{
                ...chipStyles[selected], // Apply specific styles based on the status
                ...chipStyles.common, // Apply common styles
              }}
              className='font-gilroy'
            />
          )}
          MenuProps={{
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left',
            },
            getContentAnchorEl: null,
          }}
          sx={selectStyles}
        >
          {Object.entries(statuses).map(
            ([value, label]) => renderMenuItem(value, label) // Render each menu item
          )}
        </Select>
      </FormControl>
    </Box>
  );
};

export default UserStatusSelect;
