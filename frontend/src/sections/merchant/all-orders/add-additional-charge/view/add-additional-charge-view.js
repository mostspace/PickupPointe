import Main from '../main';
import Header from 'src/layouts/merchant/details/header';

export default function AddAdditionalChargeView() {

  return (
    <>
      <Header title={"Add an additional charge"} />

      <div className="flex-1 bg-white rounded-[16px]">
        <Main />
      </div>
    </>
  );
}