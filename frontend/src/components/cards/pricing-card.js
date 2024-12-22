import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Grid, Typography } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PropTypes from "prop-types";
import Button from "src/components/button/primary-button";

const PricingCard = ({ listData, pricing }) => {
  const priceLines = pricing.price.split('\n');
  return (
    <>
      <Grid item md={12}>
        <Box className="px-[20px] py-[32px] ss:px-[64px] ss:py-[32px]"
          sx={{
            borderRadius: "16px",
            boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.04)",
            border: "2px solid #00000010",
            height: "100%",
            // padding: "32px 20px",
            fontFamily: "Gilroy",
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <Grid
            container
            spacing={7}
            className="flex justify-between"
          >
            <Grid item md={7} className="grid gap-[16px]">
              <div>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: "500",
                    lineHeight: "25.6px",
                    fontFamily: "Gilroy",
                    color: "#F14445",
                  }}
                >
                  {pricing.type}
                </Typography>
                <p className='text-[22px] ss:text-[30px] ss:leading-[52px] font-semibold text-heading capitalize font-gilroyMedium'>
                  {priceLines.map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < priceLines.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              </div>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: "400",
                  lineHeight: "25.6px",
                  fontFamily: "Gilroy",
                  color: "#8A8A8A",
                }}
              >
                {pricing.description}
              </Typography>
              <Box>
                <Link to={pricing.href}>
                  <Button
                    value={pricing.btn}
                    weight={400}
                    bg={pricing.type === "Shopper" ? "#F5F5F5" : "#F14445"}
                    color={pricing.type === "Shopper" ? "black" : "white"}
                    sx={{
                      "&:hover": {
                        backgroundColor:
                          pricing.type === "Shopper" ? "#F5F5F5" : "#F14445",
                        color: pricing.type === "Shopper" ? "black" : "white",
                      },
                    }}
                  />
                </Link>
              </Box>
            </Grid>
            <Grid item md={5} display="flex" alignItems="center" justifyContent="end">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {listData?.map((list, index) => (
                  <Box
                    key={index} // Added key here
                    sx={{
                      display: "flex",
                      gap: "0.6rem",
                      alignItems: "start",
                    }}
                  >
                    <CheckCircleRoundedIcon
                      sx={{
                        height: "1rem",
                        width: "1rem",
                        marginTop: "7px",
                        color:
                          pricing.type == "Shopper"
                            ? "#8A8A8A"
                            : "#F14445",
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: "0.9rem",
                        lineHeight: "1.8rem",
                        fontFamily: "Gilroy",
                      }}
                    >
                      {list}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </>
  );
};

PricingCard.propTypes = {
  listData: PropTypes.array.isRequired,
  pricing: PropTypes.object.isRequired,
};

export default PricingCard;
