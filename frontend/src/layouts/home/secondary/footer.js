import { Container, Grid, styled, Link, Box, Typography } from '@mui/material';
import React from 'react';
import { logo } from "src/assets";
import { navLinks } from 'src/constants';
import { Link as ScrollLink } from "react-scroll";
import styles from 'src/style';
import { TextConstants } from 'src/constants/textConstants';

const Footer = () => {
  return (
    <>
      <Container maxWidth={false} sx={{
        background: 'rgba(245, 245, 245, 1)',
      }}>
        <div className={`${styles.paddingX} ${styles.flexStart} py-[48px]`}>
          <div className={`${styles.boxWidth}`}>
            <Grid container alignItems={'center'} gap={{ xs: '1rem', lg: '0' }}>
              <Grid item xs={12} lg={3} display={'flex'} justifyContent={{ xs: 'center', lg: 'flex-start' }}>
                <Box sx={{ width: "200px" }}>
                  <ScrollLink to="home" smooth={'true'} duration={500} offset={-70} style={{display: "flex", alignItems: "center", gap: '1rem', cursor: "pointer"}}>
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
                      md: 'row'
                    },
                    alignItems: 'center'
                  }}
                >
                  {navLinks.map((link) => (
                    <ScrollLink
                      key={link.title}
                      to={link.href}
                      smooth={'true'}
                      duration={500}
                      offset={-70} // Adjust the offset to accommodate your fixed header height
                      style={{
                        display: "block",
                        padding: "16px",
                        textDecoration: "none",
                        fontSize: "16px",
                        fontWeight: "400",
                        color: "#666",
                        cursor: "pointer",
                        fontFamily: 'Gilroy-Medium',
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
                  © 2024 All rights reserved
                </Typography>
              </Grid>
            </Grid>
          </div>
        </div>
      </Container>
    </>
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
