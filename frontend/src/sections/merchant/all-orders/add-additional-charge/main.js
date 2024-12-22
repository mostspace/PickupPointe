import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
// @mui
import { Typography, TextField, InputAdornment, FormControl, Divider, } from "@mui/material";
// Components
import DefaultButton from "src/components/button/default-button";
// Icons
import CircleIcon from "@mui/icons-material/Circle";
// Asset
import { icWarning, icDollarOutline } from 'src/assets'

const Item = ({ data }) => (
  <div className="flex px-[16px] py-[12px] justify-between items-center gap-12px self-stretch rounded-[12px] border border-[rgba(0, 0, 0, 0.08)]">
    <div className="flex flex-1 gap-[16px] items-start">
      <div className="w-[64px] h-[64px] overflow-hidden rounded-[6px] flex items-center justify-center">
        <img src={data.img} className="object-cover w-full h-full" loading="lazy"/>
      </div>
      <div className="flex flex-col flex-grow gap-[12px]">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
          <div className="flex flex-col items-start gap-[2px]">
            <div className="flex gap-[5px] items-center">
              <Typography variant="h6">{data.name}</Typography>
            </div>
            <div className="flex gap-[5px] items-center">
              <Typography variant="subtitle3">{data.category}</Typography>
            </div>
          </div>
          <div className="flex items-center gap-[32px]">
            <div className="flex gap-[5px] items-center">
              <Typography variant="h6">{data.quantity}x</Typography>
              <CircleIcon className="text-[3px] text-heading" />
              <Typography variant="h6">{data.price}</Typography>
            </div>
          </div>
        </div>
        {data.modifier && (
          <div className="flex flex-col gap-[12px]">
            {data.modifier.map((item, index) => (
              <div key={index} className="flex gap-[8px] items-center">
                <img src={item.img} className="w-[36px] h-[36px]" loading="lazy"/>
                <div className="flex flex-col gap-[3px]">
                  <Typography variant="subtitle2">{item.name}</Typography>
                  <Typography variant="label">{item.option}</Typography>
                </div>
              </div>
            ))}
          </div>
        )}
        {data.warning && (
          <div className="flex flex-col gap-[12px]">
            {data.warning.map((item, index) => (
              <div key={index} className="flex items-start gap-[8px]">
                <img src={icWarning} className="w-[16px] h-[16px] mt-[4px]" loading="lazy"/>
                <div className="flex flex-col">
                  <Typography variant="subtitle2" className="text-primary">{item.title}</Typography>
                  <Typography variant="label">{item.description}</Typography>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

const order = {
  id: "#1001",
  name: "Steve H.",
  items: 3,
  date: "Pickup at 5:50 PM, Today",
  status: "New",
};

// ---------------------------------------------------------------------------------------------

const Main = () => {

  const navigate = useNavigate();

  const location = useLocation();
  const { item } = location.state || {};

  return (
    <>
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-[24px]">
          <div className="flex flex-col gap-[32px] p-[32px]">
            <Item data={item} />
          </div>
          <Divider />
          <div className="flex flex-col gap-[32px] p-[32px]">
            <div className="flex flex-col gap-[12px]">
              <Typography variant="subtitle1">Charge amount</Typography>
              <FormControl variant="standard" className="sm:min-w-[340px] flex">
                <TextField
                  placeholder="Enter charge amount"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <img src={icDollarOutline} loading="lazy"/>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            </div>
            <div className="flex flex-col gap-[12px]">
              <Typography variant="subtitle1">Reason for additional charge (optional)</Typography>
              <FormControl variant="standard" className="sm:min-w-[340px] flex">
                <TextField className="w-full"
                  placeholder="Enter special instructions"
                  type="text"
                  size="small"
                  multiline
                  rows={3}
                />
              </FormControl>
            </div>
          </div>
        </div>

        <div className="border-t p-[32px] flex gap-[16px] justify-between items-center">
          <DefaultButton value="Cancel" onClick={() => navigate('/merchant/all-orders')} className="w-full bg-[#F5F5F5] text-heading hover:bg-[#fef0f0]" />
          <DefaultButton value="Add charge" onClick={() => navigate('/merchant/all-orders/order-details', { state: {order}})} className="w-full" />
        </div>
      </div>
    </>
  );
};

export default Main;


