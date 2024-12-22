import React, { useRef, useState, useCallback, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import moment from "moment";
// @mui
import { Typography, IconButton } from '@mui/material';
// Components
import Iconify from 'src/components/iconify/iconify';
import ReviewCard from 'src/components/review-card';
import DropdownMenu from 'src/components/dropdown-menu';
// Asset
import { REVIEWS_SORT_OPTIONS } from 'src/_mock/assets';

// ===========================================================================================================================

const Reviews = ({ data }) => {

  // Reviews SortBy
  const [sortBy, setSortBy] = useState('Reviews rating');
  const [sortedData, setSortedData] = useState(data);
  const handleSortBy = useCallback((newValue) => {
    setSortBy(newValue);
  }, []);

  useEffect(() => {
    let sortedReviews = [];
    if (sortBy === 'Reviews rating') {
      sortedReviews = [...data].sort((a, b) => b.rate - a.rate);
    } else if (sortBy === 'Latest') {
      sortedReviews = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'Oldest') {
      sortedReviews = [...data].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    setSortedData(sortedReviews);
  }, [sortBy, data]);

  // Slider settings
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(2);

  const updateSlidesToShow = () => {
    const width = window.innerWidth;
    if (width < 600) {
      setSlidesToShow(1);
    } else {
      setSlidesToShow(2);
    }
  };

  useEffect(() => {
    updateSlidesToShow();
    window.addEventListener("resize", updateSlidesToShow);
    return () => window.removeEventListener("resize", updateSlidesToShow);
  }, []);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToShow,
    initialSlide: 0,
    arrows: false,
    beforeChange: (_, next) => setCurrentSlide(next),
  };

  const totalSlides = sortedData.length;
  const isPrevDisabled = currentSlide === 0;
  const isNextDisabled = currentSlide + slidesToShow >= totalSlides;

  return (
    <div className="flex flex-col gap-[14px]">
      <div className="flex gap-6 justify-between items-end">
        <Typography variant="h5" className="capitalize">Reviews</Typography>
        <div className='flex items-center gap-6'>
          {data.length > 0 && (
            <DropdownMenu
              // title="Sort by:"
              sort={sortBy}
              onSort={handleSortBy}
              sortOptions={REVIEWS_SORT_OPTIONS}
            />
          )}
          <div className="flex items-center gap-3">
            <IconButton
              onClick={() => sliderRef.current.slickPrev()}
              disabled={isPrevDisabled}
              className={`bg-white text-heading hover:bg-primary hover:text-white drop-shadow-md ${
                isPrevDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Iconify icon="ic:round-arrow-back-ios" width={15} />
            </IconButton>
            <IconButton
              onClick={() => sliderRef.current.slickNext()}
              disabled={isNextDisabled}
              className={`bg-white text-heading hover:bg-primary hover:text-white drop-shadow-md ${
                isNextDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Iconify icon="ic:round-arrow-forward-ios" width={15} />
            </IconButton>
          </div>
        </div>
      </div>

      {sortedData.length === 0 ? (
        <Typography variant="subtitle3" className="text-center py-6">
          No reviews
        </Typography>
      ) : (
        <div className="slider-container">
          <Slider ref={sliderRef} {...settings}>
            {sortedData.map((review, index) => (
              <div className="p-1" key={index}>
                <ReviewCard
                  name={`${review.shopperId?.firstName} ${review.shopperId?.lastName}`}
                  date={moment(review.createdAt).format("MMM Do, YYYY")}
                  rating={review.rate}
                  review={review.comment}
                  avatar={review.shopperId?.avatar}
                />
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default Reviews;