import React from "react";
import { useNavigate } from "react-router-dom";
// @mui
import { Typography, FormControl, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, } from "@mui/material";
// Components
import DefaultButton from "src/components/button/default-button";
// Assets
import { logo } from 'src/assets';
import {useSelector} from "react-redux";
import {sendFeedback} from "src/api/merchant.js";

const Main = () => {
  const navigate = useNavigate();
  // Feedback Modal
  const [openFeedback, setOpenFeedback] = React.useState(false);
  const [feedback, setFeedback] = React.useState("");

  const handleFeedbackOpen = () => setOpenFeedback(true);
  const handleFeedbackClose = () => setOpenFeedback(false);
  
  const sendFeedbackMessage = async () => {
    await sendFeedback({message: feedback});
    handleFeedbackOpen();
  }

  return (
    <>
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-[16px] p-[15px] sm:p-[32px]">
          <Typography variant="subtitle1" className="font-gilroyMedium">Feedback</Typography>
          <FormControl className="w-full">
            <TextField
              size="small"
              variant='outlined'
              required
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              fullWidth
              multiline
              rows='5'
              placeholder='Enter feedback'
            />
          </FormControl>
        </div>

        <div className="border-t p-[32px] flex justify-center items-center">
          <DefaultButton value="Send feedback" onClick={sendFeedbackMessage} className="w-full" />
        </div>
      </div>

      <React.Fragment>
        <Dialog className="w-full"
          open={openFeedback}
          onClose={handleFeedbackClose}
          scroll="paper"
          sx={{
            width: "100% !important",
          }}
        >
          <DialogTitle id="" className='pt-[32px] sm:!pt-[64px] sm:px-[82px]'>
            <div className="flex gap-[18px] items-center">  
              <img src={logo} className="w-[66px]" loading="lazy"/>
              <Typography variant="h2">Pickup Pointe</Typography>
            </div>
          </DialogTitle>
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText
              id="scroll-dialog-description"
              tabIndex={-1}
            >
              <div className='flex flex-col gap-[14px] font-gilroy sm:px-[60px] py-[12px]'>
                <div className="flex flex-col gap-[6px]">
                  <Typography variant="h6">Your feedback has been successfully received</Typography>
                  <Typography variant="subtitle3" className="text-normal">Thank you. We will do our best to improve our app.</Typography>
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions className="!px-[22px] !py-[32px] sm:!pb-[64px] sm:!px-[80px] !gap-[14px] border-t">
            <DefaultButton value="Continue" onClick={() => navigate('/merchant/settings')} className="w-full" />
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </>
  );
};

export default Main;