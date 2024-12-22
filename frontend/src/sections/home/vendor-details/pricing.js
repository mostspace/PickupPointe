import { Box, Container, Grid } from "@mui/material";
import PricingCard from "src/components/cards/pricing-card";
import { landingDog, landingMealTogo, landingPackagedBeef, landingSoaps, landingDoughb, landingFundhound, landingJams, landing2_1, landing2_2, landing2_3, landing2_4, landing2_5, landing2_6, landing2_7, landing3_1, landing3_2, landing3_3, landing3_4, landing3_5, landing3_6, landing3_7, } from "src/assets";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const data = [
  {
    type: "Shopper",
    price: "Free Marketplace access",
    description:
      "Free for shoppers, the only cost is the time it takes to choose which quality products you love more.",
    btn: "Start shopping local",
    href: "/order-local",
    listData: [
      "Search our growing marketplace of local merchants and quality products",
      "Plan your pickups around your schedule",
      "Review and brag about your favorite merchants",
      "Access exclusive merchant discounts",
    ],
  },
  {
    type: "Merchant Basic",
    price: "Zero monthly fees. \nFlat 4.5% + .50 cents per order",
    description:
      "We are proud to say we aren’t backed by big venture capital — our roots are as humble as yours, which is why we offer the lowest platform fees in the industry. Our transparent pricing model means more of your hard-earned money stays in your pocket, helping you fulfill orders and expand your business with ease.",
    btn: "Become a merchant",
    href: "/register",
    listData: [
      "Free Pickup Pointe Marketplace leads",
      "Order scheduling & pickup tracking",
      "Inventory management",
      "Pickup location manager",
      "Pickup/Delivery notifications",
      "Business Branded Storefront with Seamless Order Integrations to Square, Clover and Toast point-of-sale systems.",
      "Provide friction-free purchasing with auto-pay & auto-pickup options to your returning customers",
      "No robots, only real human customer support",
    ],
  },
];

const images = [
  { layer: 1, src: landingMealTogo },
  { layer: 1, src: landingDoughb },
  { layer: 1, src: landingFundhound, },
  { layer: 1, src: landingSoaps },
  { layer: 1, src: landingDog },
  { layer: 1, src: landingPackagedBeef },
  { layer: 1, src: landingJams },
  { layer: 2, src: landing2_1 },
  { layer: 2, src: landing2_2 },
  { layer: 2, src: landing2_3 },
  { layer: 2, src: landing2_4 },
  { layer: 2, src: landing2_5 },
  { layer: 2, src: landing2_6 },
  { layer: 2, src: landing2_7 },
  { layer: 3, src: landing3_1 },
  { layer: 3, src: landing3_2 },
  { layer: 3, src: landing3_3 },
  { layer: 3, src: landing3_4 },
  { layer: 3, src: landing3_5 },
  { layer: 3, src: landing3_6 },
  { layer: 3, src: landing3_7 },
];

const ImageLine = ({ layer }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const layerImages = images.filter((image) => image.layer === layer);
  const displayedImages = isMobile ? layerImages.slice(0, 4) : layerImages;

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      wrap="nowrap"
      sx={{
        overflowX: "auto",
        width: "100%",
        padding: "0 15px",
        gap: "5px",
        '@media (max-width: 600px)': {
          flexWrap: 'nowrap',
        },
      }}
    >
      {displayedImages.map((item, index) => (
        <Grid
          key={index}
          item
          xs={6}
          sm={3}
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "3px",
            '& > img': {
              width: "100%",
              height: "auto",
              maxWidth: "100%",
            },
          }}
        >
          <img
            loading="lazy"
            src={item.src}
            className="rounded-[4px]"
            alt={`img-${index}`}
          />
        </Grid>
      ))}
    </Grid>
  );
};



