import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
// @mui
import { Typography, TextField, FormControl, InputAdornment, Divider, Box } from "@mui/material";
// Components
import Iconify from "src/components/iconify/iconify";
import {useDispatch, useSelector} from "react-redux";
import {getOrderById, getReplaceableItems} from "src/reducers/merchant/orderSlice.js";
import MerchantOrderItem from "src/components/merchant-order-item/index.js";


// ---------------------------------------------------------------------------------------------

const Main = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const {orderId} = useParams();
  const {orderDetail, isLoading, replaceableItems} = useSelector((state) => state.merchant.orders);

  const { data, locationId } = location.state || {};
  const {item, quantity, selectedItems, variant} = data;
  
  const [searchKeyword, setSearchKeyword] = useState("")

  useEffect(() => {
    if (orderId !== orderDetail?._id) {
      dispatch(getOrderById(orderId));
    }
    dispatch(getReplaceableItems(item.categories));
  }, [orderId, item]);

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-col gap-[32px] p-[32px] pb-[16px]">
          <MerchantOrderItem
            data={data}
            locationId={locationId}
            showPopOver={false}
          />
        </div>

        <Divider className="my-[16px]" />

        <div className="flex flex-col gap-[32px] p-[32px] pt-[16px]">
          <div className="flex flex-col gap-[16px]">
            <Typography variant="subtitle1">Replace with</Typography>
            <FormControl variant="standard" className="sm:min-w-[340px] flex">
              <TextField
                className="w-full"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search by item name..."
                InputLabelProps={{ shrink: true }}
                InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Iconify icon="eva:search-outline" className="text-[#A3A3A3]"/>
                  </InputAdornment>
                ),
                }}
              />
            </FormControl>
          </div>

          <div className="flex flex-col gap-[16px]">
            {replaceableItems
              .filter((replaceableItem) => searchKeyword ? replaceableItem.name.toLowerCase().includes(searchKeyword.toLowerCase()) : true)
              .map((replaceableItem, index) => replaceableItem._id !== item._id && (
              <Box
                key={index}
                onClick={() => navigate(`/merchant/all-orders/order-details/${orderId}/out-of-stock/customize`, {state: {data: item, replaceableItem, itemQuantity: quantity}})}
                className="flex items-start justify-between gap-[16px] sm:gap-[32px] p-[10px] rounded-[12px] hover:bg-secondary duration-200 cursor-pointer"
                sx={{boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.04)", border: "1px solid #00000010"}}
              >
                <div className="w-full flex flex-col gap-[10px]">
                  <div className="w-full flex justify-between items-start xx:items-center gap-[12px]">
                    <img src={replaceableItem.photo} className="object-cover w-[64px] h-[64px] rounded-[5px]" alt={replaceableItem.name} />
                    <div className="w-full flex flex-col xx:flex-row gap-[5px] xx:justify-between xx:items-center">
                      <div className="w-full flex flex-col justify-between xs:gap-[5px]">
                        <div className="flex gap-[5px] items-center">
                          <Typography variant="h6" className="text-[14px] ss:text-[18px] leading-[18px] font-gilroyMedium">
                            {replaceableItem.name}
                          </Typography>
                        </div>
                        <div className="flex gap-[5px] items-center">
                          <Typography variant="subtitle3">
                            <span className="capitalize">{replaceableItem.category}</span>
                          </Typography>
                        </div>
                      </div>
                      
                      <div className="flex gap-[5px] items-center">
                        <Typography variant="h6" className="text-[14px] ss:text-[18px] font-gilroyMedium">
                          ${replaceableItem.defaultPrice}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
              </Box>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;