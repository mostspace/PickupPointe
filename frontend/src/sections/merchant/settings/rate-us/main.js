import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
// @mui
import { Typography, FormControl, FormControlLabel, Radio, RadioGroup, Rating, } from "@mui/material";
// Components
import DefaultButton from "src/components/button/default-button";
import {setSettings} from "src/reducers/merchant/settingSlice.js";
import {useDispatch, useSelector} from "react-redux";

const options = ['Unsatisfactory', 'Needs Improvement', 'Fair', 'Very Good', 'Outstanding'];

const Main = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {settings, isLoading} = useSelector(state => state.merchant.setting);
  
  useEffect(() => {
    if (!settings.ratePickup) {
      return navigate('/merchant/settings');
    }
  }, [settings]);
  const [selectedItem, setSelectedItem] = useState(parseInt(settings.ratePickup) - 1);
  const [ratingValue, setRatingValue] = useState(settings.ratePickup);

  const handleItemClick = (id, rating) => {
    setSelectedItem(id);
    setRatingValue(rating);
  };

  const handleRadioChange = (event) => {
    const selectedId = parseInt(event.target.value);
    setSelectedItem(selectedId);
    setRatingValue(selectedId + 1);
  };
  
  const confirmRate = () => {
    dispatch(setSettings({key: "ratePickup", value: ratingValue}));
    navigate('/merchant/settings');
  }

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-col gap-[16px] p-[15px] sm:p-[32px]">
        <Typography variant="subtitle1" className="font-gilroyMedium">Rate</Typography>
        <FormControl className="w-full">
          <RadioGroup
            value={selectedItem}
            onChange={handleRadioChange}
            name="item-selection"
            sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {options.map((stock, index) => (
              <div
                key={index}
                className={`modifier-item w-full border rounded-[8px] px-[16px] py-[12px] cursor-pointer ${selectedItem === index ? 'border-primary' : 'border-gray-300'}`}
                onClick={() => handleItemClick(index, index + 1)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-[8px]">
                    <FormControlLabel
                      value={index}
                      control={<Radio size="small"
                        sx={{
                          color: '#A3A3A3',
                          '&.Mui-checked': {
                            color: '#F14445',
                          },
                          margin: '0',
                          padding: '2px'
                        }}
                      />}
                      sx={{ margin: '0' }}
                      label=""
                    />
                    <Typography variant="subtitle2">{stock}</Typography>
                  </div>
                  <Rating
                    name={`rating-${index}`}
                    value={selectedItem === index ? ratingValue : index + 1}
                    readOnly={true}
                    sx={{
                      color: selectedItem === index ? '#F14445' : '#A3A3A3'
                    }}
                  />
                </div>
              </div>
            ))}
          </RadioGroup>
        </FormControl>
      </div>

      <div className="border-t p-[32px] flex justify-center items-center">
        <DefaultButton value="Confirm" onClick={confirmRate} className="w-full" />
      </div>
    </div>
  );
};

export default Main;