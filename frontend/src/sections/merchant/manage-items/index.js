import React, {useState, useRef, useEffect} from "react";
import { useNavigate, useLocation  } from "react-router-dom";
// @mui
import {
  Box, Typography, Tabs, Tab, IconButton, Popover, MenuItem, Grid, styled, OutlinedInput, InputAdornment, alpha, Divider, TextField, Autocomplete
} from "@mui/material";
// Icons
import CircleIcon from "@mui/icons-material/Circle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// Components
import TabPanel from "src/components/tab";
import Iconify from "src/components/iconify/iconify";
import LoadingProgress from "src/components/loading-screen/loading-progress.js";
import { tabProps } from "src/utils/tab-helpers";
// Redux
import {useDispatch, useSelector} from "react-redux";
import {getMenus, getModifiers} from "src/reducers/merchant/menuSlice.js";
import {getLocationAddress} from "../../../components/choose-location-select/index.js";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import dayjs from "dayjs";

// ---------------------------------------------------------------------------------------------

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 50,
  height: 40,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 464,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

// ---------------------------------------------------------------------------------------------

const Main = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { confirmed, item_id, tab, option_id } = location.state || {};
  const [tabValue, setTabValue] = useState(tab || 0);
  const [openItemMenu, setOpenItemMenu] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchKeyword, setSearchKeyword] = useState("")
  const [isDisabled, setIsDisabled] = useState(false);
  const inputRef = useRef(null);

  const handleTabChange = (event, newValue) => setTabValue(newValue);

  const {menuList, modifiers, isLoading} = useSelector(state => state.merchant.menu);

  useEffect(() => {
    if (tabValue === 0) {
      dispatch(getMenus());
    }
    if (tabValue === 1){
      dispatch(getModifiers());
    }
  }, [tabValue]);

  const handleItemMenuOpen = (event, item) => {
    setOpenItemMenu(event.currentTarget);
    setSelectedItem(item);
  };

  const handleItemMenuClose = () => {
    setOpenItemMenu(null);
    setSelectedItem(null);
  };

  const handleIconClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSelectionChange = (event, value) => {
    setSelectedCategory(value.label);
  };
  return (
    <>
      <div id="tabs" className="flex flex-col gap-[16px] sm:gap-[32px]">
        <Grid container alignItems="end" spacing={2}>
          <Grid item xs={12} sm={8}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }} className="w-full">
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="Manage items">
                {[
                  {label: "Items", index: 0},
                  {label: "Options", index: 1},
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
                    className="w-[50%] !font-gilroyMedium !text-[14px] !text-heading !normal-case items-baseline pl-1"
                  />
                ))}
              </Tabs>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <div className="w-full flex justify-end">
              <StyledSearch
                placeholder="Search item name..."
                startAdornment={
                  <InputAdornment position="start" onClick={handleIconClick}>
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                  </InputAdornment>
                }
                onChange={e => setSearchKeyword(e.target.value)}
                disabled={isDisabled}
                inputRef={inputRef}
              />
            </div>
          </Grid>
        </Grid>

        <div id="tab-panel" className="flex-1">
          <TabPanel value={tabValue} index={0}>
            <div className="flex flex-col gap-[24px]">
              <div className="flex items-center gap-[12px]">
                <Typography variant="subtitle1">Category: </Typography>
                <Autocomplete
                  disablePortal
                  disableClearable
                  options={[{ label: "All" }, ...(menuList?.result?.map((product, idx) => ({"label": product.category})))] || []}
                  value={selectedCategory}
                  onChange={handleSelectionChange}
                  popupIcon={<KeyboardArrowDownOutlinedIcon/>}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder='Choose Item Category'
                      className="line-clamp-1 w-52"
                    />
                  )}
                />
              </div>
              {isLoading ?
                (
                  <div className="w-full h-full relative flex items-center justify-center">
                    <LoadingProgress sx={{width: '50px', marginTop: '50%'}}/>
                  </div>
                ) : menuList?.result?.filter(product => selectedCategory === "All" ? true : product.category === selectedCategory)
                  .filter(product => product.items.some(item => item.name.toLowerCase().includes(searchKeyword.toLowerCase())))
                  .map((product, index) => (
                  <div key={index} className="flex flex-col gap-[14px] border-b border-dashed last:border-0 pb-[35px]">
                    <div className="flex justify-between items-start">
                      <Typography variant="subtitle3">{product.category}</Typography>
                      <Typography variant="subtitle2">{product?.items?.length} items</Typography>
                    </div>
                    <div className="flex flex-col gap-[12px]">
                      {product?.items?.filter(product => product.name.toLowerCase().includes(searchKeyword.toLowerCase()))
                        .map((item, index) => (
                        <Box key={index}
                          className="flex p-[8px] justify-between items-center gap-[20px] self-stretch rounded-[12px]"
                          sx={{
                            boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.04)",
                            border: "1px solid #00000010",
                          }}
                        >
                          <div className="flex flex-1 gap-[16px] items-center">
                            <div className="flex flex-col flex-grow">
                              <div className="flex gap-[12px] items-center">
                                <img src={item.img} className="object-cover w-[64px] h-[64px] rounded-[5px]"
                                     alt={item.name}/>
                                <div className="flex flex-wrap flex-grow justify-between items-center gap-[5px]">
                                  <div className="flex flex-col gap-[5px]">
                                    <Typography variant="h6"
                                                className={`text-[16px] sm:text-[18px] font-gilroyMedium ${item.activeStatus !== "Available" ? 'text-primary' : 'text-heading'}`}>{item.name}</Typography>
                                    {(item.activeStatus !== "Available") && (
                                      <div className="flex flex-col gap-[12px]">
                                        <div className="flex items-start gap-[6px]">
                                          <InfoOutlinedIcon className="text-primary text-[18px]"/>
                                          <div className="flex flex-col">
                                            <Typography variant="subtitle2"
                                                        className="text-primary text-[12px] sm:text-[14px]">Inactive,{" "}
                                              <span className="capitalize-first">
                                                {item.activeStatus === "Forever" ? "I no longer carry this item" : `until end of ${dayjs(item.activeStatus).format("MMM DD, YYYY")}`}
                                              </span>
                                            </Typography>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <Typography variant="h6" className="font-gilroyMedium text-[14px] sm:text-[16px]">${item.price}</Typography>
                                </div>
                              </div>
                            </div>
                          </div>
                          <IconButton onClick={(event) => handleItemMenuOpen(event, item)} className="mr-3">
                            <MoreVertIcon className="text-heading text-[20px]"/>
                          </IconButton>
                        </Box>
                      ))}
                    </div>
                  </div>
                ))
              }
            </div>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <div className="flex flex-col gap-[16px]">
              {isLoading ?
                (
                  <div className="w-full h-full relative flex items-center justify-center">
                    <LoadingProgress sx={{width: '50px', marginTop: '50%'}}/>
                  </div>
                ) :
                modifiers?.result?.filter(data =>
                  data.modifier.some(item => item.name.toLowerCase().includes(searchKeyword.toLowerCase()))
                ).map((data, index) => (
                  <Box key={index}
                    className="flex px-[16px] py-[12px] justify-between items-center gap-[12px] self-stretch rounded-[12px]"
                    sx={{
                      boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.04)",
                      border: "1px solid #00000010",
                    }}
                  >
                    <div className="flex flex-1 gap-[16px] items-start">
                      <div className="flex flex-col flex-grow gap-[12px]">
                        <div className="flex justify-between items-center">
                          <div className="flex flex-col items-start gap-[2px]">
                            <div className="flex gap-[5px] items-center">
                              <Typography variant="h6" className="font-gilroyMedium">{data.name}</Typography>
                            </div>
                            <div className="flex gap-[5px] items-center">
                              <Typography variant="subtitle3">{data.modifier.length} options</Typography>
                              <CircleIcon className="text-[3px] text-heading" />
                              <Typography variant="subtitle3">Added to {data.count} items</Typography>
                            </div>
                          </div>
                          <div className="flex items-center gap-[32px]">
                            <IconButton onClick={(event) => handleItemMenuOpen(event, data)}>
                              <MoreVertIcon className="text-heading text-[20px]" />
                            </IconButton>
                          </div>
                        </div>
                        {data.modifier && (
                          <div className="flex flex-col gap-[10px] pl-[15px] sm:pl-[30px]">
                            {data.modifier
                              .filter(item => item.name.toLowerCase().includes(searchKeyword.toLowerCase()))
                              .map((item, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <div className="flex gap-[8px] items-center">
                                  <img src={item.img} className="w-[36px] h-[36px] rounded-[4px]" alt={item.name} />
                                  <div className="flex flex-col gap-[3px]">
                                    <Typography variant="subtitle2" className={`${!item.isInStock ? 'text-primary' : 'text-heading'}`}>
                                      {item.name}
                                    </Typography>
                                  </div>
                                </div>
                                {!item.isInStock && (
                                  <div className="flex items-center gap-[6px]">
                                    <InfoOutlinedIcon className="text-primary text-[18px]" />
                                    <div className="flex flex-col">
                                      <Typography variant="subtitle2" className="text-primary">Unavailble</Typography>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Box>
                ))
              }
            </div>
          </TabPanel>
        </div>
      </div>

      <Popover
        open={Boolean(openItemMenu)}
        anchorEl={openItemMenu}
        onClose={handleItemMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 1,
            width: 225,
            "& .MuiMenuItem-root": {
              px: 1,
              typography: "body2",
              borderRadius: 0.75,
              fontFamily: "Gilroy",
            },
          },
        }}
      >
        <MenuItem disabled={tabValue === 1}
          onClick={() => {
            navigate("out-of-stock", { state: { item: selectedItem, tab: tabValue, } });
            handleItemMenuClose();
          }}
        >
          Mark Item As Out Of Stock
        </MenuItem>
        <MenuItem disabled={tabValue === 0}
          onClick={() => {
            navigate("adjust-order", { state: { item: selectedItem, tab: tabValue, } });
            handleItemMenuClose();
          }}
        >
          Mark Options As Out Of Stock
        </MenuItem>
      </Popover>
    </>
  );
};

export default Main;