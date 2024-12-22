import React, { useState, useCallback, useEffect } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import moment from "moment";
import { toast } from "react-toastify";
// Components
import ReviewCard from "./reviews/review-card";
import Pagination from 'src/components/pagination/';
import DropdownMenu from "src/components/dropdown-menu";
import Reviews from "./reviews";
// Assets
import { UploadImg  } from 'src/assets';
// Icons
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
// @mui
import {
  Typography, IconButton, Grid, Button, Avatar
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
// Assets
import { icStar, icFacebook, icInstagram, icTwitter, icYoutube } from 'src/assets';
import { REVIEWS_SORT_OPTIONS } from "src/_mock/assets";
// Reducers
import { fetchReviewsByShop } from "src/reducers/reviewSlice";

// ------------------------------------------------------------------------------------------------------------------------------------------

export default function Main() {
  const location = useLocation();
  const shopData = location.state.shop;
  const shopId = shopData._id;

  const dispatch = useDispatch();

  // Redirect previous page
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  // Reviews SortBy
  const [sortBy, setSortBy] = useState('Reviews rating');

  const handleSortBy = useCallback((newValue) => {
    setSortBy(newValue);
  }, []);

  // Reviews
  const { reviews, totalResults, status, error } = useSelector((state) => state.reviews);

  useEffect(() => {
    dispatch(fetchReviewsByShop({ shopId, page: 1, pageSize: 4, sortKey: 'latest' }));
  }, [shopId, dispatch]);

  const handleCopyClick = () => {
    navigator.clipboard.writeText('https://www.pickuppointe.com/find-local-vendors/vendor-profile/' + shopData._id)
    .then(() => {
      toast("Storefront link copied to clipboard!", {
        theme: "light",
        style: {
          backgroundColor: "white",
          color: "primary",
          fontFamily: 'Gilroy',
          fontSize: '14px',
        },
      });
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });
  };

  return (
    <div className="flex flex-col gap-[40px]">
      <div className="w-full flex flex-col md:flex-row justify-between gap-[24px] items-start">
        <IconButton onClick={handleBack}><KeyboardBackspaceIcon className="text-[28px] text-heading"/></IconButton>
        <div className="flex flex-wrap gap-3">
          <Button
            sx={{
              padding: "8px 20px",
              fontFamily: "Gilroy",
              fontSize: "14px",
              color: "#181818",
              borderRadius: "8px",
              backgroundColor: "#F5F5F5",
              textTransform: "unset",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
            onClick={handleCopyClick}
            endIcon={<ContentCopyIcon className="text-heading w-[15px]" />}
          > 
            Copy storefront link
          </Button>
          <Button
            sx={{
              padding: "8px 20px",
              fontFamily: "Gilroy",
              fontSize: "14px",
              color: "#181818",
              borderRadius: "8px",
              backgroundColor: "#F5F5F5",
              textTransform: "unset",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
            onClick={() =>
              window.open(`/find-local-vendors/vendor-profile/${shopData._id}`, "_blank")
            }
          >
            See public view
          </Button>

          <Button
            sx={{
              padding: "8px 20px",
              fontFamily: "Gilroy",
              fontSize: "14px",
              color: "#181818",
              borderRadius: "8px",
              backgroundColor: "#F5F5F5",
              textTransform: "unset",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
            onClick={() => navigate("edit-shop-details", {state: shopData})}
          >
            Edit shop details
          </Button>
          <Button
            sx={{
              padding: "8px 20px",
              fontFamily: "Gilroy",
              fontSize: "14px",
              color: "#ffffff",
              borderRadius: "8px",
              backgroundColor: "#F14445",
              textTransform: "unset",
              overflow: "hidden",
              whiteSpace: "nowrap",
              "&:hover": {
                backgroundColor: "#E13031",
              },
            }}
          >
            Submit for approval
          </Button>
        </div>
      </div>
      <Grid container rowSpacing={6} columnSpacing={{ xs: 1, sm: 2, md: 8 }} justifyContent={"space-between"}>
        <Grid item md={4} sm={12} xs={12}>
          <div className="flex flex-col gap-[32px]">
            <div className="flex gap-[8px] items-start">
              <Avatar src={(shopData.photo != null && shopData.photo != "") ? shopData.photo : UploadImg} sx={{ width: 72, height: 72, border: '1px solid #dce0e4' }}/>
              <div className="flex flex-col gap-[4px]">
                <Typography variant="h3" className="capitalize">{shopData.name}</Typography>
                <div className="flex gap-[5px]">
                  <img src={icStar} className="w-[18px]" />
                  <Typography variant="subtitle1">5.0</Typography>
                  <Typography variant="subtitle1" className="text-gray-400">({shopData.numberOfReviews})</Typography>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[6px]">
              <Typography variant="subtitle3" className="text-gray-400">About Us</Typography>
              <Typography variant="subtitle2">{shopData.aboutUs}</Typography>
            </div>
            <div className="flex flex-col gap-[6px]">
              <Typography variant="subtitle3" className="text-gray-400">Location</Typography>
              <Typography variant="subtitle2">{shopData.locations.length > 0 ? shopData.locations[0] && shopData.locations[0].address.city : "No Data"}</Typography>
            </div>
            <div className="flex flex-col gap-[6px]">
              <Typography variant="subtitle3" className="text-gray-400">Support Contact</Typography>
              <Typography variant="subtitle2">{shopData.phoneNumber}</Typography>
              <Typography variant="subtitle2">{shopData.supportEmail}</Typography>
            </div>
            <div className="flex flex-col gap-[6px]">
              <Typography variant="subtitle3" className="text-gray-400">Follow Us</Typography>
              <div className="flex gap-[12px] items-center">
                <Link><IconButton className="p-0"><img src={icFacebook} className="w-[24px]" /></IconButton></Link>
                <Link><IconButton className="p-0"><img src={icInstagram} className="w-[24px]" /></IconButton ></Link>
                <Link><IconButton className="p-0"><img src={icTwitter} className="w-[24px]" /></IconButton ></Link>
                <Link><IconButton className="p-0"><img src={icYoutube} className="w-[24px]" /></IconButton></Link>
              </div>
            </div>
          </div>
        </Grid>
        <Grid item md={8} sm={12} xs={12}>
          <div className="flex flex-col gap-[36px]">
            <div className="flex flex-col gap-[14px]">
              <Typography variant="h5" className="capitalize">Categories: {shopData.categories.length}</Typography>
              <div className="flex gap-[24px] justify-start items-center">
                {shopData.categories.map((item, index) => {
                  return (
                    <div key={index} className="flex flex-col justify-center items-center">
                      <IconButton className="w-[45px] h-[45px] p-0">
                        <img src={item.photo} alt={item.category} className="object-contain"/>
                      </IconButton>
                      <Typography variant="subtitle3">{item.category}</Typography>
                    </div>
                  );
                })}
                {shopData.categories.length === 0 && (
                  <div className="w-full flex justify-center items-center">
                    <Typography variant="subtitle1">No shop categories</Typography>
                  </div>
                )}
              </div>
            </div>
            {/* <div className="flex flex-col gap-[14px]">
              <div className="flex justify-between">
                <Typography variant="h5" className="capitalize">Reviews</Typography>
                {reviews.length > 0 && (
                  <DropdownMenu title="Sort by:" sort={sortBy} onSort={handleSortBy} sortOptions={REVIEWS_SORT_OPTIONS} />
                )}
              </div>
              {reviews.length > 0 ? (
                <Grid container spacing={{ xs: 1, md: 2 }}>
                  {reviews.map((review, index) => (
                    <Grid item sm={12} md={6} key={index}>
                      <ReviewCard
                        name={`${review.shopperId.firstName} ${review.shopperId.lastName}`}
                        date={moment(review.createdAt).format("MMM Do, YYYY")}
                        rating={review.rate}
                        review={review.comment}
                        avatar={review.shopperId.avatar}
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="subtitle3" className="text-center my-2">You have no reviews yet</Typography>
              )}
            </div> */}

            <Reviews data={reviews || []} />
          </div>
        </Grid>
      </Grid>
    </div>
  )
}