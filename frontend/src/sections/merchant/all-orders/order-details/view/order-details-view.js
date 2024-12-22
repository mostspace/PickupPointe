import React, {useEffect, useState} from 'react'
import {useLocation, useParams} from 'react-router-dom'

import Main from '../main';
import Header from '../header';
import {getOrderById} from "src/reducers/merchant/orderSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {useSearchParams} from "src/routes/hooks/index.js";

export default function OrderDetailsView() {
  const dispatch = useDispatch();
  const { orderId } = useParams();
  const searchParams = useSearchParams();
  const refresh = searchParams.get("refresh");

  const {orderDetail} = useSelector((state) => state.merchant.orders);

  useEffect(() => {
    if (orderId !== orderDetail?._id || !!refresh) {
      dispatch(getOrderById(orderId));
    }
  }, [orderId]);

  return (
    <>
      <Header />

      <div className="flex-1 bg-white rounded-[16px]">
        <Main />
      </div>
    </>
  );
}