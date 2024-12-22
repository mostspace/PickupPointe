import { 
  Box, Button, Card, CardContent, Container, Grid, TextField, Typography, styled,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { ChooseVendorImg, scan, smallscan, Magnifer } from "src/assets";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Pickup } from 'src/assets'

const Products = () => {
  return (
    <>
      <Container
        maxWidth="xl"
        sx={{
          padding: {
            xs: "0px 0",
            md: "120px 0 0 0",
          },
        }}
      >
        
        <div id="features" className="">
          <div className="flex justify-center items-center">
            <h3 className="text-[24px] sm:text-[40px] font-semibold ss:leading-[52px] text-center text-heading pb-[40px] capitalize font-gilroyBold">Discover Unique <br/>Finds From Your Neighbors</h3>
          </div>
        </div>

        <Grid container spacing={2}>
          <Grid item md={5}>  
            <Box
              sx={{
                borderRadius: "16px",
                boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.04)",
                border: "2px solid #00000010",
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                padding: {
                  xs: "15px",
                  md: "24px",
                },
              }}
            >
              <div className="flex gap-3 items-center pb-[10px]">
                <h6 className="text-[19px] ss:text-[24px] font-gilroyMedium">Seamless Order Pickup</h6>
                <img src={Pickup} className="w-[32px] h-[32px]" />
              </div>
              
              <Box
                sx={{
                  width: {
                    xs: "100%",
                    md: "80%",
                  },
                }}
              >
                <Paragraph>
                  Every order will generate a unique pickup QR code. This allows you to check the drop-off status and pickup your order at your local Pickup Pointe location hassle free.
                </Paragraph>
              </Box>
              <Card
                sx={{
                  marginTop: "32px",
                  flexGrow: '1',
                  borderRadius: '12px',
                  boxShadow: '0px 1px 5px 0px rgba(27, 26, 33, 0.1)',
                  padding: {
                    xs: "0",
                    md: "20px",
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      background: "#00000008",
                      padding: {
                        xs: "15px",
                        md: "27.32px",
                      },
                      borderRadius: "13.66px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box sx={{ textAlign: "center", marginBottom: "5px" }}>
                      <Typography
                        sx={{
                          fontSize: "18px",
                          fontWeight: "500",
                          lineHeight: "25.5px",
                          fontFamily: "Gilroy",
                        }}
                        variant="h6"
                        component="div"
                      >
                        Search Your Order
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: {
                          xs: "center",
                          md: "center",
                        },
                        gap: "5px",
                      }}
                    >
                      <TextField
                        sx={{
                          width: "100%",
                          // Set the width to your desired size
                          "& .MuiInputBase-root": {
                            height: "30px", // Set the height to your desired size
                          },
                          "& .MuiOutlinedInput-input": {
                            padding: "10px", // Adjust padding to ensure text is not cut off
                          },
                        }}
                      />
                      <Box
                        sx={{
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "5px  ",
                          width: "35px",
                          height: "30px",
                          background: "#F14445",
                          borderRadius: "4.55px",
                          "&:hover": {
                            backgroundColor: "#F14445", // Set the background color on hover
                          },
                        }}
                      >
                        <img src={Magnifer} className="w-[15px] h-[15px]"/>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ marginTop: "22.77px" }}>
                    <Button sx={{ 
                      color: "#181818",
                      textTransform: "unset",
                      fontFamily: "Gilroy",
                      fontWeight: '400',
                    }}>
                      <ArrowBackIosIcon sx={{ 
                          fontSize: "10px",
                          marginRight: "5px",
                        }} /> Back
                    </Button>

                    <Box
                      sx={{
                        border: "1px solid #A3A3A370",
                        padding: "8px 11px",
                        borderRadius: "6.83px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingBottom: "5px",
                        }}
                      >
                        <Paragraph
                          sx={{
                            fontSize: "11px",
                            color: "#181818",
                            fontFamily: "Gilroy",
                            fontWeight: '400',
                            lineHeight: "14.57px",
                          }}
                        >
                          Pickup Pointe Store #32322
                        </Paragraph>
                        <Paragraph
                          sx={{
                            fontSize: "11px",
                            fontFamily: "Gilroy",
                            color: "#3ACC48",
                            fontWeight: '400',
                            lineHeight: "14.57px",
                          }}
                        >
                          Ready To Pick up
                        </Paragraph>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Paragraph
                          sx={{
                            fontSize: "10px",
                            color: '#A3A3A3',
                            fontFamily: "Gilroy",
                            fontWeight: '400',
                            lineHeight: "12.75px",
                          }}
                        >
                          7384 Hayward Way, Laguna CA, 93453
                        </Paragraph>
                        <Paragraph
                          sx={{
                            textAlign: "right",
                            fontSize: "10px",
                            color: "#181818",
                            display: "flex",
                            alignItems: "center",
                            fontFamily: "Gilroy",
                            fontWeight: '400',
                            gap: "3px",
                            lineHeight: "12.75px",
                          }}
                        >
                          curbside/drive-thru eligible{" "}
                          <CheckCircleOutlineIcon
                            sx={{
                              fontSize: "10px",
                              marginTop: "2px",
                            }}
                          />
                        </Paragraph>
                      </Box>
                      <Box sx={{
                        margin: "7px 0",
                        borderTop: '0.5px solid rgba(0, 0, 0, 0.08)'
                      }}>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: "15px",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            width: {
                              xs: "100%",
                              md: "40%",
                            },
                          }}
                        >
                          <img src={smallscan} className="mb-[7px]"/>
                          <Typography
                            sx={{
                              fontSize: "10px",
                              lineHeight: "12.75px",
                              fontFamily: "Gilroy",
                              fontWeight: '400',
                            }}
                          >
                            Scan QR code and confirm pickup name upon arrival to the location.
                          </Typography>
                        </Box>
                        <img src={scan}/>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>
          <Grid item md={7}>
            <Box
              sx={{
                borderRadius: "16px",
                boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.04)",
                border: "2px solid #00000010",
                padding: {
                  xs: "15px",
                  md: "24px",
                },
                height: "100%",
              }}
            >
              <div className="flex gap-3 items-center pb-[10px]">
                <h6 className="text-[19px] ss:text-[24px] font-gilroyMedium">Discover Nearby Merchants 🍕</h6>
              </div>
              <Box
                sx={{
                  width: {
                    xs: "100%",
                    md: "52%",
                  },
                }}
              >
                <Paragraph>
                  Explore local treasures, support your community, and find amazing eateries right in your backyard.
                </Paragraph>
              </Box>
              <Box sx={{ marginTop: "32px" }}>
                <StyledImage src={ChooseVendorImg} alt="img" />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

const Paragraph = styled(Typography)(() => ({
  fontSize: "16px",
  fontWeight: "400",
  lineHeight: "25.6px",
  fontFamily: "Gilroy",
  color: "#8A8A8A",
}));

const StyledImage = styled("img")({
  width: "100%",
  maxWidth: "100%",
});

export default Products;
  