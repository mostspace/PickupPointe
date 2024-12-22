import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getOrders} from "src/reducers/merchant/orderSlice.js";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import TabPanel from "src/components/tab";
import LoadingProgress from "src/components/loading-screen/loading-progress.js";
import Pagination from "src/components/pagination/index.js";
import OrderListItem from "src/components/merchant/order-list-item";
import {tabProps} from "src/utils/tab-helpers";

// ==================================================================================================

const Main = () => {
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    status: "Submitted"
  })
  const {orderList, isLoading} = useSelector(state => state.merchant.orders);
  const orderCount = orderList?.totalCount || 0;

  useEffect(() => {
    dispatch(getOrders(pagination))
  }, [pagination]);

  const onPageChange = (event, page) => {
    setPagination(prevState => {
      return {...prevState, page};
    });
  }

  const handleTabChange = (event, newValue) => {
    setPagination(prevState => ({
      ...prevState,
      page: 1,
      status: newValue === 0 ? "Submitted" : newValue === 1 ? "Pending" : "Completed"
    }))
    setTabValue(newValue)
  }

  return (
    <div id="tabs" className="flex flex-col gap-[24px] sm:gap-[32px]">
      <Box sx={{borderBottom: 1, borderColor: "divider"}}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="All orders">
          {[
            {label: "New orders", index: 0},
            {label: "In progress", index: 1},
            {label: "Completed today", index: 2},
          ].map(({label, index}) => (
            <Tab
              key={index}
              label={
                <div className="flex items-center gap-[8px]">
                  <Typography
                    variant={tabValue === index ? "subtitle2 font-gilroyMedium" : "subtitle3"}>{label}</Typography>
                  {tabValue === index && <CircleIcon className="text-[6px] text-primary"/>}
                </div>
              }
              {...tabProps(index)}
              className="w-[33%] !font-gilroyMedium !text-[14px] !text-heading !normal-case items-baseline pl-1"
            />
          ))}
        </Tabs>
      </Box>

      <div id="tab-panel" className="flex-1">
        {isLoading ? (
          <div className="w-full h-[calc(100vh-500px)] flex justify-center items-center relative">
            <LoadingProgress sx={{width: '50px', marginTop: '150px'}}/>
          </div>
        ) : (
          <TabPanel value={tabValue} index={tabValue}>

            <div className="flex justify-between mb-[14px]">
              <Typography variant="subtitle3">{["New orders", "In progress orders", "Completed orders"][tabValue]}</Typography>
              {orderCount > 0 && (
                <Typography variant="subtitle2">
                  {orderCount} {orderCount === 1 ? "Order" : "Orders"}
                </Typography>
              )}
            </div>
            <div className="flex flex-col gap-[14px] font-gilroy">
              {orderList?.result?.length > 0 ? (
                orderList?.result?.map(order => <OrderListItem key={order._id} order={order}/>)
              ) : (
                <div className="w-full h-full flex justify-center items-center mt-[20vh]">
                  <Typography variant="subtitle3">There are no active orders yet</Typography>
                </div>
              )}
            </div>
            {orderList?.result?.length > 0 && (
              <div className="w-full flex justify-center items-center relative mt-5">
                <Pagination count={orderList?.totalCount} page={orderList?.page} handleChange={onPageChange} itemsPerPage={10} />
              </div>
            )}
          </TabPanel>
        )}
      </div>
    </div>
  );
};

export default Main;