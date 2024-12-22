import React, {useEffect, useState} from "react";
import {Box, MenuItem, Select, Typography} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import {TIMEFRAME_OPTIONS} from "../../../_mock/assets.js";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {fetchDashboardData} from "../../../reducers/vendor/dashboardSlice.js";
import {useDispatch, useSelector} from "react-redux";
import LoadingProgress from "../../../components/loading-screen/loading-progress.js";

const DashboardCard = ({title, value, icon, percentage, percentageClass, showPercentage = false}) => (
  <div
    className="w-full flex flex-col px-[14px] sm:px-[24px] py-[16px] gap-[30px] justify-between border-r transition ease-in-out delay-10 hover:bg-hover">
    <Typography variant="subtitle3">{title}</Typography>
    <div className="flex flex-wrap justify-between items-end">
      <Typography variant="h4">{value}</Typography>
      {showPercentage && (
        <div className="flex items-center">
          {icon && React.cloneElement(icon, {className: `text-[20px] ${percentageClass}`})}
          <Typography variant="label" className={percentageClass}>
            {percentage}
          </Typography>
        </div>
      )}
    </div>
  </div>
);

const Overview = () => {
  const dispatch = useDispatch();
  const [timeframe, setTimeframe] = useState(2);
  const [loading, setLoading] = useState(true);

  const { overviewInfo } = useSelector((state) => state.vendor.dashboard);

  const timeFrameData = ["", "today", "week", "last_week", "3month", "6month"];

  useEffect(() => {
    setLoading(true);
    dispatch(fetchDashboardData({type: "overview", period: timeFrameData[timeframe]}));
  }, [timeframe]);

  useEffect(() => {
    if (Object.keys(overviewInfo).length > 0) {
      setLoading(false);
    }
  }, [overviewInfo]);

  const handleTimeframeChange = (event) => {
    setTimeframe(event.target.value);
  };

  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex justify-between items-center">
        <Typography variant="h5" className="capitalize">Overview</Typography>
        <FormControl>
          <Select
            labelId="timeframe-select-label"
            size="small"
            value={timeframe}
            onChange={handleTimeframeChange}
          >
            {TIMEFRAME_OPTIONS.slice(1, 5).map(({label, value}) => (
              <MenuItem key={value} value={value} className="!text-[12px] sm:!text-[14px] !font-gilroy">
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="w-full border rounded-[8px]" style={{minHeight: 243}}>
        {loading ? (
          <Box className="w-full h-full flex justify-center items-center relative">
            <LoadingProgress sx={{ width: "70px" }} />
          </Box>
        ) : (
          <React.Fragment>
            <div className="grid grid-cols-3">
              <DashboardCard title="Total Orders" value={overviewInfo?.totalOrders || 0}/>
              <DashboardCard title="Orders Completed" value={overviewInfo?.completedOrders || 0}/>
              <DashboardCard title="Orders In Progress" value={overviewInfo?.pendingOrders || 0}/>
            </div>
            <div className="grid grid-cols-2 border-t">
              <DashboardCard
                title="Total Income"
                value={`$${overviewInfo?.totalIncome?.toFixed(2) || 0}`}
                icon={<ArrowDropDownIcon/>}
                // percentage={`${((aggregatedData.totalIncome / 1000) * 100).toFixed(2)}%`}
                percentage={'0%'}
                percentageClass="text-primary"
                showPercentage
              />
              <DashboardCard
                title="Total Cost"
                value={`$${overviewInfo?.subTotalIncome?.toFixed(2) || 0}`}
                icon={<ArrowDropDownIcon/>}
                // percentage={`${((aggregatedData.totalCost / 1000) * 100).toFixed(2)}%`}
                percentage={'0%'}
                percentageClass="text-success"
                showPercentage
              />
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default Overview