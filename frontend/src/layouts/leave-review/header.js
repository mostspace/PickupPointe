import React from "react";
import { Link, NavLink as RouterLink } from 'react-router-dom';
// Asset
import { logo } from "src/assets";
// @mui
import {
  Box, styled, Container
} from '@mui/material';
import { TextConstants } from "src/constants/textConstants";

const Header = () => {

  return (
    <>
      <div className="flex justify-center items-start">
        <div className="max-w-[768px] w-full">
          <Container
            className={`relative rounded-[16px]`}
            sx={{
              top: { xs: '0', md: '0' },
              left: { xs: '0', md: '50%' },
              zIndex: '1000',
              transform: { xs: 'unset', md: 'translateX(-50%)' },
              padding: { xs: '16px 24px', md: '16px 32px' },
              background: '#fff',
              width: { xs: '100%', md: '100%' },
            }}
          >
            <Box sx={{ width: "200px" }}>
              <Link to="/leave-review" smooth={'true'} duration={500} offset={-70} style={{display: "flex", alignItems: "center", cursor: "pointer"}} className="gap-[12px]">
                <StyledImage src={logo} alt="Logo" style={{ cursor: "pointer", width: "44px", height: "33px" }} />
                <span style={{fontWeight: "600"}} className="text-[18px] font-gilroyMedium">{TextConstants.PICKUPPOINTE}</span>
              </Link>
            </Box>
          </Container>
        </div>
      </div>
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