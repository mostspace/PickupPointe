import Main from '../main';
import Header from 'src/layouts/merchant/details/header';

export default function ManageItemOutOfStockView() {

  return (
    <>
      <Header title={"Item is out of stock"} />

      <div className="flex-1 bg-white rounded-[16px]">
        <Main />
      </div>
    </>
  );
}