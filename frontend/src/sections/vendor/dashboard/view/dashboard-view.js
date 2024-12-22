import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/material";
import Income from "../income";
import GeneralProfit from "../general-profit";
import Overview from "../overview";
import Orders from "../orders";
import LoadingProgress from "src/components/loading-screen/loading-progress";
import { fetchDashboardData } from "src/reducers/vendor/dashboardSlice";

const DashboardView = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.vendor.dashboard);
  const [filter, setFilter] = useState({type: "all", period: "week"});

/*  useEffect(() => {
    dispatch(fetchDashboardData(filter));
  }, [filter]);*/

  // const getDashboardDataByFilter = (type, period) => {
  //   dispatch(fetchDashboardData({ type, period }));
  // }

  const onFilterChange = (type, period) => {
    console.log(type, period)
    setFilter({type, period});
  }

  /*if (isLoading) {
    return (
      <Box className="w-full h-full flex justify-center items-center relative">
        <LoadingProgress sx={{ width: "70px" }} />
      </Box>
    );
  }*/

  return (
    <React.Fragment>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-[32px] relative">
        <div className="w-full flex flex-col gap-[32px]">
          <Income />
          <GeneralProfit />
        </div>

        <div className="w-full flex flex-col gap-[32px]">
          <Overview />
          <Orders />
        </div>
      </div>
    </React.Fragment>
  );
};

export default DashboardView;