import React from "react";
import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

// ----------------------------------------------------------------------

export default function RHFTextField({
  name,
  helperText,
  type,
  icon,
  iconPosition = 'end', // Default position to 'end'
  ...other
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          type={type}
          value={type === 'number' && field.value === 0 ? '' : field.value}
          onChange={(event) => {
            if (type === 'number') {
              field.onChange(Number(event.target.value));
            } else {
              field.onChange(event.target.value);
            }
          }}
          error={!!error}
          helperText={error ? error?.message : helperText}
          InputProps={{
            [`${iconPosition}Adornment`]: icon ? (
              <InputAdornment position={iconPosition}>
                {React.cloneElement(icon, { fontSize: 'inherit' })} {/* Match font size */}
              </InputAdornment>
            ) : null,
          }}
          {...other}
        />
      )}
    />
  );
}

RHFTextField.propTypes = {
  name: PropTypes.string.isRequired,
  helperText: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  type: PropTypes.string,
  icon: PropTypes.element, // Optional icon prop as an element
  iconPosition: PropTypes.oneOf(['start', 'end']), // Icon position prop
};