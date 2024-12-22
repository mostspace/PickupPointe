import React, { useState } from 'react';
import { Avatar, Box, Typography, IconButton, Popover, MenuItem, Divider } from "@mui/material";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PropTypes from "prop-types";

const ReviewCard = ({ name, date, rating, review, avatar }) => {
  // Orders review menu
  const [openReviewMoreMenu, setOpenReviewMoreMenu] = useState(null);
  const handleReviewMoreMenuOpen = (event) => setOpenReviewMoreMenu(event.currentTarget);
  const handleReviewMoreMenuClose = () => setOpenReviewMoreMenu(null);

  return (
    <>
      <Box
        sx={{
          borderRadius: "16px",
          boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.04)",
          border: "2px solid #00000010",
          height: "240px", // Fixed height for consistency
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "24px",
        }}
      >
        <Box>
          {/* Header */}
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
                src={avatar}
                sx={{ height: "52px", width: "52px" }}
              />
              <Box>
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
                  {date}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: "7.5px" }}>
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

          {/* Review Content */}
          <Box
            sx={{
              marginTop: "16px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 4, // Limits the text to 4 lines
              WebkitBoxOrient: "vertical",
            }}
          >
            <Typography
              sx={{
                color: "#666",
                fontSize: "14px",
                fontFamily: "Gilroy",
                fontWeight: "400",
                lineHeight: "22.4px",
              }}
            >
              {review}
            </Typography>
          </Box>
        </Box>

        {/* More Menu */}
        <Box className="flex justify-end">
          <IconButton onClick={handleReviewMoreMenuOpen}>
            <MoreHorizIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Popover */}
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
        <MenuItem onClick={handleReviewMoreMenuClose}>Respond</MenuItem>
        <MenuItem onClick={handleReviewMoreMenuClose}>Report</MenuItem>
        <Divider />
        <MenuItem onClick={handleReviewMoreMenuClose} className="text-primary">
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
  avatar: PropTypes.string.isRequired,
};

export default ReviewCard;
