import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, Typography } from "@mui/material";
import Community from "../Cummunity";

const CustomSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
  };

  return (
    <Box sx={{marginTop: "5rem"}}>

      <Box sx={{ textAlign: "center"}}>
        <Typography
          variant="h3"
          sx={{
            color: "#181818",
            fontSize: "40px",
            fontWeight: "600",
            marginBottom: "2rem"
            
          }}
        >
          Words From Your Community{" "}
        </Typography>
      </Box>
      <Slider {...settings}>
        <Box>
          <Community />
        </Box>
        <Box>
          <Community />
        </Box>
        <Box>
          <Community />
        </Box>
      </Slider>
    </Box>
  );
};

export default CustomSlider;
