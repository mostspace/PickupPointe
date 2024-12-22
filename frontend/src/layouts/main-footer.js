import { Grid, styled, Box, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link as ScrollLink } from "react-scroll";
import { logo } from "src/assets";
import { homeFooterNavLinks } from 'src/constants';
import { TextConstants } from 'src/constants/textConstants';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <Box className='w-full bg-white rounded-[24px] p-[15px] py-[48px] sm:px-[24px] lg:px-[48px]'>
      <Grid container alignItems={'center'} gap={{ xs: '1rem', lg: '0' }}>
        <Grid item xs={12} lg={3} display={'flex'} justifyContent={{ xs: 'center', lg: 'flex-start' }}>
          <Box sx={{ width: "200px" }}>
            <ScrollLink onClick={() => navigate('/')} smooth={'true'} duration={500} offset={-70} style={{display: "flex", alignItems: "center", gap: '1rem', cursor: "pointer"}}>
              <StyledImage src={logo} alt="Logo" style={{ cursor: "pointer", width: "44px", height: "33px" }} />
              <span style={{fontWeight: "600", fontSize: "18px"}} className='font-gilroyBold'>{TextConstants.PICKUPPOINTE}</span>
            </ScrollLink>
          </Box>
        </Grid>
        <Grid item xs={12} lg={6} display={'flex'} justifyContent={'center'}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: {
                xs: 'column',
                sm: 'row'
              },
              alignItems: 'center'
            }}
          >
            {homeFooterNavLinks.map((link, index) => (
              <ScrollLink
                key={index}
                onClick={() => navigate(`/${link.href}`)}
                smooth={'true'}
                duration={500}
                className='hover:!text-heading hover:!underline'
                offset={-70} // Adjust the offset to accommodate your fixed header height
                style={{
                  display: "block",
                  padding: "16px",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "400",
                  color: "#666",
                  cursor: "pointer"
                }}
              >
                {link.title}
              </ScrollLink>
            ))}
          </Box>
        </Grid>
        <Grid item xs={12} lg={3} display={'flex'} justifyContent={{ xs: 'center', lg: 'flex-end' }}>
          <Typography sx={{
            color: 'rgba(138, 138, 138, 1)',
            fontSize: '14px',
            fontFamily: 'Gilroy',
          }}>
            © 2024 Pickup Pointe
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Footer;

const StyledImage = styled('img')(({ theme }) => ({
  width: '100%',
  maxWidth: '200px',
  [theme.breakpoints.down('sm')]: {
    maxWidth: '130px',
  },
}));