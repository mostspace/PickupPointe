import React, {useEffect, useState} from "react";
import { useNavigate, useLocation } from "react-router-dom";
// @mui
import {Typography, FormControl, FormControlLabel, Radio, RadioGroup, IconButton, Box,} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
// Components
import DefaultButton from "src/components/button/default-button";
import OptionsItem from './options-item';
import {makeItemOutOfStock} from "src/reducers/merchant/orderSlice.js";
import {useDispatch} from "react-redux";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {setModifierOutOfStock} from "src/reducers/merchant/menuSlice.js";
import {toast} from "react-toastify";

// ---------------------------------------------------------------------------------------------

const Item = ({data: item, tab}) => (
  <Box
    className="flex p-[8px] justify-between items-center gap-[20px] self-stretch rounded-[8px]"
    sx={{
      boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.04)",
      border: "1px solid #00000010",
    }}
  >
    <div className="flex flex-1 gap-[16px] items-center">
      <div className="flex flex-col flex-grow">
        <div className="flex gap-[12px] items-center">
          {tab === 0 && (
            <img src={item.img} className="object-cover w-[64px] h-[64px] rounded-[5px]" alt={item.name}/>
          )}
          
          <div className="flex flex-wrap flex-grow justify-between items-center gap-[5px]">
            {tab === 1 && (
              <div className="flex flex-col items-start gap-[2px] pl-2">
                <div className="flex gap-[5px] items-center">
                  <Typography variant="h6" className="font-gilroyMedium">{item.name}</Typography>
                </div>
                <div className="flex gap-[5px] items-center">
                  <Typography variant="subtitle3">{item?.modifier.length} options</Typography>
                  <CircleIcon className="text-[3px] text-heading" />
                  <Typography variant="subtitle3">Added to {item?.count} items</Typography>
                </div>
              </div>
            )}

            {tab === 0 && (
              <Typography variant="h6" className="font-gilroyMedium text-[14px] sm:text-[16px]">
                ${item.price}
              </Typography>
            )}
          </div>
        </div>
      </div>
    </div>
  </Box>
);

const data = ['Until end of the day', 'Until end of the day tomorrow', 'Forever ( I no longer carry this item)'];

// ---------------------------------------------------------------------------------------------

const ManageItemOutOfStock = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();
  const { item, tab } = location.state || {};
  console.log(item, tab);
  const [selectedItem, setSelectedItem] = useState('Until end of the day');
  const [selectedOptionsItem, setselectedOptionsItem] = useState(new Set());
  
  useEffect(() => {
    item.modifier?.forEach(modifier => {
      if (!modifier.isInStock) {
        handleOptionsItemClick(modifier.id)
      }
    })
  }, [item]);
  const handleItemClick = (stock) => setSelectedItem(stock);
  const handleRadioChange = (event) => setSelectedItem(event.target.value);
  const handleOptionsItemClick = (id) => {
    setselectedOptionsItem((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  const confirmOutStock = async () => {
    const untilDay = selectedItem === "Until end of the day" ? "Today" : selectedItem === 'Until end of the day tomorrow' ? "Tomorrow" : "Forever";
    if (tab === 0) {
      await dispatch(makeItemOutOfStock({itemId: item.id, untilDay}));
    } else {
      await dispatch (setModifierOutOfStock({items: Array.from(selectedOptionsItem), groupId: item._id}));
    }
    toast("You've marked this item out of stock.", {type: 'success', className: 'toast-custom'});
    navigate('/merchant/manage-items', {state: {tab}})
  }

  return (
    <>
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-[32px] p-[15px] sm:p-[32px]">
          {tab === 0 ? (
            <>
              <Item data={item} tab={tab}/>
              <div className="flex flex-col gap-[16px]">
                <Typography variant="subtitle1">Out of stock</Typography>
                <FormControl className="w-full">
                  <RadioGroup
                    value={selectedItem}
                    onChange={handleRadioChange}
                    name="item-selection"
                    sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                  >
                    {data.map((stock, index) => (
                      <div
                        key={index}
                        className={`modifier-item w-full border rounded-[8px] px-[16px] py-[12px] cursor-pointer ${selectedItem === stock ? 'border-primary' : 'border-gray-300'}`}
                        onClick={() => handleItemClick(stock)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-[8px]">
                            <FormControlLabel
                              value={stock}
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
                            <Typography variant="subtitle2">{stock}</Typography>
                          </div>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              </div>
            </>
          ) : (
            <>
              <Item data={item} tab={tab}/>
              <div className="flex flex-col gap-[16px] px-2">
                <Typography variant="subtitle1">Mark options as unavailable</Typography>
                <div className="flex flex-col gap-[14px]">
                  {item.modifier.map((option) => (
                    <OptionsItem
                      key={option.id}
                      img={option.img}
                      name={option.name}
                      isSelected={selectedOptionsItem.has(option.id)}
                      onClick={() => handleOptionsItemClick(option.id)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="border-t p-[32px] flex gap-[16px] justify-between items-center">
          <DefaultButton value="Cancel" onClick={() => navigate('/merchant/manage-items', { state: { tab } })} className="w-full bg-[#F5F5F5] text-heading hover:bg-[#fef0f0]" />
          <DefaultButton className="w-full"
            value={`${tab === 0 ? 'Confirm' : 'Update'}`}
            onClick={confirmOutStock}
            /*onClick={() => navigate('/merchant/manage-items', {
              state: tab === 0 
                ? { confirmed: selectedItem, item_id: item.id }
                : { tab: tab, option_id: Array.from(selectedOptionsItem) }
            })}*/
          />
        </div>
      </div>
    </>
  );
};

export default ManageItemOutOfStock;