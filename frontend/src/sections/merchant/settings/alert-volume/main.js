import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
// @mui
import { Typography, FormControl, FormControlLabel, Radio, RadioGroup, } from "@mui/material";
// Components
import DefaultButton from "src/components/button/default-button";
import {useDispatch, useSelector} from "react-redux";
import {setSettings} from "src/reducers/merchant/settingSlice.js";

const Main = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState(2);
  const {settings} = useSelector(state => state.merchant.setting);
  
  useEffect(() => {
    if (!settings.volume) {
      return navigate('/merchant/settings');
    }
    setSelectedItem(settings.volume === "loud" ? 2 : settings.volume === "no-sound" ? 0 : 1);
  }, [settings]);
  
  const saveVolume = () => {
    dispatch(setSettings({key: "volume", value: (selectedItem === 2 ? "loud" : selectedItem === 0 ? "no-sound" : "vibration")}));
    navigate('/merchant/settings');
  }
  
  const handleItemClick = (id) => setSelectedItem(id);
  const handleRadioChange = (event) => setSelectedItem(event.target.value);
  
  
  return (
    <>
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-[16px] p-[15px] sm:p-[32px]">
          <Typography variant="subtitle1" className="font-gilroyMedium">Volume</Typography>
          <FormControl className="w-full">
            <RadioGroup
              value={selectedItem}
              onChange={handleRadioChange}
              name="item-selection"
              sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              {['No sound', 'Vibration', 'Loud'].map((setting, index) => (
                <div
                  key={index}
                  className={`modifier-item w-full border rounded-[8px] px-[16px] py-[12px] cursor-pointer ${selectedItem === index ? 'border-primary' : 'border-gray-300'}`}
                  onClick={() => handleItemClick(index)}
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
                        sx={{margin: '0'}}
                        label=""
                      />
                      <Typography variant="subtitle2">{setting}</Typography>
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
        </div>

        <div className="border-t p-[32px] flex justify-center items-center">
          <DefaultButton value="Save changes" onClick={saveVolume} className="w-full" />
        </div>
      </div>
    </>
  );
};

export default Main;