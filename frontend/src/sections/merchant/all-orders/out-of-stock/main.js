import React, {useEffect, useState} from "react";
import {useNavigate, useLocation, useParams} from "react-router-dom";
// @mui
import { Typography, FormControl, FormControlLabel, Radio, RadioGroup, } from "@mui/material";
// Components
import DefaultButton from "src/components/button/default-button";
import {getOrderById, makeItemOutOfStock} from "src/reducers/merchant/orderSlice.js";
import {useDispatch, useSelector} from "react-redux";
import MerchantOrderItem from "src/components/merchant-order-item/index.js";
import MerchantOutStockConfirmModal from "src/components/modal/merchant-out-stock";
import {toast} from "react-toastify";

// ---------------------------------------------------------------------------------------------


const outOfStockOptions = ['Until end of the day', 'Until end of the day tomorrow'];

// ---------------------------------------------------------------------------------------------

const Main = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { orderId } = useParams();

  const { data, locationId } = location.state || {};
  const {item, quantity, selectedItems, variant} = data;

  const {orderDetail} = useSelector((state) => state.merchant.orders);

  useEffect(() => {
    if (orderId !== orderDetail?._id) {
      dispatch(getOrderById(orderId));
    }
  }, [orderId]);

  const [selectedItem, setSelectedItem] = useState(0);
  const handleRadioChange = (event) => setSelectedItem(event.target.value);

  const [openReplaceItem, setOpenReplaceItem] = React.useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);

  const handleItemClick = (index) => {
    setSelectedItem(index)
  }

  const confirmOutOfStock = async () => {
    await dispatch(makeItemOutOfStock({itemId: item._id, untilDay: (selectedItem === 0 ? "Today" : "Tomorrow"), locationId}));
    toast(`You've marked this item as out of stock.`, {type: 'success', className: 'toast-custom'});
    setOpenReplaceItem(false);
    navigate(`/merchant/all-orders/order-details/${orderId}/adjust-order`, {state: {data, locationId}});
  }

  return (
    <>
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-[32px] p-[32px]">
          <MerchantOrderItem
            data={data}
            locationId={locationId}
            showPopOver={false}
          />
          <div className="flex flex-col gap-[16px]">
            <Typography variant="subtitle1">Out of stock</Typography>
            <FormControl className="w-full">
              <RadioGroup
                value={selectedItem}
                onChange={handleRadioChange}
                name="item-selection"
                sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
              >
                {outOfStockOptions.map((stock, index) => (
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
                        <Typography variant="subtitle2">{stock}</Typography>
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
          </div>
        </div>

        <div className="border-t p-[32px] flex gap-[16px] justify-between items-center">
          <DefaultButton value="Cancel" onClick={() => navigate(-1)} className="w-full bg-[#F5F5F5] text-heading hover:bg-[#fef0f0]" />
          <DefaultButton value="Confirm" onClick={() => setIsConfirmModalOpen(true)} className="w-full" />
        </div>
      </div>

      <React.Fragment>
        <MerchantOutStockConfirmModal
          onClose={() => setIsConfirmModalOpen(false)}
          open={isConfirmModalOpen}
          onConfirm={confirmOutOfStock}
          okText={"Adjust Order"}
          cancelText={"Cancel"}
          title={"Would you like to mark this item as out of stock?"}
          content={"If you mark this item as \"Out of Stock,\" customers won't be able to order it until the stock is replenished."}
        />
      </React.Fragment>
    </>
  );
};

export default Main;