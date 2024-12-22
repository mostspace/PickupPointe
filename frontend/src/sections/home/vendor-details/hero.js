import { Box, Container, styled } from "@mui/material";
import { Link } from 'react-router-dom';
import React from "react";
import Button from "src/components/button/primary-button";

const Hero = () => {
  return (
    <>     
      <Container maxWidth="xl" sx={{ padding: "0" }}>
        <Box
          sx={{
            width: {
              xs: "100%",
              md: "70%",
            },
            margin: "auto",
            padding: { xs: "42px 0", lg: "64px 0 " },
          }}
        >
          <FontSixteen>Get Quality. Get Local.</FontSixteen>
          
          <MainHeading>
            Your Local Food Drops And <br/>Pickups Made Simple
          </MainHeading>
          <div className="flex justify-center items-center gap-1">
            <Paragraph>
              Created by local business, for local business ❤️
            </Paragraph>
          </div>
          <Box
            sx={{
              display: "flex",
              justifyContent: 'center',
              marginTop: {
                xs: '16px',
                md: '32px'
              }
            }}
          >
            <Link to="/register">
              <Button
                value={"Join the movement"}
                weight={600}
                bg={"rgba(241, 68, 69, 1)"}
                color={"#fff"}
              />
            </Link>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Hero;

const FontSixteen = styled("p")(({ theme }) => ({
  fontSize: "16px",
  fontFamily: 'Gilroy-Medium',
  fontWeight: "500",
  textAlign: "center",
  color: "rgba(241, 68, 69, 1)",
}));
const Paragraph = styled("p")(({ theme }) => ({
  fontsize: "18px",
  [theme.breakpoints.down("sm")]: {
    fontSize: "14px",
  },
  fontWeight: "400",
  textAlign: "center",
  color: "rgba(138, 138, 138, 1)",
}));

const MainHeading = styled("h1")(({ theme }) => ({
  fontSize: "48px",
  lineHeight: "62px",
  fontFamily: 'Gilroy-Bold',
  [theme.breakpoints.down("md")]: {
    fontSize: "24px",
    lineHeight: "32px",
  },
  fontWeight: "600",
  textAlign: "center",
  color: "rgba(24, 24, 24, 1)",
  margin: "12px 0",
}));
