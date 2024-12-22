import React from 'react'

import { Helmet } from 'react-helmet-async';
// Sections
import { ProductDetails } from 'src/sections/vendor/manage-products/view';

const ProductDetailsPage = () => {
  return (
    <>
        <Helmet>
            <title>Edit Products</title>
        </Helmet>

        <ProductDetails />
    </>
  )
}

export default ProductDetailsPage
