import Main from '../main';
import Header from "src/layouts/merchant/details/header";

export default function RateUsView() {

  return (
    <>
      <Header title={"Rate us"} />

      <div className="flex-1 bg-white rounded-[16px]">
        <Main />
      </div>
    </>
  );
}