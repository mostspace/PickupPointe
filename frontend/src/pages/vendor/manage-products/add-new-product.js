import React from 'react'

import { Helmet } from 'react-helmet-async';
// Sections
import { AddNewProduct } from 'src/sections/vendor/manage-products/view';

const AddNewProductPage = () => {
  return (
    <>
        <Helmet>
            <title>Edit Products</title>
        </Helmet>

        <AddNewProduct />
    </>
  )
}

export default AddNewProductPage
