import React, { useEffect, useState } from "react";
import {Link, useLocation, useNavigate} from 'react-router-dom';
import { RouterLink } from 'src/routes/components';
import { merchantNavLinks } from 'src/constants';
// Asset
import {icLogout, logo, UploadImg, product_1} from "src/assets";
// @mui
import {
  Box, Drawer, Container, IconButton, ListItemText, Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
// Components
import { StyledNavItemIcon } from 'src/components/nav-section/styles';
import { StyledNavItem, StyledImage } from "src/layouts/header";
// Redux
import {useDispatch, useSelector} from "react-redux";
import {setToken} from "src/reducers/merchant/authSlice.js";
import MerchantSocketHandler from "../socket.js";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentTitle, setCurrentTitle] = useState("All orders");
  const {merchant} = useSelector(state => state.merchant.auth);

  const routeTitles = {
    '/merchant/all-orders': 'All Orders',
    '/merchant/chat': 'Chat',
    '/merchant/manage-items': 'Manage Items',
    '/merchant/settings': 'Settings',
    '/merchant/get-help': 'Get Help',
  };

  useEffect(() => {
    const title = routeTitles[location.pathname] || "";
    setCurrentTitle(title);
  }, [location, routeTitles]);
  

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const logout = (e) => {
    dispatch(setToken(""));
    navigate("/merchant/login")
  }

  const drawerList = () => (
    <div className="flex-1 flex flex-col h-full justify-between w-[360px]">
      <div className="flex flex-col">
        <div
          className="relative flex gap-[16px] items-center px-[20px] py-[16px] overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(24, 24, 24, 0.3), rgba(24, 24, 24, 0.5), rgba(24, 24, 24, 0.7), rgba(24, 24, 24, 0.8)), url(${merchant?.shop?.photo || ''})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="relative z-10 flex items-center gap-[16px]">
            <Box className="w-[72px] h-[72px] border rounded-full flex items-center justify-center p-1 overflow-hidden">
              <img
                src={merchant?.shop?.logo || UploadImg}
                alt={merchant?.shop?.name || 'Shop Logo'}
                className="object-cover"
              />
            </Box>
            <Typography variant="h5" className="font-gilroyMedium text-white">
              {merchant?.shop?.name || 'Shop Name'}
            </Typography>
          </div>
        </div>
        <Box 
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          {merchantNavLinks.map((item) => (
            <NavItem key={item.title} item={item} setCurrentTitle={setCurrentTitle} />
          ))}
        </Box>
      </div>
      <div className="flex flex-col" id="bottom-content">
        <NavItem item={{icon: icLogout, title: "Sign out"}} onClick={() => logout()} />
        <Link to="/merchant/get-help">
          <div className="flex items-center gap-[10px] border-t p-[16px] sm:px-[32px] sm:py-[20px] hover:bg-hover">
            <StyledImage src={logo} alt="Logo" style={{ width: "33px" }} />
            <Typography variant="subtitle1" className="text-primary">Get help from Pickup Pointe team</Typography>
          </div>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <MerchantSocketHandler/>
      <div className="flex justify-center items-start">
        <Container
          className="rounded-[16px]"
          sx={{
            padding: { xs: '16px', md: '16px 32px' },
            background: '#fff',
            width: { xs: '100%', md: '100%' },
            maxWidth: { xs: '100%', md: '960px' },
          }}
        >
          <div className="flex gap-[16px] items-center justify-between">
            <div className="flex items-center gap-[12px]">
              <IconButton onClick={toggleDrawer(true)}>
                <MenuIcon className="text-heading" />
              </IconButton>
              <Typography variant="h6" className="font-gilroyMedium">{currentTitle}</Typography>
            </div>
            <Link to="/merchant/all-orders" smooth={'true'} duration={500} offset={-70} className="w-fit flex items-center justify-end gap-[12px]">
              <StyledImage src={logo} alt="Logo" style={{ cursor: "pointer", width: "44px", height: "33px" }} />
              <span className="hidden xs:block text-[14px] sm:text-[18px] font-gilroyBold">PICKUP POINTE</span>
            </Link>
          </div>
        </Container>
      </div>
      
      <Drawer className="rounded-[32px]"
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)} 
      >
        {drawerList()}
      </Drawer>
    </>
  );
};

export default Header;

function NavItem({ item, onClick }) {
  const { title, path, icon } = item;

  return (
    <StyledNavItem
      component={RouterLink}
      onClick={onClick}
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
    >
      {icon && <StyledNavItemIcon><img src={icon} className="w-[22px] h-[22px]"/></StyledNavItemIcon>}
      <ListItemText disableTypography primary={title} className="text-[16px]" />
    </StyledNavItem>
  );
}