const Pricing = () => {
  return (
    <>
      <Container
        maxWidth="xl"
        sx={{
          padding: {
            xs: "24px 0",
            md: "120px 0",
          },
        }}
      >
        <div id="pricing" className="mb-[60px] sm:mb-0 grid gap-[40px] ss:gap-[120px]">
          <Box className="grid gap-[40px]">
            <div className="grid ss:grid-cols-2">
              <div className="pb-[40px] ss:pb-0">
                <h3 className="text-heading font-semibold ss:leading-[52px] text-[24px] ss:text-[40px] text-center sm:text-left capitalize font-gilroyBold">Discover local gems <br/>and return to your roots</h3>
              </div> 
              <div>
                <p className="text-[18px] leading-[28px] font-normal text-gray-400">Support local. Shoppers enjoy free access to our vibrant marketplace of what makes the backbone of the hospitality industry. For restaurants and eateries, the freedom to customize your own pickups seamlessly with your existing POS systems comes at no extra cost. Scale your pickup and delivery channels effortlessly, bypass the stress of nickle and dime fees, and let your customers enjoy an affordable, local alternative.</p>
              </div>
            </div>

            <Grid container justifyContent="center" alignContent="center">
              <ImageLine layer={1} />
            </Grid>

            <Grid container spacing={1}>
              {data?.map((pricing, index) => (
                <PricingCard
                  key={index} // Added key here
                  listData={pricing.listData}
                  pricing={pricing}
                  href={pricing.href}
                />
              )).slice(0, 1)}
            </Grid>
          </Box>

          <Box className="grid gap-[40px]">
            <div className="grid">
              <div>
                <h3 className="text-heading font-semibold ss:leading-[52px] text-[24px] ss:text-[40px] text-center capitalize font-gilroyBold">Access Your Local Community, Without Compromising Your Bottom-Line - How It Should Be.</h3>
              </div>
            </div>

            <Grid container justifyContent="center">
              <ImageLine layer={2} />
            </Grid>

            <Grid container spacing={1} className="grid gap-[15px] ss:gap-[40px]">
              {data?.map((pricing, index) => (
                <PricingCard
                  key={index} // Added key here
                  listData={pricing.listData}
                  pricing={pricing}
                />
              )).slice(1, 2)}

              <Grid container justifyContent="center">
                <ImageLine layer={3} />
              </Grid>

              <Grid container spacing={1}>
                {data?.map((pricing, index) => (
                  <PricingCard
                    key={index} // Added key here
                    listData={pricing.listData}
                    pricing={pricing}
                    href={pricing.href}
                  />
                )).slice(2, 3)}
              </Grid>

              {/* <Grid item md={12}>
                <Box className="px-[20px] py-[32px] ss:px-[64px] ss:py-[32px]"
                  sx={{
                    borderRadius: "16px",
                    boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.04)",
                    border: "2px solid #00000010",
                    height: "100%",
                    fontFamily: "Gilroy",
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <Grid
                    container
                    spacing={5}
                    className="flex justify-between"
                  >
                    <Grid item md={7} className="gap-[16px]">
                      <div>
                        <Typography
                          sx={{
                            fontSize: "16px",
                            fontWeight: "500",
                            lineHeight: "25.6px",
                            fontFamily: "Gilroy",
                            color: "#F14445",
                            paddingBottom: "5px",
                          }}
                        >
                          Vendor Pro
                        </Typography>
                        <p className='text-[22px] ss:text-[30px] ss:leading-[52px] font-semibold text-heading capitalize pb-5'>
                          Starting at $50 Shelf/Month
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
                        Designed for growing businesses that value physical storage space and additional support to manage their order pickups efficiently. You will enjoy everything in Vendor Basic, plus the ability to use any of our local Pickup Pointe locations to help you cut your delivery costs and pickup time in half. Set your order drop-offs in a nearby location, and let us worry about the rest.
                      </Typography>

                      <div className="my-[32px]">
                        <p className="text-[14px] text-heading font-medium leading-[24px] pb-[16px]">Everything in basic plus:</p>
                        <Grid item md={12} display="flex" alignItems="center">
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "end",
                              flexDirection: "column",
                              gap: "12px",
                            }}
                          >
                            {data[2].listData?.map((list, index) => (
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
                                    color: "#F14445",
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
                      </div>
                      
                      <Box>
                        <Link to="/register/vendor-register">
                          <Button
                            value={"Become a Pro"}
                            weight={400}
                            bg={"rgba(241, 68, 69, 1)"}
                            color={"#fff"}
                          />
                        </Link>
                      </Box>
                    </Grid>
                    <Grid item md={5} display="flex" alignItems="center" justifyContent="end">
                      <img src={pricingVenderPro} className="w-[427px]" />
                    </Grid>
                  </Grid>
                </Box>
              </Grid> */}
            </Grid>
          </Box>
        </div>
      </Container>
    </>
  );
};

export default Pricing;
