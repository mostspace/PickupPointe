import { Helmet } from 'react-helmet-async';
// Sections
import { ViewShopDetail } from 'src/sections/vendor/manage-shop/shop-detail/view';

const ShopDetail = () => {
  return (
    <>
      <Helmet>
        <title>View Shop</title>
      </Helmet>

      <ViewShopDetail />
    </>
  )
}

export default ShopDetail
