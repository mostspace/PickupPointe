import React, {useEffect, useMemo} from "react";
import {useNavigate, useLocation, useParams} from "react-router-dom";
// @mui
import { Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, } from "@mui/material";
// Components
import DefaultButton from "src/components/button/default-button";
// Icons
import CircleIcon from "@mui/icons-material/Circle";
// Asset
import { icWarning, icPhone } from 'src/assets'
import MerchantOrderItem from "src/components/merchant-order-item/index.js";
import {useDispatch, useSelector} from "react-redux";
import {getOrderById, refundItem} from "src/reducers/merchant/orderSlice.js";
import {memoizedOrderName} from "src/utils/utilityFunctions.js";
import MerchantOutStockConfirmModal from "src/components/modal/merchant-out-stock/index.js";
import {toast} from "react-toastify";

// ---------------------------------------------------------------------------------------------

const Main = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const {orderDetail} = useSelector((state) => state.merchant.orders);
  const {orderId} = useParams();

  const { data, locationId } = location.state || {};
  const {item, quantity, selectedItems, variant} = data;

  useEffect(() => {
    if (orderId !== orderDetail?._id) {
      dispatch(getOrderById(orderId));
    }
  }, [orderId]);

  // Replace Modal
  const [openRefundItem, setOpenRefundItem] = React.useState(false);
  const handleRefundItemOpen = () => setOpenRefundItem(true);
  const handleRefundItemClose = () => setOpenRefundItem(false);
  const handleRefundItem = async () => {
    setOpenRefundItem(false)
    await dispatch(refundItem({orderId, itemId: item._id}));
    if (item.length <= 1) {
      toast(`You've refund this item successfully. Order has been deleted because of it's empty order.`, {type: 'success', className: 'toast-custom',});
      navigate("/merchant/all-orders")
    } else {
      dispatch(getOrderById(orderId));
      toast(`You've refund this item successfully.`, {type: 'success', className: 'toast-custom',});
      navigate(`/merchant/all-orders/order-details/${orderId}`);
    }
  }

  // Replace Item Modal
  const [openReplaceItem, setOpenReplaceItem] = React.useState(false);
  const handleReplaceItemOpen = () => setOpenReplaceItem(true);
  const handleReplaceItemClose = () => setOpenReplaceItem(false);

  const navigateReplaceItem = () => {
    setOpenReplaceItem(false);
    navigate(`/merchant/all-orders/order-details/${orderId}/out-of-stock/replace-item`, {state: {data, locationId}});
  }

  const getOrderName = useMemo(() => (ordererInfo) => memoizedOrderName(ordererInfo), []);

  return (
    <>
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-[24px]">
          <div className="flex flex-col gap-[12px] p-[32px]">
            <div className="flex justify-between items-center">
              <Typography variant="h5">
                {getOrderName(orderDetail?.ordererName)}. contacts:
              </Typography>
              <div className="flex items-center gap-[12px]">
                <img src={icPhone} className="w-[24px] h-[24px]" />
                <Typography variant="subtitle1">
                  {orderDetail.contacts?.contactNumber}
                </Typography>
              </div>
            </div>
            <Typography variant="subtitle3">Call the customer, ask them if they'd like to replace the item, refund the item, or cancel the entire order.</Typography>
          </div>
          <Divider />
          <div className="flex flex-col gap-[32px] p-[32px]">
            <MerchantOrderItem
              data={data}
              locationId={locationId}
              showPopOver={false}
            />
          </div>
        </div>

        <div className="border-t p-[32px] flex gap-[16px] justify-between items-center">
          <DefaultButton value="Refund" onClick={handleRefundItemOpen} className="w-full bg-[#F5F5F5] text-heading hover:bg-[#fef0f0]" />
          <DefaultButton value="Replace" onClick={handleReplaceItemOpen} className="w-full" />
        </div>
      </div>

      {/* Refund Modal */}
      <React.Fragment>
        <MerchantOutStockConfirmModal
          onClose={handleRefundItemClose}
          open={openRefundItem}
          onConfirm={handleRefundItem}
          okText={"Confirm"}
          cancelText={"Cancel"}
          title={"Refund this item"}
          content={"We'll automatically remove this item from all active orders, and refund them for each customer."}
        />

        <MerchantOutStockConfirmModal
          onClose={handleReplaceItemClose}
          open={openReplaceItem}
          onConfirm={navigateReplaceItem}
          okText={"Replace"}
          cancelText={"Cancel"}
          title={"Replace this item"}
          content={"Please choose an alternative of equal or lesser value. Be sure to confirm their special instructions still apply."}
        />


      </React.Fragment>
    </>
  );
};

export default Main;