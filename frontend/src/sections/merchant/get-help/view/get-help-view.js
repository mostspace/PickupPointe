import Main from '../main';
import Header from 'src/layouts/merchant/details/header';

export default function GetHelpView() {

  return (
    <>
      <Header title={"Get help from Pickup Pointe"} />

      <div className="flex-1 bg-white rounded-[16px]">
        <Main />
      </div>
    </>
  );
}