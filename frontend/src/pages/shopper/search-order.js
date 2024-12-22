import React from 'react'

import { Helmet } from 'react-helmet-async';
// Sections
import { SearchOrderView } from 'src/sections/shopper/search-order/view';

const SearchOrder = () => {
  return (
    <>
        <Helmet>
            <title>Search Order</title>
        </Helmet>

        <SearchOrderView />
    </>
  )
}

export default SearchOrder
