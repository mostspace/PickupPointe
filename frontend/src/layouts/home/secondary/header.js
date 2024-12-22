import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as ScrollLink } from "react-scroll";
import { Link, NavLink as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import styles from 'src/style';
// @mui
import {
  Popover, Box, Grid, Drawer, styled, Divider, IconButton, Container, ListItemText, ListItemButton, Avatar, MenuItem,
} from "@mui/material";
import { logo } from "src/assets";
import { navLinks } from 'src/constants';
import { TextConstants } from "src/constants/textConstants";
// Icons
import HamburgerIcon from "src/assets/svgs/HamburgerIcon";
import { Logout } from "@mui/icons-material";
// Components
import Button from "src/components/button/primary-button";
import { StyledNavItemIcon } from 'src/components/nav-section/styles';
// Reducers
import { logout } from "src/reducers/authSlice";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const userRole = user?.role || 'shopper';
  const headerType = userRole === 'restaurant' || userRole === 'vendor' ? 'vendor' : 'shopper';

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(window.scrollY > 100 ? true : false);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

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

  // Account Popover
  const [openAccountMenu, setOpenAccountMenu] = useState(null);
  const handleAccountMenuOpen = (event) => setOpenAccountMenu(event.currentTarget);
  const handleAccountMenuClose = () => setOpenAccountMenu(null);

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
            {navLinks.map((link) => (
              <ScrollLink
                key={link.title}
                to={link.href}
                smooth={'true'}
                duration={500}
                offset={-70}
                onClick={toggleDrawer(false)}
                style={{
                  display: "block",
                  padding: "12px 18px",
                  paddingLeft: '34px',
                  textDecoration: "none",
                  fontSize: "16px",
                  fontWeight: "400",
                  color: "#666",
                  cursor: "pointer",
                }}
              >
                {link.title}
              </ScrollLink>
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
            <ListItemText disableTypography primary="Logout" />
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
              <ListItemText disableTypography primary="Login" />
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
              <ListItemText disableTypography primary="Register" />
            </StyledNavItem>
          </>
        )}
      </Box>
    </>
  );

  return (
    <>
      <div className={`${styles.paddingX} ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
          <Container
            maxWidth="xl"
            className={`header-container ${isFixed ? 'fixed' : 'relative mt-[32px]'}`}
            sx={{
              top: { xs: '0', md: '0' },
              left: { xs: '0', md: '50%' },
              zIndex: '999',
              transform: { xs: 'unset', md: 'translateX(-50%)' },
              padding: { xs: '16px', md: '1em' },
              background: '#F9FAFB',
              width: { xs: '100%', md: '100%' },
              maxWidth: { xs: '100%', md: '1312px', lg: '1312px' },
              boxShadow: isFixed ? { xs: '0 2px 4px rgba(0, 0, 0, 0.1)', md: '0 4px 8px rgba(0, 0, 0, 0.1)' } : 'none', // Add a shadow when fixed
              transition: 'all 0.3s ease',
            }}
          >
            <Grid container alignItems={"center"}>
              <Grid item xs={6} lg={2}>
                <Box sx={{ width: "200px" }}>
                  <Link to="/" smooth={'true'} duration={500} offset={-70} style={{display: "flex", alignItems: "center", gap: '1rem', cursor: "pointer"}}>
                    <StyledImage src={logo} alt="Logo" style={{ cursor: "pointer", width: "44px", height: "33px" }} />
                    <span style={{fontWeight: "600", fontSize: "18px"}} className="font-gilroyBold">{TextConstants.PICKUPPOINTE}</span>
                  </Link>
                </Box>
              </Grid>
              <Grid item md={8} sx={{ display: { xs: "none", lg: "block" } }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: {
                      xs: "1rem",
                      lg: "4rem",
                    },
                  }}
                >
                  {navLinks.map((link) => (
                    <ScrollLink
                      className="font-gilroy"
                      key={link.title}
                      to={link.href}
                      smooth={'true'}
                      duration={500}
                      offset={-70}
                      style={{
                        fontSize: "16px",
                        fontWeight: "400",
                        color: "rgb(103 101 101)",
                        cursor: "pointer",
                        fontFamily: 'Gilroy-Medium',
                      }}
                    >
                      {link.title}
                    </ScrollLink>
                  ))}
                </Box>
              </Grid>
              <Grid item md={2} sx={{ display: { xs: "none", lg: "block" } }}>
                {user ? (
                  <div className="flex items-center gap-[15px] sm:gap-[32px] justify-end">
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
                  </div>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: "14px",
                    }}
                  >
                    <Link to="/login">
                      <Button
                        value={"Login"}
                        bg={"rgba(245, 245, 245, 1)"}
                        height={"40px"}
                        weight={400}
                        color={"rgba(24, 24, 24, 1)"}
                      />
                    </Link>
                    <Link to="/register">
                      <Button
                        value={"Register"}
                        bg={"rgba(241, 68, 69, 1)"}
                        height={"40px"}
                        color={"rgba(254, 254, 255, 1)"}
                        weight={600}
                      />
                    </Link>
                  </Box>
                )}
              </Grid>
              <Grid item xs={6} sx={{ 
                display: { xs: "flex", lg: "none" },
                justifyContent: 'flex-end'
                }}>
                <IconButton onClick={toggleDrawer(true)}>
                  <HamburgerIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Container>
        </div>
      </div>
      
      {/* Drawer component */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawerList()}
      </Drawer>

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
            {location.pathname === '/order-local' ? (
              <MenuItem onClick={() => navigate(`${headerType === 'vendor' ? '/vendor' : '/shopper'}`)}>Go to dashboard</MenuItem>
            ) : (
              <MenuItem onClick={() => navigate('/')}>Go to home</MenuItem>
            )}
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </>
        ) : (
          <MenuItem onClick={() => navigate('/login')}>Login</MenuItem>
        )}
      </Popover>
    </>
  );
};

export default Header;

const StyledImage = styled('img')(({ theme }) => ({
  width: '100%', 
  maxWidth: '200px',
  [theme.breakpoints.down('sm')]: {
    maxWidth: '130px',
  },
}));

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