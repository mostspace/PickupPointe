import { Box, Container, Grid, Typography, styled } from "@mui/material";
import { vendor, icSmile } from "src/assets";

const Vendor = () => {
  return (
    <>
      <Container
        maxWidth="xl"
        sx={{
          padding: {
            xs: "15px 0",
            md: "20px 0 0 0",
          },
        }}
      >
        <Box
          sx={{
            borderRadius: "16px",
            boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.04)",
            border: "2px solid #00000010",
            padding: {
              xs: "15px",
              md: "24px",
            },
          }}
        >
          <Grid container spacing={2}>
            <Grid
              item
              md={4}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="start"
            >
              <div className="flex gap-3 items-center pb-[10px]">
                <h6 className="text-[19px] ss:text-[24px] font-gilroyMedium">Community tested</h6>
                <img src={icSmile} className="w-[32px] h-[32px]" />
              </div>  
              <Paragraph>
                Bigger is not always better. Just like us, most of our vendors are not venture backed, but their menu’s remain world class. Join our growing community of mom and pops and enjoy home-grown, locally  prepared dishes.
              </Paragraph>
            </Grid>
            <Grid item md={8}>
              <Box>
                <StyledImage src={vendor} alt="vendor" />
              </Box>
            </Grid>
          </Grid>
        </Box>
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
  height: "auto",
  maxWidth: "100%",
  objectFit: "contain"
});

export default Vendor;