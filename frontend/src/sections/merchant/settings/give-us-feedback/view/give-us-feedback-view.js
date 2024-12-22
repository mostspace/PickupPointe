import Main from '../main';
import Header from "src/layouts/merchant/details/header";

export default function GiveUsFeedbackView() {

  return (
    <>
      <Header title={"Give us feedback"} />

      <div className="flex-1 bg-white rounded-[16px]">
        <Main />
      </div>
    </>
  );
}