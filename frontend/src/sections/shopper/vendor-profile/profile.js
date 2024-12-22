import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
// Components
import useCartProductItem from "src/hooks/use-cart-product-item";
import Main from './main';
import DealsAndSavings from "./deals-savings";
import FeaturedItems from "./featured-items";
import Reviews from "./reviews";

// ------------------------------------------------------------------------------------------------------------------------------------------
export default function Profile() {

  const marketState = useSelector((state) => state.market);
  const locationId = marketState.locationId;
  const vendor = marketState.shop;
  const [vendorProfile, setVendorProfile] = useState(vendor);
  const [products, setProducts] = useState([]);
  const filteredProducts = useMemo(() => {
    return products?.filter((product) => product.locations.some(loc => loc.locationId === locationId));
  }, [products, locationId]);
  const navigate = useNavigate();
  const location = useLocation();

  console.log(vendorProfile)
  const {
    quantities,
    handleAddToCart,
    handleClickAddToCart,
    onDecrease,
    onIncrease,
    selectedProduct,
    handleCustomizationOptionsClose,
    handleOpenCart,
    openCustomizationOptions,
    available
  } = useCartProductItem({ products: filteredProducts, vendor: vendorProfile._id });

  useEffect(() => {
    setVendorProfile(vendor);
    setProducts(vendor.items || []);
  }, [vendor]);

  return (
    <Main>
      <div className="flex flex-col gap-[32px]">
        <DealsAndSavings 
          data={vendorProfile?.vendorSettings?.[0]?.discounts || []}
          shopId={vendorProfile?._id}
          locationId={locationId}
        />

        <FeaturedItems
          vendorProfile={vendorProfile}
          products={filteredProducts}
          quantities={quantities}
          redirect={() => {navigate(`${location.pathname}/make-order`, {state: {shop: vendorProfile, locationId: locationId}})}}
          handleAddToCart={handleAddToCart}
          handleClickAddToCart={handleClickAddToCart}
          handleCustomizationOptionsOpen={handleOpenCart}
          onDecrease={onDecrease}
          onIncrease={onIncrease}
          selectedProduct={selectedProduct}
          handleCustomizationOptionsClose={handleCustomizationOptionsClose}
          openCustomizationOptions={openCustomizationOptions}
          available={available}
        />

        <Reviews data={vendorProfile.reviews || []} />
      </div>
    </Main>
  );
}