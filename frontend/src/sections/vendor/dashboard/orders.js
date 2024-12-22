import React, {useState, useEffect, useCallback} from "react";
import {useNavigate} from "react-router-dom";
import dayjs from "dayjs";
import {ORDERS_AWAITING_DROPOFF} from "src/_mock/assets";
import {TIMEFRAME_OPTIONS} from "src/_mock/assets";
import {Select, FormControl, Button, MenuItem, Typography, Box} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import DropdownMenu from "src/components/dropdown-menu";
import {fetchDashboardData} from "../../../reducers/vendor/dashboardSlice.js";
import {useDispatch, useSelector} from "react-redux";
import LoadingProgress from "../../../components/loading-screen/loading-progress.js";

// ------------------------------------------------------------------------------------------------------------------------------------------

const OrderItem = ({order}) => {
  return (
    <div
      className="flex flex-col gap-[5px] px-[16px] py-[20px] border-b transition ease-in-out delay-10 hover:bg-hover">
      <Typography variant="subtitle2" className="font-semibold">{`${order.orderNumber}`}</Typography>
      <div className="flex flex-wrap gap-[8px] items-center">
        <Typography variant="text1">{order.uniqueItemCount} units</Typography>
        <CircleIcon className="text-[5px] text-normal"/>
        <Typography variant="text1">{dayjs(order.pickupDate).format('MMMM D, YYYY')}</Typography>
        <CircleIcon className="text-[5px] text-normal"/>
        <Typography variant="text1">{order.ordererName}.</Typography>
        <CircleIcon className="text-[5px] text-normal"/>
        <Typography variant="text1">{order.shopName}</Typography>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------------------------------------------------------------------------------

export default function Orders() {
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const {isLoading, recentOrders} = useSelector((state) => state.vendor.dashboard);

  const [sortBy, setSortBy] = useState('All');
  const [loading, setLoading] = useState(false);

  const handleSortBy = (event) => {
    setSortBy(event.target.value);
  };

  useEffect(() => {
    setLoading(true);
    dispatch(fetchDashboardData({type: "recentOrders", period: "3month", deliveryType: sortBy}));
  }, [sortBy]);

  useEffect(() => {
    if (!isLoading || Object.keys(recentOrders).length > 0) {
      setLoading(false);
    }
  }, [recentOrders]);

  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex justify-between sm:items-center">
        <Typography variant="h5" className="capitalize">Recent Orders</Typography>
        <FormControl>
          <Select
            labelId="demo-simple-select-label"
            size="small"
            value={sortBy}
            onChange={handleSortBy}
          >
            {ORDERS_AWAITING_DROPOFF.map(({label, value}) => (
              <MenuItem key={value} value={value} className="!text-[12px] sm:!text-[14px] !font-gilroy">
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className={`w-full ${loading ? "border rounded-[8px]" : ""}`} style={{minHeight: 450}}>
        {loading ? (
          <Box className="w-full h-full flex justify-center items-center relative">
            <LoadingProgress sx={{width: "70px"}}/>
          </Box>
        ) : (
          <div className="w-full flex flex-col border rounded-[8px]" style={{minHeight: 450}}>
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <OrderItem key={order._id} order={order}/>
              ))
            ) : (
              <Typography variant="subtitle3" className="text-center mt-5">No orders</Typography>
            )}
            {recentOrders.length > 0 && (<div className="flex justify-end items-center px-[16px] py-[10px]">
              <Button
                onClick={() => navigate('/vendor/manage-orders')}
                sx={{
                  padding: '8px 40px',
                  height: '44px',
                  fontFamily: 'Gilroy',
                  fontSize: '14px',
                  color: '#F14445',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  textTransform: 'unset',
                }}
              >
                See all
              </Button>
            </div>)}
          </div>
        )}
      </div>
    </div>
  );
}
