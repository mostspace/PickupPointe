import Header from "src/layouts/merchant/details/header";
import Main from "../main";

export default function IntegrationsView() {
  return (
    <>
      <Header title={"Integrations"} />
      
      <div className="flex-1 bg-white rounded-[16px]">
        <Main />
      </div>
    </>
  );
}
