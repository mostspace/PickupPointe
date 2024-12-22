import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Divider, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from "@mui/material";
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import DefaultButton from "src/components/button/default-button";
import IOSSwitch from "src/components/ios-switch";
import { icClipboardCheck, icVolumeLoud, icPrinter, icDocumentText, icUserSpeak, icStar, logo, icIntegrations } from "src/assets";
import {useDispatch, useSelector} from "react-redux";
import {getSettings, setSettings} from "src/reducers/merchant/settingSlice.js";

const SettingItem = ({ icon, label, switchComponent, button, onClick }) => {
  const dispatch = useDispatch();
  const {settings, isLoading} = useSelector(state => state.merchant.setting);
  const [isToggled, setIsToggled] = useState(settings.autoConfirmNewOrder);
  
  useEffect(() => {
    setIsToggled(settings.autoConfirmNewOrder);
  }, [settings.autoConfirmNewOrder]);
  
  const handleItemClick = () => {
    onClick && onClick();
    if (switchComponent) {
      dispatch(setSettings({key: "autoConfirmNewOrder", value: !isToggled}));
      setIsToggled(prev => !prev);
    }
  };

  return (
    <div
      className="setting-item flex items-center justify-between gap-[16px] cursor-pointer px-[16px] py-[12px] rounded-[8px] hover:bg-[#f5f5f5] transition-all duration-150"
      onClick={handleItemClick}
    >
      <img src={icon} className="w-[24px] h-[24px]" alt={label} />
      <Typography variant="subtitle1" className="w-full">{label}</Typography>
      {switchComponent
        ? <IOSSwitch checked={isToggled || false}/>
        : button}
    </div>
  );
};

const UpdateAppModal = ({ open, onClose }) => (
  <Dialog
    open={open}
    onClose={onClose}
    scroll="paper"
    sx={{ width: "100% !important" }}
  >
    <DialogTitle className='pt-[32px] sm:!pt-[64px] sm:px-[82px]'>
      <div className="flex gap-[18px] items-center">
        <img src={logo} className="w-[66px]" alt="Logo" />
        <Typography variant="h2" className="text-[20px] text-[24px] font-gilroyMedium">Pickup Pointe</Typography>
      </div>
    </DialogTitle>
    <DialogContent dividers={scroll === 'paper'}>
      <DialogContentText tabIndex={-1}>
        <div className='flex flex-col gap-[14px] font-gilroy sm:px-[60px] py-[12px]'>
          <div className="flex flex-col gap-[6px]">
            <Typography variant="h5">Update to new app version V 1.3.5 - RB2</Typography>
            <Typography variant="subtitle3" className="text-normal">Your app version is V 1.3.4-RC1</Typography>
          </div>
        </div>
      </DialogContentText>
    </DialogContent>
    <DialogActions className="!px-[22px] !py-[32px] sm:!pb-[64px] sm:!px-[80px] !gap-[14px] border-t">
      <DefaultButton value="Cancel" onClick={onClose} className="w-full bg-[#F5F5F5] text-heading hover:bg-[#fef0f0]" />
      <DefaultButton value="Update" onClick={onClose} className="w-full" />
    </DialogActions>
  </Dialog>
);

const Main = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [openUpdateNewApp, setOpenUpdateNewApp] = useState(false);
  const {settings, isLoading} = useSelector(state => state.merchant.setting);
  
  const handleUpdateNewAppOpen = () => setOpenUpdateNewApp(true);
  const handleUpdateNewAppClose = () => setOpenUpdateNewApp(false);
  
  useEffect(() => {
    dispatch(getSettings());
  }, []);
  
  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-col gap-[12px]">
          <SettingItem
            icon={icClipboardCheck}
            label="Auto confirm new orders"
            switchComponent={true}
          />
          <SettingItem
            icon={icVolumeLoud}
            label="Alert volume for new orders"
            button={
              <>
                <Typography variant="subtitle2" className={"w-20 text-right"}>
                  {settings.volume === 'loud' ? 'Loud' : settings.volume === 'no-sound' ? 'No sound' : 'Vibration'}
                </Typography>
                <ArrowForwardIosOutlinedIcon className="text-[14px] text-heading"/>
              </>
            }
            onClick={() => navigate('alert-volume')}
          />
          <SettingItem
            icon={icPrinter}
            label="Printer Settings"
            button={<ArrowForwardIosOutlinedIcon className="text-[14px] text-heading" />}
          />
          <SettingItem
            icon={icIntegrations}
            label="Integrations"
            button={<ArrowForwardIosOutlinedIcon className="text-[14px] text-heading" />}
            onClick={() => navigate('/merchant/settings/integrations')}
          />
          <SettingItem
            icon={icDocumentText}
            label="Terms of use"
            button={<ArrowForwardIosOutlinedIcon className="text-[14px] text-heading" />}
          />
        </div>
        <Divider className="my-[16px] sm:my-[24px]" />
        <div className="flex flex-col gap-[12px]">
          <SettingItem
            icon={icUserSpeak}
            label="Give us feedback"
            onClick={() => navigate('give-us-feedback')}
          />
          <SettingItem
            icon={icStar}
            label="Rate us"
            onClick={() => navigate('rate-us')}
          />
        </div>
        <Divider className="my-[16px] sm:my-[24px]" />
        <div className="flex justify-between items-center px-[15px] py-[16px]">
          <div className="flex gap-[16px] items-center">
            <img src={logo} className="w-[44px]" alt="Logo" />
            <div className="flex flex-col">
              <Typography variant="subtitle1" className="font-gilroyMedium">App version</Typography>
              <Typography variant="subtitle3">V 1.3.4-RC1</Typography>
            </div>
          </div>
          {/*<DefaultButton onClick={handleUpdateNewAppOpen} value="Update app" className="text-[15px] text-primary bg-transparent w-fit px-2 hover:bg-hover font-gilroyMedium" />*/}
        </div>
      </div>

      <UpdateAppModal open={openUpdateNewApp} onClose={handleUpdateNewAppClose} />
    </>
  );
};

export default Main;