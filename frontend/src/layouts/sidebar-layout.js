import React, { useState, useEffect, useMemo } from 'react'
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
// @mui
import { 
  Typography, Container, Grid, IconButton, TextField, InputAdornment, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, 
} from '@mui/material';
// Components
import Header from 'src/layouts/header';
import NavSection from "src/components/nav-section/nav-section";
import DefaultButton from "src/components/button/default-button";
// Asset
import { icCopy } from "src/assets";
// Constants
import { shopperNavLinks, vendorNavLinks } from 'src/constants';

// -------------------------------------------------------------------------------------------------------------------------------------------------------

const SidebarLayout = ({ children }) => {

  const user = useSelector((state) => state.auth.user);
  const userRole = user?.role || 'shopper';

  const sidebarStyle = useMemo(() => (userRole === 'restaurant' || userRole === 'vendor' ? 'vendor' : 'shopper'), [userRole]);
  
  // Conditionally filter out "Manage Inventory" link if user role is restaurant
  const filteredVendorNavLinks = useMemo(() => 
    vendorNavLinks
      .filter(link => !(userRole === 'restaurant' && link.title === 'Manage inventory'))
      .map(link => link.title === 'Manage menu' && userRole !== 'restaurant' ? { ...link, title: 'Manage items' } : link), 
    [userRole]
  );

  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsFixed(window.scrollY > 200);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Referral Modal
  const [openReferralDiscount, setOpenReferralDiscount] = useState(false);
  const handleReferralDiscountOpen = () => setOpenReferralDiscount(true);
  const handleReferralDiscountClose = () => setOpenReferralDiscount(false);

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

  return (
    <div className='bg-[#F6F6F6] flex flex-col gap-[20px] p-[15px] sm:px-[32px] xl:px-[64px] py-[32px] min-h-[100vh] !h-auto'> 
      <div className="flex justify-center items-start">
        <div className="max-w-[1312px] w-full">
          <Container
            maxWidth="xl"
            className={`${isFixed ? "fixed" : "relative"} rounded-[16px]`}
            sx={{
              top: { xs: "0", md: "0" },
              left: { xs: "0", md: "50%" },
              zIndex: "999",
              transform: { xs: "unset", md: "translateX(-50%)" },
              padding: { xs: "16px", md: "16px 48px" },
              background: "#fff",
              width: { xs: "100%", md: "100%" },
              maxWidth: { xs: "100%", md: "1312px", lg: "1312px" },
              boxShadow: isFixed ? 
                {
                  xs: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  md: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }
                : "none",
              transition: "all 0.3s ease",
            }}
          >
            <Header />
          </Container>
        </div>
      </div>    

      <Container 
        maxWidth="xl"
        sx={{
          height: '100%',
          display: 'flex',
          flexGrow: 1,
          padding: { xs: '16px', md: '48px' },
          background: '#ffffff',
          borderRadius: '24px',
          width: { xs: '100%', md: '100%' },
          maxWidth: { xs: '100%', md: '1312px', lg: '1312px' },
        }}
      >
        <Grid container>
          <Grid item md={3} className="w-full hidden md:block">
            {sidebarStyle === 'shopper' ? (
              <div className="w-full flex flex-col gap-[40px]">
                <NavSection data={shopperNavLinks} />   
                <div className="w-full flex flex-col gap-[10px]">
                  <TextField sx={{maxWidth: '296px', width: '100%'}}
                    placeholder="Paste your invite link"
                    value={inviteLink}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleCopyClick}><img src={icCopy} /></IconButton>
                      </InputAdornment>
                      ),
                    }}
                  />
                  <div className="flex flex-col lg:flex-row gap-[16px] justify-between">
                    <Typography variant="label">Share your referral link and get order discounts <span className="text-heading ml-3 cursor-pointer" onClick={handleReferralDiscountOpen}>See more</span></Typography>
                  </div>
                </div>
              </div>
            ) : (
              <NavSection data={filteredVendorNavLinks} />
            )}
          </Grid>

          <Grid item md={9} sm={12} className="w-full md:pl-[40px] lg:pl-[80px] pt-[19px]">
            {children}
          </Grid>
        </Grid>
      </Container>

      {/* Referral Discount Modal */}
      <React.Fragment>
        <Dialog className="w-full"
          open={openReferralDiscount}
          onClose={handleReferralDiscountClose}
          sx={{ width: "100% !important" }}
        >
          <DialogTitle id="" className='pt-[32px] sm:!pt-[64px]'>
            <h1 className='text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center font-gilroy'>How does the referral link work?</h1>
          </DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
              <div className='flex flex-col gap-[32px] sm:px-[60px] py-[16px]'>
                <Typography variant="subtitle3">Invite a friend to join Pickup Pointe, whether as a vendor or a shopper, and enjoy a discount on your future orders. Upon your referral’s first purchase, you’ll receive a 10% discount. Invite two friends, and you’ll get an additional 10% discount on your following order. You can continue this process, extending your 10% discount benefits until you reach a maximum of (20) 10% discount.</Typography>
                <FormControl variant="standard" className=''>
                  <Typography variant="label" className='pb-[4px]'>Your personal link</Typography>
                  <TextField
                    placeholder="Paste your invite link"
                    value={inviteLink}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleCopyClick}><img src={icCopy} /></IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions className="!px-[22px] !pb-[32px] sm:!pb-[64px] sm:!px-[80px] !gap-[14px]">
            <DefaultButton value="Cancel" onClick={handleReferralDiscountClose} className="w-full bg-[#F5F5F5] text-heading hover:bg-[#fef0f0]" />
            <DefaultButton value="Copy" onClick={() => {handleCopyClick(); handleReferralDiscountClose();}} className="w-full" />
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </div>
  );
};

export default SidebarLayout;