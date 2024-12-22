import React, { useEffect, useState, useMemo } from "react";
import { Link, NavLink as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import io from "socket.io-client";
import { BASE_URL } from "src/config-global";
// @mui
import {
  Rating, Stack, FormControl, Button, Popover, Box, Grid, Drawer, styled, Badge, Divider, Typography, IconButton, InputAdornment, 
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, ListItemText, ListItemButton, Avatar, MenuItem,
} from "@mui/material";
// Constants
import { shopperHeaderLinks, shopperNavLinks, vendorHeaderLinks, vendorNavLinks } from "src/constants";
import { TextConstants } from "src/constants/textConstants";
// Assets
import { logo, icNotification, icMessage, icCopy } from "src/assets";
// Icons
import HamburgerIcon from "src/assets/svgs/HamburgerIcon";
import { Logout, Login } from "@mui/icons-material";
import HowToRegIcon from '@mui/icons-material/HowToReg';
// Components
import NavList from "src/components/nav/nav-list";
import { StyledNavItemIcon } from 'src/components/nav-section/styles';
import DefaultButton from "src/components/button/default-button";
import NotificationPopover from "src/components/notification/notification-popover";
// Reducers
import { logout } from "src/reducers/authSlice";
import { setNotifications } from "src/reducers/chatSlice";
import {useSocket} from "../contexts/socketContext.js";

// --------------------------------------------------------------------------------------------------------------

let socket;

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = useSocket();
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [shouldCloseDrawer, setShouldCloseDrawer] = useState(false); // New state flag

  const authState = useSelector((state) => state.auth);
  const activeUser = authState.user;
  const { notifications } = useSelector((state) => state.chats);

  // Current User Information from Redux state
  const user = useSelector((state) => state.auth.user);
  const userRole = user?.role || 'shopper';
  const headerType = userRole === 'restaurant' || userRole === 'vendor' ? 'vendor' : 'shopper';

  // Conditionally filter out "Manage Inventory" link if user role is restaurant
  const filteredVendorNavLinks = useMemo(() => 
    vendorNavLinks
      .filter(link => !(userRole === 'restaurant' && link.title === 'Manage inventory'))
      .map(link => link.title === 'Manage menu' && userRole !== 'restaurant' ? { ...link, title: 'Manage items' } : link), 
    [userRole]
  );

  // Define header and navigation links based on user role
  const headerLinks = headerType === 'vendor' ? vendorHeaderLinks : shopperHeaderLinks;
  const navLinks = headerType === 'vendor' ? filteredVendorNavLinks : shopperNavLinks;

  /*useEffect(() => {
    socket = io(BASE_URL);
    console.log(socket);
    return () => {
      if (socket) {
        socket.disconnect();
        socket.close();
      }
    };
  }, []);*/

  /*useEffect(() => {
    socket.emit("setup", activeUser)
  }, [notifications])*/

  useEffect(() => {
    socket.on("chat.message_received", (newMessageRecieved) => {
      console.log(newMessageRecieved)
      if (!notifications.includes(newMessageRecieved)) {
        dispatch(setNotifications([newMessageRecieved, ...notifications]))
      }
    });
  })

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  // Notification Popper Menu
  const [openNotificationMenu, setOpenNotificationMenu] = useState(null);
  const handleNotificationMenuOpen = (event) => setOpenNotificationMenu(event.currentTarget);
  const handleNotificationMenuClose = () => setOpenNotificationMenu(null);

  // Account Popover
  const [openAccountMenu, setOpenAccountMenu] = useState(null);
  const handleAccountMenuOpen = (event) => setOpenAccountMenu(event.currentTarget);
  const handleAccountMenuClose = () => setOpenAccountMenu(null);

  // Referral Modal
  const [openReferralDiscount, setOpenReferralDiscount] = React.useState(false);
  const handleReferralDiscountOpen = () => setOpenReferralDiscount(true);
  const handleReferralDiscountClose = () => setOpenReferralDiscount(false);

  // Change Password Modal
  const [openLeaveReview, setOpenLeaveReview] = React.useState(false);
  const handleLeaveReviewOpen = () => {
    handleNotificationMenuClose();
    setOpenLeaveReview(true);
  };
  const handleLeaveReviewClose = () => setOpenLeaveReview(false);

  // Logout Handler
  const handleLogout = (e) => {
    handleAccountMenuClose();
    localStorage.removeItem("token");
    dispatch(logout());
    toast("Logged out", {
      theme: "light",
      style: {
        backgroundColor: "white",
        color: "primary",
        fontFamily: 'Gilroy',
        fontSize: '14px',
      },
    });
  };

  // Clipboard invite link
  const inviteLink = 'https://www.pickuppointe.com/referral/' + user?._id;
  const handleCopyClick = () => {
    navigator.clipboard.writeText(inviteLink)
    .then(() => {
      toast("Invite link copied to clipboard!", {
        theme: "light",
        style: {
          backgroundColor: "white",
          color: "primary",
          fontFamily: 'Gilroy',
          fontSize: '14px',
        },
      });
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });
  };

  const drawerList = () => (
    <>
      <Box
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
        sx={{ width: 250, height: '100%' }}
      >
        <div className="flex items-center px-[16px] py-[12px] gap-[12px]">
          <Avatar sx={{ width: 40, height: 40 }} src={user?.avatar}></Avatar>
          <div className="text-start">
            <h6 className="text-heading text-[14px] font-normal leadig-[24px]">
              {user?.firstName || user?.lastName ? `${user.firstName} ${user.lastName}` : "Guest"}
            </h6>
            <p className="text-[#666] text-[12px] font-normal leading-[19px]">
              {headerType } portal
            </p>
          </div>
        </div>

        <Divider />
        
        {user && (
          <>
            {/* Render header links based on type */}
            {headerLinks.map((item, index) => (
              <NavItem key={index} item={item} />
            ))}
            
            <Divider />

            {/* Render navigation links based on type */}
            {navLinks.map((item) => (
              <NavItem key={item.title} item={item} />
            ))}
    
            <Divider />
          </>
        )}

        {/* Conditional login/logout rendering */}
        {user ? (
          <StyledNavItem
            sx={{
              paddingLeft: '18px',
              color: '#666666',
              '&:hover': {
                fontWeight: "600",
                filter: 'brightness(0)',
              },
            }}
            onClick={handleLogout}
          >
            <StyledNavItemIcon>
              <Logout className="text-[28px]" />
            </StyledNavItemIcon>
            <ListItemText disableTypography primary="Sign Out" />
          </StyledNavItem>
        ) : (
          <>
            <StyledNavItem
              sx={{
                paddingLeft: '20px',
                color: '#666666',
                '&:hover': {
                  fontWeight: "600",
                  filter: 'brightness(0)',
                },
              }}
              onClick={() => navigate('/login')}
            >
              <ListItemText disableTypography primary="Sign In" />
            </StyledNavItem>
            <StyledNavItem
              sx={{
                paddingLeft: '20px',
                color: '#666666',
                '&:hover': {
                  fontWeight: "600",
                  filter: 'brightness(0)',
                },
              }}
              onClick={() => navigate('/register/shopper-register')}
            >
              <ListItemText disableTypography primary="Sign Up" />
            </StyledNavItem>
          </>
        )}
      </Box>

      {(headerType !== 'vendor' && user) && (
        <div className="flex flex-col gap-[10px] p-[15px] w-[250px]">
          <TextField
            placeholder="Paste your invite link"
            value="pickuppointe.com/invite/8at3Ptk"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <img src={icCopy} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="label" className="w-full">
            Share your referral link and get order discounts{" "}
            <Link className="text-heading ml-2" onClick={handleReferralDiscountOpen}>See more</Link>
          </Typography>
        </div>
      )}
      
      {(headerType !== 'vendor' && !user) && (
        <div className="flex flex-col gap-[10px] p-[15px] w-[250px]">
          <Typography variant="subtitle3">Own a local business? Become a Pickup Pointe Merchant today</Typography>
          <Link to="/vendor-details" className="text-heading text-[14px] hover:text-primary">Learn more</Link>
        </div>
      )}
    </>
  );

  const NOTIFICATIONS = [
    {
      text: 'Warning: An item “Kiwi” is nearing expiration and will be tossed soon',
      time: '7:12 AM',
      date: 'May 20',
      link: headerType === 'vendor' ? '/vendor/notification' : '/shopper/notification',
    },
    {
      text: 'Your order is complete! You can rate this shop here.',
      time: '6:12 PM',
      date: 'May 19',
      link: headerType === 'vendor' ? '/vendor/notification' : '/shopper/notification',
    },
    {
      text: 'Pickup order PP9730823 has been picked up',
      time: '6:12 PM',
      date: 'May 19',
      link: headerType === 'vendor' ? '/vendor/notification' : '/shopper/notification',
    },
    {
      text: 'Your drop-off DD83739403 is overdue!',
      time: '6:12 PM',
      date: 'May 18',
      link: headerType === 'vendor' ? '/vendor/notification' : '/shopper/notification',
    },
  ];

  return (
    <>
      <Grid container alignItems={"center"} justifyContent={"space-between"} spacing={3}>
        <Grid item md={3} sm={6}>
          <div className="w-fit xs:min-w-[200px]">
            <Link
              to={user ? (headerType === 'vendor' ? '/vendor' : '/shopper') : '/'}
              smooth={"true"}
              duration={500}
              offset={-70}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              className="gap-[12px]"
            >
              <StyledImage src={logo} alt="Logo"
                style={{
                  cursor: "pointer",
                  width: "44px",
                  height: "33px",
                }}
              />
              <span style={{ fontWeight: "600" }} className="text-[14px] hidden xs:block sm:text-[18px] font-gilroyBold">{TextConstants.PICKUPPOINTE}</span>
            </Link>
          </div>
        </Grid>
        <Grid item md={9} className="flex items-center justify-end">
          {user && (
            <div className="flex-grow items-center gap-[16px] hidden md:flex">
              {headerLinks.map((link) => (
                <NavList key={link.title} item={link} />
              ))}
            </div>
          )}
          <div className="flex items-center gap-[15px] sm:gap-[32px]">
            {user && (
              <div className="flex items-center gap-[15px]">
                <IconButton onClick={() => navigate(headerType === 'vendor' ? '/vendor/chat' : '/shopper/chat')}>
                  <Badge badgeContent={notifications.length > 0 ? notifications.length : undefined} color="primary" className="!font-gilroy">
                    <img src={icMessage} className="w-[24px]" />
                  </Badge>
                </IconButton>
                
                <IconButton onClick={handleNotificationMenuOpen}>
                  <Badge badgeContent={undefined} color="primary" className="!font-gilroy">
                    <img src={icNotification} className="w-[24px]" />
                  </Badge>
                </IconButton>
              </div>
            )}
            <div className="w-fit gap-[12px] hidden md:flex">
              <div className="text-end">
                <h6 className="text-heading text-[14px] font-normal leading-[24px]">
                  {user?.firstName || user?.lastName ? `${user.firstName} ${user.lastName}` : "Guest"}
                </h6>
                <p className="text-[#666] text-[12px] font-normal leading-[19px]">
                  {headerType } portal
                </p>
              </div>
              
              <Avatar
                onClick={user ? handleAccountMenuOpen : undefined}
                sx={{ width: 40, height: 40 }}
                src={user?.avatar}
                className="cursor-pointer"
              />
            </div>

            {!user && (
              <DefaultButton value="Sign In" onClick={() => navigate('/login')} className="font-gilroyMedium hidden md:block" />
            )}

            <IconButton onClick={toggleDrawer(true)} className="flex md:hidden">
              <HamburgerIcon />
            </IconButton>
          </div>
        </Grid>
      </Grid>

      {/* Drawer component */}
      <Drawer
        anchor="left"
        open={drawerOpen && !shouldCloseDrawer} // Controlled Drawer
        onClose={() => setDrawerOpen(false)}
      >
        {drawerList()}
      </Drawer>

      {/* Notification Popover */}
      <NotificationPopover 
        open={Boolean(openNotificationMenu)}
        anchorEl={openNotificationMenu}
        onClose={handleNotificationMenuClose}
        headerType={headerType}
        notifications={NOTIFICATIONS}
      />

      {/* Referral Discount Modal */}
      <React.Fragment>
        <Dialog
          className="w-full"
          open={openReferralDiscount}
          onClose={handleReferralDiscountClose}
          sx={{
            width: "100% !important",
          }}
        >
          <DialogTitle id="" className="pt-[32px] sm:!pt-[64px]">
            <h1 className="text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center font-gilroy">
              How does the referral link work?
            </h1>
          </DialogTitle>
          <DialogContent dividers={scroll === "paper"}>
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
              <div className="flex flex-col gap-[32px] sm:px-[60px] py-[16px]">
                <Typography variant="subtitle3">
                  Invite a friend to join Pickup Pointe, whether as a vendor or
                  a shopper, and enjoy a discount on your future orders. Upon
                  your referral’s first purchase, you’ll receive a 10% discount.
                  Invite two friends, and you’ll get an additional 10% discount
                  on your following order. You can continue this process,
                  extending your 10% discount benefits until you reach a maximum
                  of (20) 10% discount.
                </Typography>
                <FormControl variant="standard" className="">
                  <Typography variant="label" className="pb-[4px]">
                    Your personal link
                  </Typography>
                  <TextField
                    placeholder="Paste your invite link"
                    value="pickuppointe.com/invite/8at3Ptk"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleCopyClick}>
                            <img src={icCopy} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions className="!px-[22px] !pb-[32px] sm:!pb-[64px] sm:!px-[80px] !gap-[14px]">
            <Button
              sx={{
                width: "100%",
                height: "44px",
                fontFamily: "Gilroy",
                fontSize: "14px",
                color: "#181818",
                borderRadius: "8px",
                backgroundColor: "#F5F5F5",
                textTransform: "unset",
              }}
              onClick={handleReferralDiscountClose}
            >
              Cancel
            </Button>
            <Button
              className="w-full"
              sx={{
                width: "100%",
                height: "44px",
                fontFamily: "Gilroy",
                fontSize: "14px",
                color: "#ffffff",
                borderRadius: "8px",
                backgroundColor: "#F14445",
                textTransform: "unset",
                "&:hover": {
                  backgroundColor: "#E13031",
                },
              }}
              onClick={handleReferralDiscountClose}
            >
              Copy
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>

      {/* Leave Review Modal */}
      <React.Fragment>
        <Dialog
          className="w-full"
          open={openLeaveReview}
          onClose={handleLeaveReviewClose}
          scroll="paper"
          sx={{
            width: "100% !important",
          }}
        >
          <DialogTitle id="" className="pt-[32px] sm:!pt-[64px]">
            <h1 className="text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center font-gilroy">
              Leave a review
            </h1>
          </DialogTitle>
          <DialogContent dividers={scroll === "paper"}>
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
              <div className="flex flex-col gap-[14px] font-gilroy sm:px-[60px] py-[16px]">
                <div className="w-full flex flex-col xs:flex-row gap-[32px] xs:items-center pr-[28px]">
                  <FormControl variant="standard" className="w-full">
                    <Typography variant='label1'> 
                      Full name
                    </Typography>
                    <TextField
                      size="small"
                      variant="outlined"
                      required
                      fullWidth
                      placeholder="Enter full name"
                    />
                  </FormControl>
                  <FormControl variant="standard" className="w-fit">
                    <Typography variant='label1'> 
                      Rating
                    </Typography>
                    <Stack className="py-[7px]">
                      <Rating name="size-medium" defaultValue={0} />
                    </Stack>
                  </FormControl>
                </div>
                <FormControl variant="standard" className="w-full">
                  <label className="font-normal text-normal leading-[20px] text-[12px] pb-[4px]">
                    Review
                  </label>
                  <TextField
                    size="small"
                    variant="outlined"
                    required
                    fullWidth
                    multiline
                    rows="3"
                    placeholder="Enter your review here"
                  />
                </FormControl>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions className="!px-[22px] !pb-[32px] sm:!pb-[64px] sm:!px-[80px] !gap-[14px]">
            <Button
              sx={{
                width: "100%",
                height: "44px",
                fontFamily: "Gilroy",
                fontSize: "14px",
                color: "#181818",
                borderRadius: "8px",
                backgroundColor: "#F5F5F5",
                textTransform: "unset",
              }}
              onClick={handleLeaveReviewClose}
            >
              Cancel
            </Button>
            <Button
              className="w-full"
              sx={{
                width: "100%",
                height: "44px",
                fontFamily: "Gilroy",
                fontSize: "14px",
                color: "#ffffff",
                borderRadius: "8px",
                backgroundColor: "#F14445",
                textTransform: "unset",
                "&:hover": {
                  backgroundColor: "#E13031",
                },
              }}
              onClick={handleLeaveReviewClose}
            >
              Leave a review
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
      
      {/* Account Popover */}
      <Popover
        className="mt-4"
        open={Boolean(openAccountMenu)}
        anchorEl={openAccountMenu}
        onClose={handleAccountMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 1,
            width: 175,
            "& .MuiMenuItem-root": {
              px: 1,
              typography: "body2",
              borderRadius: 0.75,
              fontFamily: "Gilroy",
            },
          },
        }}
      >
        {user ? (
          <>
            {(location.pathname.split('/')[1]) === headerType ? (
              <MenuItem onClick={() => navigate('/')}>Go to home</MenuItem>
            ) : (
              <MenuItem onClick={() => navigate(`${headerType === 'vendor' ? '/vendor' : '/shopper'}`)}>Go to dashboard</MenuItem>
            )}
            {/* <MenuItem onClick={() => {
              handleAccountMenuClose();
              navigate(`${headerType === 'vendor' ? '/vendor/personal-information' : '/shopper/personal-information'}`);
            }}>
              Account settings
            </MenuItem> */}
            <MenuItem onClick={handleLogout}>Sign out</MenuItem>
          </>
        ) : (
          <MenuItem onClick={() => navigate('/login')}>Sign in</MenuItem>
        )}
      </Popover>
    </>
  );
};

export default Header;

export const StyledImage = styled("img")(({ theme }) => ({
  width: "100%",
  maxWidth: "200px",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "130px",
  },
}));

function NavItem({ item }) {
  const { title, path, icon } = item;

  return (
    <StyledNavItem
      component={RouterLink}
      to={path}
      sx={{
        '&:hover': {
          fontWeight: "600",
          filter: 'brightness(0)',
        },
        "&.active": {
          color: "text.primary",
          bgcolor: "action.selected",
          fontWeight: "fontWeightBold",
          filter: 'brightness(0)',
        },
      }}
      onClick={() => {
        // Set the flag to close the drawer after the click
        setShouldCloseDrawer(true);
      }}
    >
      {icon && <StyledNavItemIcon><img src={icon} className="w-[28px] h-[28px]" /></StyledNavItemIcon>}
      <ListItemText disableTypography primary={title} />
    </StyledNavItem>
  );
}

export const StyledNavItem = styled((props) => (
  <ListItemButton disableGutters {...props} />
))(({ theme }) => ({
  ...theme.typography.body2,
  height: 48,
  padding: "12px 15px",
  fontFamily: "Gilroy",
  position: "relative",
  color: theme.palette.text.secondary,
  borderRadius: theme.shape.borderRadius,
}));