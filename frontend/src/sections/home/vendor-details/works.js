import React, { useReducer } from "react";
import { useNavigate } from 'react-router-dom';
import {
   Box, Container, Grid, styled, Tab, Tabs, Typography,
} from "@mui/material";
import {
  Timeline, TimelineItem, TimelineSeparator, TimelineDot, TimelineConnector, TimelineContent,
} from "@mui/lab";
import { stepReducer, initialState } from "src/reducers/stepReducer";
import { 
  RegisterShopperImg, ChooseVendorImg, SelectProductsImg, SelectLocationImg, MakeOrderImg, RegisterVendorImg, ListProductsImg, ManageOrdersImg, ReceivePaymentsImg
} from "src/assets";
import Button from "src/components/button/primary-button";


const steps = {
  shopper: [
    { heading: "Register your account", paragraph: "Sign up for a Pickup Pointe account to explore local, quality vendors and artisan merchants right in your own neighborhood.",},
    { heading: "Choose vendor", paragraph: "Browse through our curated selection of trusted local vendors to find quality products." },
    { heading: "Select items", paragraph: "Explore each vendor's product offerings and select your desired products with just a few clicks." },
    { heading: "Select Pickup or Delivery", paragraph: "After selecting your items, choose Pickup or Delivery and schedule your order with the merchant." },
    { heading: "Make order", paragraph: "Once you've selected a pickup day and location, have your QR code handy with your pickup name and we'll have your order ready for you." },
  ],
  vendor: [
    { heading: "Register your account", paragraph: "Join our platform to start reaching new customers and growing your business." },
    { heading: "Configure your location details", paragraph: "Set up your pickup locations and schedules to ensure seamless product delivery." },
    { heading: "Manage your products", paragraph: "Use our intuitive tools to add, update, and organize your product listings." },
    { heading: "Customize your pickups and deliveries", paragraph: "Monitor incoming orders and plan your deliveries seamlessly without being taken to cleaners in non-sense fees." },
  ],
};

const images = {
    shopper: [
      RegisterShopperImg,
      ChooseVendorImg,
      SelectProductsImg,
      SelectLocationImg,
      MakeOrderImg,
    ],
    vendor: [
      RegisterVendorImg,
      ListProductsImg,
      ManageOrdersImg,
      ReceivePaymentsImg,
    ],
};

