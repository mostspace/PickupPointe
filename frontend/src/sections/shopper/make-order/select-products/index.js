import React, {useState, useEffect, useMemo, useCallback} from "react";
// @mui
import { Grid, Typography } from "@mui/material";
// Components
import Searchbar from "src/components/search-filed";
import ProductItem from "src/components/product-item";
// Assets
import { icDelivery } from "src/assets";
import ModalCustomization from "src/components/modal-customization";
import useCartProductItem from "src/hooks/use-cart-product-item";
import {useFormContext} from "react-hook-form";
import {useSelector} from "react-redux";
import CartItem from "src/components/cart-item/cart-item";
import DropdownMenu from "src/components/dropdown-menu";

// --------------------------------------------------------------------------------------------------

const SelectProducts = ({vendorProfile, locationId}) => {
  const cartState = useSelector((state) => state.cart);
  const cartItems = cartState[vendorProfile._id]?.items || [];

  const {
    control,
    formState: {errors}
  } = useFormContext();

  // Assume these are fetched from a server
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const [categories, setCategories] = useState([]);

  // Simulate fetching data from server
  useEffect(() => {
    const fetchProducts = async () => {
      setProducts(vendorProfile.items.filter((product) => product.locations.some(loc => loc.locationId === locationId)));
    };
    fetchProducts();
  }, [vendorProfile]);

  useEffect(() => {
    const allCategories = [
      ...new Map(
        products.flatMap(item => item.categories)
          .map(category => [category._id, category])
      ).values()
    ];
    const updatedCategories = allCategories.map(category => ({
      ...category,
      value: category.category,
      label: category.category
    }));
    setCategories([{
      value: 'All',
      label: "All"
    }, ...updatedCategories]);
  }, [products])

  // Item categories sorting
  const [sortBy, setSortBy] = useState('All');
  const handleSortBy = useCallback((newValue) => {
    setSortBy(newValue);
  }, []);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    let newProducts = products.filter(item => item.locations.some(location => location.locationId === locationId));
    newProducts = newProducts.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (sortBy !== 'All') {
      newProducts = newProducts.filter((product) =>
        product.categories.some((category) => category.category === sortBy)
      )
    }
    return newProducts;
  }, [products, searchQuery, sortBy]);

  const {
    quantities,
    handleAddToCart,
    handleClickAddToCart,
    onDecrease,
    onClickDecrease,
    onIncrease,
    onClickIncrease,
    onClickClear,
    selectedProduct,
    handleCustomizationOptionsClose,
    handleOpenCart,
    openCustomizationOptions,
    available
  } = useCartProductItem({products, vendor: vendorProfile._id});

  return (
    <>
      <div className="w-full flex flex-col gap-8 md:flex-row md:gap-[40px] justify-between items-start">
        {cartItems.length > 0 &&
          <div className="w-full md:max-w-[360px] bg-dark flex flex-col rounded-[16px] p-[15px] md:p-[24px] gap-[16px]">
            <Typography variant="h6" className="">
              Items in cart: {cartItems.length}
            </Typography>
            <div className="flex flex-col p-[16px] border rounded-[16px]">
              {
                cartItems.map((cartItem, index) =>
                  <CartItem
                    item={cartItem}
                    onDecrease={(itemId, variant) => {
                      onClickDecrease(itemId, cartItem.selectedItems, variant);
                    }}
                    onIncrease={(itemId, variant) => {
                      onClickIncrease(itemId, cartItem.selectedItems, variant);
                    }}
                    onClear={(itemId, variant) => {
                      onClickClear(itemId, cartItem.selectedItems, variant);
                    }}
                    isFinal={index === cartItems.length - 1}
                  />
                )
              }
            </div>
            <div className="flex gap-[8px]">
              <img src={icDelivery} className="w-[16px]" style={{filter: 'grayscale(1)'}}/>
              <Typography variant="subtitle3">Free deliveries on orders of $200+</Typography>
            </div>
          </div>
        }
        <div className="w-full flex flex-col gap-[32px]">
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row justify-between lg:items-end gap-[24px]">
            <Searchbar
              className="w-full sm:max-w-[320px]"
              placeholder="Search item#, item name or keyword..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <DropdownMenu
              title="Category: "
              sort={sortBy}
              onSort={handleSortBy}
              sortOptions={categories}
            />
          </div>

          <div className="w-full">
            <Grid container spacing={2}>
              {filteredProducts.map((product) => {
                const quantity = cartItems.filter(item => item._id === product._id)
                  .reduce((sum, {quantity}) => sum + quantity, 0);
                return (
                  <Grid key={product._id} item xl={cartItems.length > 0 ? 3 : 2} lg={cartItems.length > 0 ? 4 : 3} md={cartItems.length > 0 ? 6 : 4} sm={6} xs={12} >
                    <ProductItem
                      item={product}
                      quantity={quantity}
                      unit=""
                      onDecrease={() => onDecrease(product._id)}
                      onIncrease={() => onIncrease(product._id)}
                      disabledDecrease={quantities[product._id] <= 0}
                      disabledIncrease={quantities[product._id] >= available}
                      onAddToCart={() => handleAddToCart(product._id)}
                      handleCustomizationOptionsOpen={() => handleOpenCart(product._id)}
                      incrementer={true}
                    />
                  </Grid>
                )
              })}
            </Grid>
          </div>
        </div>
      </div>

      {/* Customization modifier Modal */}
      <ModalCustomization
        isOpenModal={openCustomizationOptions}
        onCloseModal={handleCustomizationOptionsClose}
        selectedProduct={selectedProduct}
        quantities={quantities}
        onDecrease={onDecrease}
        onIncrease={onIncrease}
        available={available}
        onAddToCart={handleClickAddToCart}
      />
    </>
  );
};

export default SelectProducts;