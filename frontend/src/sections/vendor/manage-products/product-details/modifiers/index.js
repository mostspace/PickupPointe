import React, { useEffect, useState } from 'react';

// @mui
import { Typography, IconButton, Popover, MenuItem } from '@mui/material';

// Icons
import AddIcon from '@mui/icons-material/Add';

// Components
import ModifierItem from './modifier-item';
import { getModifiers } from 'src/api/vendor/modifier';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectItem } from 'src/reducers/itemSlice';

// --------------------------------------------------------------------------------------------------

const Modifiers = ({onChangeModifiers}) => {
  const { itemId } = useParams();
  const item = useSelector(state => selectItem(state, itemId));
  // State to keep track of modifier items
  const [modifiers, setModifiers] = useState([]); // Start with initial data
  const [filteredOptions, setFilteredOptions] = useState([]);

  const [modifierOptions, setModifiersOptions] = useState([]);

  const fetchModifiders = async () => {
    const res = await getModifiers();
    setModifiersOptions(res.modifiers)
  }

  useEffect(() => {
    const elems = modifierOptions.filter(elem => item.modifiers.includes(elem._id))
    setModifiers(elems)
  }, [item, modifierOptions])

  useEffect(() => {
    fetchModifiders();
  }, [])


  useEffect(() => {
    // Filter out options that are already present in the modifiers
    const updatedOptions = modifierOptions.filter(
      (option) => !modifiers.map(elem => elem._id).includes(option._id)
    );

    setFilteredOptions(updatedOptions);
  }, [modifiers, modifierOptions]);

  useEffect(() => {
    onChangeModifiers(modifiers.map(elem => elem._id))
  }, [modifiers])

  // Function to remove a modifier item by ID
  const handleRemoveModifier = (idToRemove) => {
    setModifiers((prevModifiers) =>
      prevModifiers.filter((modifier) => modifier._id !== idToRemove)
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

  return (
    <div className='w-full flex flex-col gap-[48px]'>
      <div className='w-full flex flex-col gap-[20px]'>
        <Typography variant='h5' className='capitalize'>
          Customization Options
        </Typography>
        <div className='flex justify-between items-center'>
          <Typography variant='h6' className='capitalize'>
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
            <Typography variant='subtitle2' className='text-center mt-10'>
              No modifier groups created yet
            </Typography>
          ) : (
            modifiers.map((modifier) => (
              <ModifierItem
                key={modifier._id} // Use unique id as key
                modifier={modifier}
                removeModifier={() => handleRemoveModifier(modifier._id)} // Pass the correct id
                isPreview
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
            className='font-gilroy text-[14px]'
          >
            {option.name}
          </MenuItem>
        ))}
      </Popover>
    </div>
  );
};

export default Modifiers;