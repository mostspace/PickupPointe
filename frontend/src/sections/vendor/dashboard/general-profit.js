import React, {useState, useEffect} from "react";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
  Table,
  Paper,
  Select,
  FormControl,
  TableHead,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Typography,
  Box
} from '@mui/material';
import {TIMEFRAME_OPTIONS} from "src/_mock/assets";
import {StyledTableContainer} from "src/utils/table-helpers";
import {useDispatch, useSelector} from "react-redux";
import {fetchDashboardData} from "../../../reducers/vendor/dashboardSlice.js";
import LoadingProgress from "../../../components/loading-screen/loading-progress.js";

// ------------------------------------------------------------------------------------------------------------------------------------------

const aggregateSales = (orders) => {
  const aggregatedData = {};

  orders.forEach((order) => {
    order.package.forEach((pack) => {
      const itemPhoto = pack.item.photo;
      const price = pack.item.defaultPrice;
      const itemName = pack.item.name;
      const quantity = pack.quantity;

      if (!aggregatedData[itemName]) {
        aggregatedData[itemName] = {
          name: itemName,
          photo: itemPhoto,
          units: 0,
          price: 0,
        };
      }

      aggregatedData[itemName].units += quantity;
      aggregatedData[itemName].price += quantity * price;
    });
  });

  return Object.values(aggregatedData).sort((a, b) => b.units - a.units);
};

// ------------------------------------------------------------------------------------------------------------------------------------------

export default function GeneralProfit() {
  const dispatch = useDispatch();
  const [timeframe, setTimeframe] = useState(2);
  const [loading, setLoading] = useState(false);

  const {generalProfit} = useSelector((state) => state.vendor.dashboard);

  const timeFrameData = ["", "today", "week", "last_week", "3month", "6month"];

  useEffect(() => {
    setLoading(true);
    dispatch(fetchDashboardData({type: "generalProfit", period: timeFrameData[timeframe]}));
  }, [timeframe]);

  useEffect(() => {
    if (Object.keys(generalProfit).length > 0) {
      setLoading(false);
    }
  }, [generalProfit]);

  const handleTimeframeChange = (event) => {
    setTimeframe(event.target.value);
  };

  return (
    <div className="flex flex-col gap-[16px]">
      <div className="flex justify-between items-center">
        <Typography variant="h5" className="capitalize">General Profit</Typography>
        <FormControl>
          <Select
            labelId="demo-simple-select-label"
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
      <div className="w-full" style={{minHeight: 450}}>
        {loading ? (
          <Box className="w-full h-full flex justify-center items-center relative">
            <LoadingProgress sx={{width: "70px"}}/>
          </Box>
        ) : (
          <React.Fragment>
            <div className="flex justify-between w-full gap-[16px] mb-5">
              <div
                className="w-full flex flex-col border rounded-[8px] px-[14px] sm:px-[24px] py-[16px] gap-[24px] transition ease-in-out delay-10 hover:bg-hover">
                <Typography variant="subtitle3">Items Sold</Typography>
                <div className="flex justify-between items-end">
                  <Typography variant="h4">{generalProfit.totalItemsSold}</Typography>
                  <div className="flex items-center">
                    <ArrowDropDownIcon className="text-[20px] text-primary"/>
                    <Typography variant="label" className="text-primary">0%</Typography>
                  </div>
                </div>
              </div>
              <div
                className="w-full flex flex-col border rounded-[8px] px-[14px] sm:px-[24px] py-[16px] gap-[24px] transition ease-in-out delay-10 hover:bg-hover">
                <Typography variant="subtitle3">Profit</Typography>
                <div className="flex justify-between items-end">
                  <Typography variant="h4">${generalProfit?.totalProfit?.toFixed(2)}</Typography>
                  <div className="flex items-center">
                    <ArrowDropUpIcon className="text-[20px] text-success"/>
                    <Typography variant="label" className="text-success">0%</Typography>
                  </div>
                </div>
              </div>
            </div>

            <StyledTableContainer component={Paper} className="overflow-x-auto">
              <Table aria-label="simple table" id="vendor-dashboard">
                <TableHead>
                  <TableRow>
                    <TableCell align="left"
                               className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase">Top
                      Sales</TableCell>
                    <TableCell align="left"
                               className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase px-0">Units</TableCell>
                    {/*<TableCell align="left" className="font-gilroy !text-[12px] text-[#a3a3a3] font-medium bg-white uppercase">Price</TableCell>*/}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {generalProfit?.topItems?.length > 0 ? generalProfit?.topItems?.map((row) => (
                    <TableRow
                      key={row.name}
                      className="transition ease-in-out delay-10 hover:bg-secondary"
                      sx={{'&:last-child td, &:last-child th': {border: 0}}}
                    >
                      <TableCell align="left" sx={{width: '60%'}}>
                        <div className="flex gap-[8px] items-center">
                          <img src={row.photo} className="w-[32px] h-[32px] rounded-[4px]"/>
                          <Typography variant="subtitle2">{row.name}</Typography>
                        </div>
                      </TableCell>
                      <TableCell align="left" sx={{width: '15%'}}>
                        <Typography variant="subtitle2">{row.soldCount.toLocaleString()}</Typography>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow
                      key={"row_no_data"}
                      className="transition ease-in-out delay-10 hover:bg-secondary"
                      sx={{'&:last-child td, &:last-child th': {border: 0}}}
                    >
                      <TableCell align="left" sx={{width: '60%', height: 120}} colSpan={2}>
                        <Typography className="text-center" variant="subtitle2">No Data</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {/*{filteredOrders.length === 0 && <TableRow><TableCell colSpan={6} style={{ textAlign: 'center' }} className="font-gilroy text-[14px] text-gray-500">No items</TableCell></TableRow>}*/}
                </TableBody>
              </Table>
            </StyledTableContainer>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}