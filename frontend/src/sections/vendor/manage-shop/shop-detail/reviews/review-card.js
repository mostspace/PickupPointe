import React, {useState } from 'react';
import { Avatar, Box, Typography, IconButton, Popover, MenuItem, Divider } from "@mui/material";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import PropTypes from "prop-types";

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const ReviewCard = ({ name, date, rating, review, img }) => {

  // Orders Download Menu
  const [openReviewMoreMenu, setOpenReviewMoreMenu] = useState(null);

  const handleReviewMoreMenuOpen = (event) => {
    setOpenReviewMoreMenu(event.currentTarget);
  };

  const handleReviewMoreMenuClose = () => {
    setOpenReviewMoreMenu(null);
  };

  return (
    <>
      <Box className="flex flex-col justify-between"
        sx={{
          borderRadius: "16px",
          boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.04)",
          border: "2px solid #00000010",
          height: "100%",
          padding: "24px",
        }}
      >
        <div className="">
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
                alt="avatar"
                src={img}
                sx={{ height: "52px", width: "52px" }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <Typography
                  sx={{
                    color: "#181818",
                    fontSize: "16px",
                    fontFamily: "Gilroy",
                    fontWeight: "500",
                    lineHeight: "25px",
                  }}
                >
                  {name}
                </Typography>
                <Typography
                  sx={{
                    color: "#666",
                    fontSize: "12px",
                    fontFamily: "Gilroy",
                    fontWeight: "400",
                    lineHeight: "19.2px",
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
                  fontSize: "18px",
                  fontFamily: "Gilroy",
                  fontWeight: "500",
                  lineHeight: "27px",
                }}
              >
                {rating}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ marginTop: "24px" }}>
            <Typography
              sx={{
                color: "#666",
                fontSize: "14px",
                fontFamily: "Gilroy !important",
                fontWeight: "400",
                lineHeight: "22.4px",
              }}
            >
              {review}
            </Typography>
          </Box>
        </div>
        <div className="flex justify-end">
          <IconButton onClick={handleReviewMoreMenuOpen}><MoreHorizIcon/></IconButton>
        </div>
      </Box>

      <Popover
        open={Boolean(openReviewMoreMenu)}
        anchorEl={openReviewMoreMenu}
        onClose={handleReviewMoreMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 155,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
              fontFamily: 'Gilroy'
            },
          },
        }}
      >     
        <MenuItem onClick={handleReviewMoreMenuClose}>
          Respond
        </MenuItem>
        <MenuItem onClick={handleReviewMoreMenuClose}>
          Report
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleReviewMoreMenuClose} className='text-primary'>
          Request to remove
        </MenuItem>
      </Popover>
    </>
  );
};

ReviewCard.propTypes = {
  name: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  rating: PropTypes.string.isRequired,
  review: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
};

export default ReviewCard;
