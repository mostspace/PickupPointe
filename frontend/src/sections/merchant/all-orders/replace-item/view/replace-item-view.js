import Main from '../main';
import Header from 'src/layouts/merchant/details/header';

export default function ReplaceItemView() {

  return (
    <>
      <Header title={"Replace item"} />

      <div className="flex-1 bg-white rounded-[16px]">
        <Main />
      </div>
    </>
  );
}