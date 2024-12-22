import React, { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSelector } from "react-redux";
// @mui
import { Typography, IconButton } from "@mui/material";
// Components
import Iconify from "src/components/iconify/iconify";
import ProductItem from "src/components/product-item";
import ModalCustomization from "src/components/modal-customization";

const FeaturedItems = ({
  vendorProfile,
  products = [],
  quantities,
  handleAddToCart,
  handleClickAddToCart,
  onDecrease,
  onIncrease,
  selectedProduct,
  handleCustomizationOptionsClose,
  handleCustomizationOptionsOpen,
  openCustomizationOptions,
  available,
  redirect
}) => {
  const cartState = useSelector((state) => state.cart);
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3); // Default number of visible slides
  const cartItems = cartState[vendorProfile._id]?.items || [];
  const updateSlidesToShow = () => {
    const width = window.innerWidth;
    if (width < 480) {
      setSlidesToShow(1);
    } else if (width < 768) {
      setSlidesToShow(2);
    } else if (width < 1160) {
      setSlidesToShow(2);
    } else {
      setSlidesToShow(3);
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
    arrows: false, // Disable default arrows
    beforeChange: (_, next) => setCurrentSlide(next),
  };

  const totalSlides = products.length;
  const isPrevDisabled = currentSlide === 0;
  const isNextDisabled = currentSlide + slidesToShow >= totalSlides;

  return (
    <>
      <div className="flex flex-col gap-[14px]">
        <div className="flex gap-6 justify-between items-end">
          <Typography variant="h5" className="capitalize">
            Featured Items
          </Typography>
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

        {products.length === 0 ? (
          <Typography variant="subtitle3" className="text-center py-6">
            No featured items available.
          </Typography>
        ) : (
          <div className="slider-container">
            <Slider ref={sliderRef} {...settings}>
              {products.map((product, index) => {
                const quantity = cartItems
                  .filter((item) => item._id === product._id)
                  .reduce((sum, { quantity }) => sum + quantity, 0);
                return (
                  <div key={index} className="p-2">
                    <ProductItem
                      item={product}
                      unit=""
                      quantity={quantity}
                      onDecrease={() => onDecrease(product._id)}
                      onIncrease={() => onIncrease(product._id)}
                      disabledDecrease={quantities?.[product._id] <= 0}
                      disabledIncrease={quantities?.[product._id] >= available}
                      onAddToCart={() => handleAddToCart(product._id)}
                      incrementer={true}
                      handleCustomizationOptionsOpen={() =>
                        handleCustomizationOptionsOpen(product._id)
                      }
                    />
                  </div>
                );
              })}
            </Slider>
          </div>
        )}
      </div>

      <ModalCustomization
        isOpenModal={openCustomizationOptions}
        onCloseModal={handleCustomizationOptionsClose}
        selectedProduct={selectedProduct}
        quantities={quantities}
        onDecrease={onDecrease}
        onIncrease={onIncrease}
        available={available}
        onAddToCart={handleClickAddToCart}
        vendorProfile={vendorProfile}
        redirect={redirect}
      />
    </>
  );
};

export default FeaturedItems;
