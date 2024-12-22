import { TextConstants } from "src/constants/textConstants";

const Logo = () => {
  <>
    <img src="/logo/logo.svg" alt="Pickup Pointe Logo" style={{ maxWidth: '150px' }} /><span style={{fontWeight: "600", fontSize: "18px", color: '#181818'}}>{TextConstants.PICKUPPOINTE}</span>
  </>
};

export default Logo;