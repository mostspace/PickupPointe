import React from 'react'

import { Helmet } from 'react-helmet-async';
// Sections
import { SearchOrderView } from 'src/sections/vendor/search-order/view';

const SearchOrder = () => {
  return (
    <>
        <Helmet>
            <title>Search Orders</title>
        </Helmet>

        <SearchOrderView />
    </>
  )
}

export default SearchOrder
