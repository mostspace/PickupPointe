import React, { useState, useCallback, useEffect  } from "react";
import {
  Radio, FormControl, RadioGroup, FormControlLabel, Typography,
} from '@mui/material';
import _ from 'lodash';

import { useSelector } from "react-redux";

import ChooseLocation from 'src/components/choose-location-select';
import { useModalState } from "src/contexts/ModalContext";

// ====================================================================================================

export default function SubscribePlanForm({ handlePlanChange, plan, shopData }) {
  // State to track the selected plan within SubscribePlanForm
  const [selectedPlan, setSelectedPlan] = useState(null);
  const modalState = useModalState();

  // Local handler to update selected plan and notify parent component
  const onPlanSelect = (event) => {
    const plan = event.target.value;
    setSelectedPlan(plan);
    handlePlanChange(plan); // Notify parent
  };

  const handleDivClick = (value) => {
    setSelectedPlan(value);
    handlePlanChange(value); // Notify parent
  };

  // Choose location
  const { locations, status } = useSelector((state) => state.locations);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [shopLocations, setShopLocations] = useState([]);

  const handleLocationSelectionChange = useCallback((event, newValue) => {
    setSelectedOptions(newValue);
  }, []);

  useEffect(() => {
    modalState.data = {};
  }, []);

  useEffect(() => {
    setShopLocations(shopData.locations);
  },[shopData]);

  useEffect(() => {
    if (plan) {
      setSelectedPlan(plan.type);
      setSelectedOptions(locations.filter(location => plan.locations.includes(location._id)));
    }
  }, [plan]);

  useEffect(() => {
    modalState.data.plan = selectedPlan;
  }, [selectedPlan]);

  useEffect(() => {
    modalState.data.locations = _.map(selectedOptions, '_id');
  }, [selectedOptions]);

  return (
    <div className='flex flex-col gap-[14px] mt-6'>
      <Typography variant="subtitle2">
        You can reduce your platform fees by 1.5% by subscribing to our Pro Plan.
      </Typography>
      <div className="w-full flex flex-col my-2">
        <Typography variant="label1">Select the locations you'd like to upgrade to the Pro Plan using the dropdown.</Typography>
        <ChooseLocation
          options={shopLocations}
          selectedOptions={selectedOptions}
          listClassName={'line-clamp-1'}
          onSelectionChange={handleLocationSelectionChange}
        />
      </div>
      <FormControl component="fieldset">
        <RadioGroup name="use-radio-group" value={selectedPlan} onChange={onPlanSelect}>
          <div className="flex flex-col sm:flex-row justify-between gap-[12px]">
            <div
              className={`plan-button border rounded-[12px] px-[16px] py-[12px] flex flex-col w-full gap-[16px] cursor-pointer ${
                selectedPlan === 'monthly_plan' ? 'border-primary' : ''
              }`}
              onClick={() => handleDivClick('monthly_plan')}
            >
              <FormControlLabel
                value="monthly_plan"
                control={<Radio checked={selectedPlan === 'monthly_plan'} />}
                label={<Typography variant="h5">Monthly Pro Plan</Typography>}
                className="!m-0"
              />
              <div className="flex flex-col gap-4 pl-10 h-full justify-between">
                <div className="flex flex-col">
                  <Typography variant="h2">
                    ${selectedOptions.length ? (selectedOptions.length * 19.99).toFixed(2) : '19.99'} /month
                  </Typography>
                  <Typography variant="subtitle3" className="mt-2">
                    {selectedOptions.length
                      ? `For ${selectedOptions.length} location${selectedOptions.length > 1 ? 's' : ''}`
                      : 'No location'}
                  </Typography>
                </div>
                <Typography variant="label">
                  This plan effectively lowers your platform fees to 3% + $0.50 per order
                </Typography>
              </div>
            </div>

            <div
              className={`plan-button border rounded-[12px] px-[16px] py-[12px] flex flex-col w-full gap-[16px] cursor-pointer ${
                selectedPlan === 'annual_plan' ? 'border-primary' : ''
              }`}
              onClick={() => handleDivClick('annual_plan')}
            >
              <FormControlLabel
                value="annual_plan"
                control={<Radio checked={selectedPlan === 'annual_plan'} />}
                label={<Typography variant="h5">Annual Pro Plan</Typography>}
                className="!m-0"
              />
              <div className="flex flex-col gap-[16px] pl-[41px] h-full justify-between">
                <div className="flex flex-col">
                  <Typography variant="h2">
                    ${selectedOptions.length ? (selectedOptions.length * 180).toFixed(2) : '180'} /yearly
                  </Typography>
                  <Typography variant="subtitle3">$15 per month</Typography>
                  <Typography variant="subtitle3" className="mt-2">
                    {selectedOptions.length
                      ? `For ${selectedOptions.length} location${selectedOptions.length > 1 ? 's' : ''}`
                      : 'No location'}
                  </Typography>
                </div>
                <Typography variant="label">
                  This plan effectively lowers your Platform fees to 3% + .50 per order
                </Typography>
              </div>
            </div>
          </div>
        </RadioGroup>
      </FormControl>
    </div>
  );
}