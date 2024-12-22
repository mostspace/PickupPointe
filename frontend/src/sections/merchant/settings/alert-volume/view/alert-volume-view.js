import Main from '../main';
import Header from "src/layouts/merchant/details/header";

export default function AlertVolumeView() {

  return (
    <>
      <Header title="Alert volume for new orders" />

      <div className="flex-1 bg-white rounded-[16px]">
        <Main />
      </div>
    </>
  );
}