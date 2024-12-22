import { Avatar, Box, Typography } from "@mui/material";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import PropTypes from "prop-types";

const Card = ({ name, date, rating, review, img }) => {
  return (
    <>
      <Box
        sx={{
          borderRadius: "16px",
          boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.04)",
          border: "2px solid #00000010",
          height: "100%",
          padding: "24px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <Avatar
              alt="Cindy Baker"
              src={img}
              sx={{ height: "64px", width: "64px" }}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#181818",
                  fontSize: "18px",
                  fontFamily: "Gilroy",
                  fontWeight: "500",
                  lineHeight: "22px",
                }}
              >
                {name}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "#8A8A8A",
                  fontSize: "14px",
                  fontFamily: "Gilroy",
                  fontWeight: "400",
                  lineHeight: "22.4px",
                }}
              >
                {" "}
                {date}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: "7.5px",
              alignItems: "center",
            }}
          >
            <StarBorderRoundedIcon sx={{ color: "#181818" }} />
            <Typography
              sx={{
                color: "#181818",
                fontSize: "20px",
                fontFamily: "Gilroy",
                fontWeight: "500",
                lineHeight: "22px",
              }}
            >
              {rating}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ marginTop: "24px" }}>
          <Typography
            sx={{
              color: "#8A8A8A",
              fontSize: "16px",
              fontFamily: "Gilroy !important",
              fontWeight: "400",
              lineHeight: "25.6px",
            }}
          >
            {review}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

Card.propTypes = {
  name: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  rating: PropTypes.string.isRequired,
  review: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
};

export default Card;