const Works = () => {
  const [state, dispatch] = useReducer(stepReducer, initialState);
  const navigate = useNavigate();

  const handleNext = () => {
    const nextStep = state.steps[state.activeTab] + 1;
    
    if (state.steps[state.activeTab] === steps[state.activeTab].length - 1) {
      const route = state.activeTab === "shopper" ? "/register/shopper-register": "/register/vendor-register";
      navigate(route);
    }
    if (nextStep < steps[state.activeTab].length) {
      dispatch({
        type: "SET_STEP",
        payload: { role: state.activeTab, step: nextStep },
      });
    }
  };

  const handleTabChange = (event, newValue) => {
    dispatch({ type: "SET_TAB", payload: newValue });
  };

  const handleTimelineClick = (step) => {
    dispatch({ type: "SET_STEP", payload: { role: state.activeTab, step } });
  };

  return (
    <Container 
      maxWidth="xl"
      sx={{
        padding: {
          xs: "40px 0",
          md: "120px 0 0 0",
        },
      }}>
      <Grid container spacing={4}>
        <Grid item lg={4} display={"flex"} alignItems={"center"} className="font-gilroy">
        <div id="how-it-works">
          <Box>
            <SubHeading>How It Works</SubHeading>
            <Tabs
              value={state.activeTab}
              onChange={handleTabChange}
              sx={{
                marginTop: {
                  xs: "15px",
                  md: "24px",
                },
                "& .MuiTabs-scroller .MuiTabs-indicator": {
                  background: "#f14445",
                },
                "& .MuiButtonBase-root": {
                  textTransform: "capitalize",
                },
                fontFamily: "Gilroy",
              }}
            >
              <StyledTab 
                label="Shopper" 
                value="shopper" 
                sx={{
                  fontFamily: "Gilroy",
                  fontSize: "16px",
                  letterSpacing: "unset",
                  lineHeight: "unset",
                  minWidth: "unset",
                  padding: "8px 16px",
                  marginRight: "20px"
                }}
              />
              <StyledTab 
                label="Vendor"
                value="vendor" 
                sx={{
                  fontFamily: "Gilroy",
                  fontSize: "16px",
                  letterSpacing: "unset",
                  lineHeight: "unset",
                  minWidth: "unset",
                  padding: "8px 16px",
                }}
              />
            </Tabs>
            <Timeline
              sx={{
                margin: "24px 0 0 0",
                padding: "0",
              }}
            >
              {steps[state.activeTab].map((step, index) => (
                <TimelineItem
                  key={index}
                  onClick={() => handleTimelineClick(index)}
                  sx={{
                    cursor: "pointer",
                    "&::before": { content: "none" },
                  }}
                >
                  <TimelineSeparator>
                    <TimelineDot
                      color={
                        index <= state.steps[state.activeTab]
                          ? "primary"
                          : "grey"
                      }
                      sx={{
                        boxShadow: 'none',
                        '&.MuiTimelineDot-filledPrimary': {
                          background: '#f14445'
                        },
                        '&.MuiTimelineDot-filledGrey': {
                          background: '#eaeaeb'
                        }
                      }}
                    />
                    {index < steps[state.activeTab].length - 1 && (
                      <TimelineConnector />
                    )}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography
                      color={
                        index <= state.steps[state.activeTab]
                          ? "#181818"
                          : "#666666"
                      }
                      variant="h3"
                      sx={{
                        fontSize: {xs: '16px', md: "20px"},
                        fontWeight: "500",
                        marginBottom: "8px",
                        fontFamily: "Gilroy",
                      }}
                    >
                      {step.heading}
                    </Typography>
                    <Typography
                      color={
                        index <= state.steps[state.activeTab]
                          ? "#8a8a8a"
                          : "rgba(138, 138, 138, 0.5)"
                      }
                      variant="body1"
                      sx={{ 
                        fontSize: {xs: '14px', md: "16px"},
                        fontFamily: "Gilroy",
                      }}
                    >
                      {step.paragraph}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
            <Box sx={{ marginTop: {xs: '1rem', md: '2rem'}, marginLeft: '1.4rem' }}>
              <Button
                value="Get started"
                weight={600}
                bg={"rgba(241, 68, 69, 1)"}
                color={"#fff"}
                click={handleNext}
                disabled={
                  state.steps[state.activeTab] ===
                  steps[state.activeTab].length - 1
                }
              />
            </Box>
          </Box>
          </div>
        </Grid>
        <Grid item lg={8}
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}  
        >
          <StyledImage
            src={images[state.activeTab][state.steps[state.activeTab]]}
            alt="How it works illustration"
          />
        </Grid>
      </Grid>
    </Container>
  );
};

const StyledImage = styled("img")({
  width: "100%",
  maxWidth: "100%",
});

const SubHeading = styled("h2")(({ theme }) => ({
  fontSize: "40px",
  lineHeight: "52px",
  fontFamily: 'Gilroy-Bold',
  [theme.breakpoints.down("md")]: {
    fontSize: "20px",
    fontFamily: "Gilroy",
    lineHeight: "28px",
  },
  fontWeight: "600",
  color: "rgba(24, 24, 24, 1)",
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  color: "#8a8a8a",
  fontWeight: "normal",
  "&.Mui-selected": {
    color: "#181818",
    fontWeight: "bold",
  },
  "&:not(.Mui-selected)": {
    borderBottom: "2px solid transparent",
  },
  "&:hover": {
    color: "#181818",
  },
}));

export default Works;