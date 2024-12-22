import React, { useState } from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
// @mui
import { Typography, TextField, FormControl, Divider, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, } from "@mui/material";
// Components
import DefaultButton from "src/components/button/default-button";
// Icons
import CircleIcon from "@mui/icons-material/Circle";
// Asset
import { icSwap, icWarning } from 'src/assets'
import IncrementerButton from "src/components/incrementer-button";
import {getReplaceableItems, replaceItem} from "src/reducers/merchant/orderSlice.js";
import {useDispatch} from "react-redux";

// ---------------------------------------------------------------------------------------------

const Item = ({ data, swap, quantity }) => (
  <div className={`flex px-[16px] py-[12px] justify-between items-center gap-12px self-stretch rounded-[12px] border border-[rgba(0, 0, 0, 0.08)] ${swap ? '' : 'opacity-70'}`}>
    <div className="flex flex-1 gap-[16px] items-center">
      <div className="w-[64px] h-[64px] overflow-hidden rounded-[6px] flex items-center justify-center">
        <img src={data?.photo} className="object-cover w-full h-full" loading="lazy"/>
      </div>
      <div className="flex flex-col flex-grow gap-[12px]">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
          <div className="flex flex-col items-start gap-[2px]">
            <div className="flex gap-[5px] items-center">
              <Typography variant="h6">{data?.name}</Typography>
            </div>
            <div className="flex gap-[5px] items-center">
              <Typography variant="subtitle3">{data?.category}</Typography>
            </div>
          </div>
          <div className="flex items-center gap-[32px]">
            <div className="flex gap-[5px] items-center">
              <Typography variant="h6">{quantity}x</Typography>
              <CircleIcon className="text-[3px] text-heading" />
              <Typography variant="h6" className={swap ? 'text-success': 'text-heading'}>{data?.defaultPrice}</Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const order = {
  id: "#1001",
  name: "Steve H.",
  items: 3,
  date: "Pickup at 5:50 PM, Today",
  status: "New",
};

// ---------------------------------------------------------------------------------------------

const Main = () => {

  const navigate = useNavigate();

  const location = useLocation();
  const dispatch = useDispatch();
  const {orderId} = useParams();
  const { data, replaceableItem } = location.state || {};

  const [quantity, setQuantity] = useState(data?.quantity || 1);
  // Function to handle quantity decrease
  const handleDecrease = () => setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 0));
  // Function to handle quantity increase
  const handleIncrease = () => setQuantity((prevQuantity) => Math.min(prevQuantity + 1, 100));

  // Replace Item Modal
  const [openReplaceItem, setOpenReplaceItem] = React.useState(false);
  const handleReplaceItemOpen = () => setOpenReplaceItem(true);
  const handleReplaceItemClose = () => setOpenReplaceItem(false);

  const handleReplaceItem = async () => {
    const originalItem = data?._id;
    const replacedItem = replaceableItem?._id;
    await dispatch(replaceItem({originalItem, replacedItem, quantity, orderId}));
    navigate(`/merchant/all-orders/order-details/${orderId}?refresh=true`, { state: {order}})
  };

  return (
    <>
      <div className="flex flex-col h-full justify-between">
        <div className="flex flex-col h-full">
          <div className="flex flex-col gap-[12px] p-[32px]">
            <Item data={data} quantity={quantity}/>
            <div className="w-full flex justify-center">
              <img src={icSwap} className="w-[24px] my-1"/>
            </div>
            <Item data={replaceableItem} swap={true} quantity={quantity}/>
          </div>

          <Divider className="my-[16px]" />

          <div className="flex justify-center items-center p-[32px]">
            <div className="w-full flex justify-between items-center">
              <Typography variant="subtitle1" className="font-gilroyMedium">Quantity</Typography>
              <IncrementerButton
                quantity={quantity}
                onDecrease={handleDecrease}
                onIncrease={handleIncrease}
                disabledDecrease={quantity === 0}
                disabledIncrease={quantity >= 100}
              />
            </div>
          </div>

          <Divider className="my-[16px]" />

          <div className="w-full p-[32px] flex flex-col gap-[12px]">
            <Typography variant="subtitle1" className="font-gilroyMedium">Special instructions (optional)</Typography>
            <FormControl variant="standard" className="sm:min-w-[340px] flex">
              <TextField className="w-full"
                placeholder="Enter special instructions"
                type="text"
                size="small"
                multiline
                rows={3}
              />
            </FormControl>
          </div>
        </div>

        <div className="border-t p-[32px]">
          <DefaultButton value="Submit replacement" onClick={handleReplaceItemOpen} className="w-full" />
        </div>
      </div>

      <React.Fragment>
        <Dialog className="w-full"
          open={openReplaceItem}
          onClose={handleReplaceItemClose}
          scroll="paper"
          sx={{
            width: "100% !important",
          }}
        >
          <DialogTitle className='pt-[32px]'>
            <div className="flex flex-col gap-[12px]">
              <Typography variant="h2">Replace item</Typography>
            </div>
          </DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText
              id="scroll-dialog-description"
              tabIndex={-1}
            >
              <div className='flex flex-col gap-[14px] font-gilroy py-[12px]'>
                <div className="flex flex-col gap-[12px]">
                  <Item data={data} quantity={quantity}/>
                  <div className="w-full flex justify-center">
                    <img src={icSwap} className="w-[24px] my-1" />
                  </div>
                  <Item data={replaceableItem} swap={true} quantity={quantity}/>
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions className="!px-[22px] !py-[32px] !gap-[14px] border-t">
            <DefaultButton value="Cancel" onClick={handleReplaceItemClose} className="w-full bg-[#F5F5F5] text-heading hover:bg-[#fef0f0]" />
            <DefaultButton value="Confirm" onClick={handleReplaceItem} className="w-full" />
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </>
  );
};

export default Main;