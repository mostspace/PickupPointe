import Main from '../main';
import Header from 'src/layouts/merchant/details/header';
// @mui
import { Button } from '@mui/material';
// Assets
import { icTrashBin } from "src/assets";
import {useDispatch} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {cancelOrderById} from "src/reducers/merchant/orderSlice.js";
import ConfirmDelete from "src/components/modal/confirm-delete/index.js";
import {useState} from "react";
import {awrap} from "regenerator-runtime";
import {toast} from "react-toastify";

export default function AdjustOrderView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {orderId} = useParams();

  const [confirmDelete, setConfirmDelete] = useState(false)

  const cancelOrder = async () => {
    await dispatch(cancelOrderById(orderId));
    navigate("/merchant/all-orders");
    toast(`You've canceled order successfully.`, {type: 'success', className: 'toast-custom'});
  }

  return (
    <>
      <Header
        title="Adjust order"
        actionButton={
          <Button
            onClick={() => setConfirmDelete(true)}
            variant="outlined"
            startIcon={<img src={icTrashBin} className="mr-1" alt="Cancel" />}
            sx={{
              textTransform: 'unset',
              color: 'primary',
              background: 'transparent',
              fontFamily: 'Gilroy',
              fontSize: '14px',
              border: 'unset',
              '&:hover': {
                border: 'unset',
              },
            }}
          >
            Cancel the entire order
          </Button>
        }
      />

      <div className="flex-1 bg-white rounded-[16px]">
        <Main />
      </div>
      <ConfirmDelete
        confirmMsg="Are you sure you want to cancel the entire order?"
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={cancelOrder}
        description="This action cannot be undone."
        cancelText="Cancel"
        confirmText="Delete"/>
    </>
  );
}