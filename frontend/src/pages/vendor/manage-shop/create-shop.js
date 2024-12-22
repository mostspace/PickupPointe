import { Helmet } from 'react-helmet-async';
// Sections
import CreateShopDetail from 'src/sections/vendor/manage-shop/add-shop/main';

const CreateShop = () => {
  return (
    <>
      <Helmet>
        <title>Create Shop</title>
      </Helmet>

      <CreateShopDetail />
    </>
  )
}

export default CreateShop
