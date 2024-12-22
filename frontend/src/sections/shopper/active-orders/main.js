import React, { useEffect } from "react";
// Components
import OrderCard from './order-card';
// @mui
import { Typography, } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "src/reducers/orderSlice";
import ButtonLoader from "src/components/button-loader/ButtonLoader";
import { getLocationAddress } from "src/components/choose-location-select";

import dayjs from "dayjs";
import {getActiveOrders} from "src/reducers/shopper/orderSlice.js";

// --------------------------------------------------------------------------------------------------

const Main = () => {
  const dispatch = useDispatch();

  // const orderStore = useSelector((state) => state.order);
  // const {isLoading, orderList} = orderStore;
  const {isLoading, activeOrders: orderData} = useSelector(state => state.shopper.orders)

  console.log(orderData)
  useEffect(() => {
    dispatch(getActiveOrders());
  }, [])

  const createData = (data) => {
    return data.map((element, index) => {
      return {
        id: element._id,
        ready_time: '2hours',
        status: 'Your order is being prepared',
        store_logo: element.shopInfo.logo,
        store_name: element.shopInfo.name,
        store_tag: ""/*element.shopId.categories.map(category => category.category).join(", ")*/,
        pickup_date: dayjs(element.time.pickupDate).format('dddd, MMMM D, YYYY'),
        pickup_time_frame: `${dayjs(element.time.pickupTime).format('h A')} - ${dayjs(element.time.pickupTime).add(2, 'hour').format('h A')}`,
        delivery: 'Courier delivery',
        deliveryType: element.deliveryType,
        delivery_status: false,
        auto_pay: '-',
        modifierItemsInfo: element.modifierItemsInfo,
        dropoff_location: element.locationInfo ? getLocationAddress(element.locationInfo) : element.orderLocation,
        products: element.package.map(pack => {
          return {
            img: pack.photo,
            name: pack.name,
            quantity: pack.quantity,
            price: pack.defaultPrice,
            modifiers: pack.selectedItems,
            variant: pack.variant,
            tags: []/*pack.categories.map(category => category.category)*/,
          }
        }),
        products_price: Number(element.subTotal).toFixed(2),
        delivery_charges: element.fee.deliveryFee,
        processing_fees: element.fee.processingFee,
        discount_code: '-',
        total_amount: Number(element.total).toFixed(2),
        stage: [
          {
            name: 'The kitchen has received your order',
            date: 'May 13, 2019, 4:30PM'
          },
          {
            name: 'Your order is being prepared',
            date: 'May 13, 2019, 6:00PM'
          }
        ],
      }
    });
  }

  const renderOrders = () => {
    if (isLoading) return <div className="flex h-full justify-center"><ButtonLoader /></div>;
    if (orderData?.length > 0) {
      return createData(orderData).map((order) => (
        <OrderCard key={order.id} order={order} />
      ));
    }
    return <Typography variant="subtitle3" className="text-center my-5">No active orders</Typography>;
  };

  return (
    <div className="flex flex-col gap-[20px]">
      <Typography variant="h5">Active Orders</Typography>
      {renderOrders()}
    </div>
  )
}

export default Main;