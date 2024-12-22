import React, { useState, } from "react";

// @mui
import {
  FormControlLabel, Typography, Checkbox,
} from '@mui/material';

import {
  RHFTextField,
} from 'src/components/hook-form';
import { useFormContext } from "react-hook-form";

// --------------------------------------------------------------------------------------------------

const InclusionsItem = () => {
  const {
    watch,
    setValue,
  } = useFormContext();

  // Other Field Checkbox
  const [showOtherField, setShowOtherField] = useState(watch("inclusions").isOther ? true : false);

  const handleCheckboxChange = (event) => {
    setShowOtherField(event.target.checked);
    if (!event.target.checked) {
      setValue("inclusions.otherDetails", "");
    }
    handleInclusionChange(event, "isOther");
  };

  const handleInclusionChange = (event, field) => {
    const inclusions = watch("inclusions");
    const newValue = {
      ...inclusions,
      [field]: field !== "otherDetails" ? event.target.checked : event.target.value,
    }
    setValue("inclusions", newValue);
  }

  return (
    <>
      <div className="flex flex-col gap-[14px]">
        <Typography variant="h5" className="capitalize">Inclusions with this item</Typography>
        <div className="flex flex-col sm:flex-row justify-between gap-0 sm:gap-[24px]">
          <div className="w-full flex flex-col">
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={watch("inclusions").isEatingUtensilsIncluded ? true : false}
                  onChange={event => handleInclusionChange(event, "isEatingUtensilsIncluded")}
                />
              }
              label={<span className="text-[14px]">Eating utensils included</span>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={watch("inclusions").isCondimentsIncluded ? true : false}
                  onChange={event => handleInclusionChange(event, "isCondimentsIncluded")}
                />
              }
              label={<span className="text-[14px]">Condiments included</span>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={watch("inclusions").isIdsposableHeatingPads ? true : false}
                  onChange={event => handleInclusionChange(event, "isIdsposableHeatingPads")}
                  size="small"
                />
              }
              label={<span className="text-[14px]">Disposable Heating pads</span>}
            />
          </div>
          <div className="w-full flex flex-col">
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={watch("inclusions").isDisposableCoolingPads ? true : false}
                  onChange={event => handleInclusionChange(event, "isDisposableCoolingPads")}
                />
              }
              label={<span className="text-[14px]">Disposable Cooling pads</span>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={watch("inclusions").isExtraFragile ? true : false}
                  onChange={event => handleInclusionChange(event, "isExtraFragile")}
                  size="small"
                />
              }
              label={<span className="text-[14px]">Extra fragile</span>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={watch("inclusions").IsLiquids ? true : false}
                  onChange={event => handleInclusionChange(event, "IsLiquids")}
                />
              }
              label={<span className="text-[14px]">Liquids</span>}
            />
          </div>
          <div className="w-full flex flex-col">
            <FormControlLabel
              control={
                <Checkbox
                  checked={watch("inclusions").isDiscountCertificates ? true : false}
                  onChange={event => handleInclusionChange(event, "isDiscountCertificates")}
                  size="small"
                />
              }
              label={<span className="text-[14px]">Discount Certificates</span>}
            />
            <FormControlLabel
              control={<Checkbox size="small" checked={watch("inclusions").isOther ? true : false} onChange={handleCheckboxChange} />}
              label={<span className="text-[14px]">Other</span>}
            />
            {watch("inclusions").isOther && (
              <RHFTextField
                fullWidth
                name="newLabel.content"
                placeholder='Describe what else'
                className="mt-2 sm:mt-0"
                value={watch("inclusions").otherDetails ? watch("inclusions").otherDetails : ""}
                onChange={event => handleInclusionChange(event, "otherDetails")}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default InclusionsItem;