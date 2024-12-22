import React from "react";

// @mui
import {
  FormControl, RadioGroup, Radio, FormControlLabel, Typography,
} from '@mui/material';

// Icons
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Components
import LightTooltip from "src/components/LightTooltip";

import {
  RHFTextField
} from 'src/components/hook-form';
import { useFormContext } from "react-hook-form";

// --------------------------------------------------------------------------------------------------

const ImportantNotes = () => {
  const {
    watch,
    setValue,
  } = useFormContext();

  const handleImportantNodesChange = (field, value) => {
    const importantValues = watch("importantNotes");
    const newValue = {
      ...importantValues,
      [field]: value,
    }
    setValue("importantNotes", newValue);
  }

  const handleCustomerChange = (event) => {
    const isVisibleToCustomers = event.target.value === "customers";
    handleImportantNodesChange("isVisibleToCustomers", isVisibleToCustomers)
  }

  return (
    <>
      <div className="flex flex-col gap-[14px] w-full">
        <div className="sm:flex justify-between items-center">
          <Typography variant="h5" className="capitalize">Important notes</Typography>
          <FormControl>
            <RadioGroup
              row
              value={`${watch("importantNotes").isVisibleToCustomers ? "customers" : "team" }`}
              aria-label="tabs"
              name="tabs"
              onChange={handleCustomerChange}
            >
              <FormControlLabel
                value="customers"
                control={<Radio sx={{ '&.Mui-checked': { color: '#F14445' } }} size="small" />}
                label={
                  <span className="text-[14px]">
                    Visible to customers
                    <LightTooltip title="These notes will be visible to the customer upon item checkout and order receipt." >
                      <InfoOutlinedIcon sx={{ fontSize: '16px', marginBottom: '3px', marginLeft: '5px' }} />
                    </LightTooltip>
                  </span>}
              />
              <FormControlLabel
                value="team"
                control={<Radio sx={{ '&.Mui-checked': { color: '#F14445', fontSize: '12px' } }} size="small" />}
                label={
                  <span className="text-[14px]">
                    Internal notes
                    <LightTooltip title="These notes will be visible internally and to the pickup point reception upon pickup of your item if you are subscribed to the Pro plan." >
                      <InfoOutlinedIcon sx={{ fontSize: '16px', marginBottom: '3px', marginLeft: '5px' }} />
                    </LightTooltip>
                  </span>
                }
              />
            </RadioGroup>
          </FormControl>
        </div>
        <FormControl className="w-full">
          <RHFTextField 
            name="subDescription" 
            multiline rows={4} 
            placeholder="Enter description" 
            defaultValue={watch("importantNotes").description} 
            onChange={event => handleImportantNodesChange("description", event.target.value)}
          />
        </FormControl>
      </div>
    </>
  );
}

export default ImportantNotes;