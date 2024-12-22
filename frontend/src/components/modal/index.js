// src/components/GeneralModal.js
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useModalDispatch, useModalState } from "src/contexts/ModalContext";
import { DialogActions, Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import ButtonLoader from "../button-loader/ButtonLoader";
import { CheckCircleOutline } from "@mui/icons-material";

const GeneralModal = ({
  children,
  heading = null,
  headingIcon = null,
  paragraph = null,
  img = null,
  primaryButtonValue = "Text",
  secondaryButtonValue = "Text",
  primaryButtonType = null,
  onPrimaryClick,
}) => {
  const modalState = useModalState();
  const modalDispatch = useModalDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    modalDispatch({ type: "CLOSE_MODAL" });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onPrimaryClick(modalState.data);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  return (
    <Dialog
      open={modalState.isOpen}
      onClose={handleClose}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      scroll={"paper"}
      className="w-full"
      sx={{
        width: "100% !important",
      }}
    >
      {img && (
        <img
          loading="lazy"
          src={img}
          alt="modal-img"
          className="m-auto w-2/3 rounded-xl mb-5"
        />
      )}

      {modalState.toast?.message && (
        <Stack className="absolute w-full top-4 items-center">
          <Stack
            width="fit-content"
            direction="row"
            border={1}
            padding="4px 12px 4px 12px"
            gap="8px"
            borderRadius="8px"
            borderColor="#00000014"
            boxShadow="0px 1px 5px 0px #1B1A211A"
            color="#3ACC48"
          >
            <CheckCircleOutline />
            <Typography>{modalState.toast?.message}</Typography>
          </Stack>
        </Stack>
      )}

      {heading && (
        <DialogTitle
          id="scroll-dialog-title"
          className="pt-[32px] sm:!pt-[64px] flex justify-center items-center"
        >
          <h1 className="text-[23px] sm:text-[32px] text-heading font-normal sm:leading-[44px] text-center font-gilroy">
            {heading}
          </h1>
          {headingIcon}
        </DialogTitle>
      )}

      <DialogContent>
        <DialogContentText
          id="scroll-dialog-description"
          tabIndex={-1}
          className="w-full flex flex-col gap-[16px] sm:px-[60px]"
        >
          {paragraph && (
            <p className="text-base text-center text-normal mt-2 font-gilroy">
              {paragraph}
            </p>
          )}
          {children}
        </DialogContentText>
      </DialogContent>
      <DialogActions className="!px-[22px] !py-[32px] sm:!pb-[64px] sm:!px-[80px] !gap-[14px]">
        <Button
          sx={{
            width: "100%",
            height: "44px",
            fontFamily: "Gilroy",
            fontSize: "14px",
            color: "#181818",
            borderRadius: "8px",
            backgroundColor: "#F5F5F5",
            textTransform: "unset",
          }}
          onClick={handleClose}
        >
          {secondaryButtonValue}
        </Button>
        {isLoading ? (
          <Button
            className="w-full"
            sx={{
              width: "100%",
              height: "44px",
              fontSize: "14px",
              borderRadius: "8px",
              border: "1px solid red",
              backgroundColor: "transparent",
            }}
          >
            <ButtonLoader />
          </Button>
        ) : (
          <LoadingButton
            className="w-full"
            sx={{
              width: "100%",
              height: "44px",
              fontFamily: "Gilroy",
              fontSize: "14px",
              color: "#ffffff",
              borderRadius: "8px",
              backgroundColor: "#F14445",
              textTransform: "unset",
              "&:hover": {
                backgroundColor: "#E13031",
              },
              "&:disabled": {
                background: "#ccc",
                color: "#999",
              },
            }}
            loading={isLoading}
            onClick={handleSubmit}
            disabled={primaryButtonType}
          >
            {primaryButtonValue}
          </LoadingButton>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default GeneralModal;
