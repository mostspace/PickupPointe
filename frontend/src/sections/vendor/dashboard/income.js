import React, {useEffect, useState} from "react";
import {Select, FormControl, MenuItem, Typography, Box} from "@mui/material";
import {TIMEFRAME_OPTIONS} from "src/_mock/assets";
import ApexChart from "src/components/apex-chart";
import {useDispatch, useSelector} from "react-redux";
import {fetchDashboardData} from "../../../reducers/vendor/dashboardSlice.js";
import LoadingProgress from "../../../components/loading-screen/loading-progress.js";

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const WEEKDAYS_SHORT = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export default function Income() {
  const dispatch = useDispatch()
  const [timeframe, setTimeframe] = useState(2);
  const timeFrameData = ["", "today", "week", "last_week", "3month", "6month"];
  const {incomeInfo} = useSelector((state) => state.vendor.dashboard);
  const [loading, setLoading] = useState(false);

  const [aggregatedData, setAggregatedData] = useState({
    xais: WEEKDAYS_SHORT,
    cost: Array(7).fill(0),
    income: Array(7).fill(0),
  });


  useEffect(() => {
    setLoading(true);
    dispatch(fetchDashboardData({type: "income", period: timeFrameData[timeframe]}));
  }, [timeframe]);


  useEffect(() => {
    // if (Object.keys(incomeInfo).length === 0) return

    setLoading(false);

    let xais = [];
    let cost = [];
    let income = [];

    if (timeframe === 2 || timeframe === 3) { // This Week
      xais = WEEKDAYS_SHORT;
      cost = WEEKDAYS.map(day => incomeInfo[day]?.subTotalIncome || 0);
      income = WEEKDAYS.map(day => incomeInfo[day]?.totalIncome || 0);
    } else { // Monthly data (3 or 6 months)
      const currentDate = new Date();
      const monthsToShow = timeframe === 4 ? 3 : 6; // 4 for 3 months, 5 for 6 months

      // Generate array of last n months
      const months = Array.from({length: monthsToShow}, (_, i) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        return date.toLocaleString('default', {month: 'short', year: 'numeric'});
      }).reverse();

      xais = months.map(month => month.split(' ')[0]); // Only show month abbreviation in chart

      // Fill data with zeros for missing months
      console.log(months);
      cost = months.map(month => incomeInfo[month]?.subTotalIncome || 0);
      income = months.map(month => incomeInfo[month]?.totalIncome || 0);
    }

    setAggregatedData({xais, cost, income});
  }, [incomeInfo]);

  const handleTimeframeChange = (event) => {
    setTimeframe(event.target.value);
  };

  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex justify-between items-center">
        <Typography variant="h5" className="capitalize">Income</Typography>
        <div className="flex items-center gap-[32px] mt-3 sm:mt-0">
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
      </div>
      <div className="py-[2px] border rounded-[8px] overflow-x-auto" style={{minHeight: 250}}>
        {loading ? (
          <Box className="w-full h-full flex justify-center items-center relative">
            <LoadingProgress sx={{width: "70px"}}/>
          </Box>
        ) : (
          <div style={{minWidth: `${aggregatedData.xais.length * 60}px`}}>
            <ApexChart
              cost={aggregatedData.cost}
              income={aggregatedData.income}
              xais={aggregatedData.xais}
            />
          </div>
        )}
      </div>
    </div>
  );
}