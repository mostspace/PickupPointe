import React, { useEffect, useState } from "react";
import { useFormContext } from 'react-hook-form';
import { toast } from "react-toastify";
import axios from 'axios';
import { BASE_URL } from 'src/config-global';
import { useSelector } from "react-redux";
// @mui
import {
  FormControl, Typography, TextField, Autocomplete
} from "@mui/material";
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { validateEmail } from "src/utils/utilityFunctions";
import DefaultButton from "src/components/button/default-button";

const feedbackTypes = [
  { label: "Become Affiliate Request", value: 1 },
  { label: "Provide Feedback", value: 2 },
  { label: "Open a Support Ticket", value: 3 },
];

const Main = () => {
  const { setValue, register, reset, handleSubmit } = useFormContext();
  const [selectedFeedbackType, setSelectedFeedbackType] = useState("");
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if(user) {
      setValue('email', user.email);
      setValue('name', `${user.firstName} ${user.lastName}`);
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    if (!selectedFeedbackType) {
      toast("Please select a feedback category", { type: "error", className: 'toast-custom' });
      return;
    }
  
    if (loading) return;
  
    setLoading(true);
  
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/shopper/send-feedback`, {
        name: data.name,
        email: data.email,
        role: 'Shopper',
        feedback_type: selectedFeedbackType.label,
        message: data.message,
      });
  
      if (response.status === 200) {
        toast("Your request has been submitted successfully!", { type: "success", className: 'toast-custom' });
        reset();
        setSelectedFeedbackType(null);
      } else {
        toast(response.data.message || 'Something went wrong. Please try again later.', { type: "error", className: 'toast-custom' });
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast("Error submitting your feedback. Please try again", { type: "error", className: 'toast-custom' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-[32px]">
      <Typography variant="h5" className="capitalize">Support</Typography>
      <div className="flex flex-col gap-[14px]">
        <Typography variant="subtitle1" className="text-normal">
          Use the form below to share your feedback or submit a support request to the Pickup Pointe team. Select the appropriate category to ensure that your request is routed accurately.
        </Typography>
      </div>
      <div className="flex flex-col gap-[32px] border p-7 w-full flex flex-col rounded-xl">
        <Typography variant="h6" className="font-gilroyMedium">Shopper support</Typography>
        <div className="flex flex-col gap-[18px]">
          <div className="w-full flex flex-col sm:flex-row justify-between items-start gap-[18px]">
            <FormControl variant='standard' className="w-full flex flex-col gap-2">
              <Typography variant='subtitle3'>Name</Typography>
              <TextField
                size='small'
                variant='outlined'
                type="text"
                required
                fullWidth
                placeholder='Enter your full name'
                {...register("name", {
                  required: "Name is required",
                })}
                onChange={(e) => setValue('name', e.target.value)}
              />
            </FormControl>
            <FormControl variant='standard' className="w-full flex flex-col gap-2">
              <Typography variant='subtitle3'>Email</Typography>
              <TextField
                size='small'
                type="email"
                variant='outlined'
                required
                fullWidth
                placeholder='Enter your email address'
                {...register("email", {
                  required: "Email is required",
                  validate: validateEmail,
                })}
                onChange={(e) => setValue('email', e.target.value)}
              />
            </FormControl>
          </div>
          <FormControl variant='standard' className="flex flex-col gap-2">
            <Typography variant='subtitle3'>Category</Typography>
            <Autocomplete
              disablePortal
              disableClearable
              options={feedbackTypes || []}
              getOptionLabel={(option) => option.label || ''}
              value={selectedFeedbackType}
              onChange={(event, newValue) => setSelectedFeedbackType(newValue)}
              popupIcon={<KeyboardArrowDownOutlinedIcon />}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Choose the type of feedback"
                  className="line-clamp-1"
                />
              )}
            />
          </FormControl>
          <FormControl variant='standard' className="flex flex-col gap-2">
            <Typography variant='subtitle3'>Message</Typography>
            <TextField
              size='small'
              variant='outlined'
              required
              type="text"
              fullWidth
              multiline
              rows={5}
              placeholder='Describe your issue or feedback in detail'
              {...register("message", {
                required: "Message is required",
              })}
              onChange={(e) => setValue('message', e.target.value)}
            />
          </FormControl>
        </div>
        <div className="flex justify-end items-center">
          <DefaultButton
            value="Submit request"
            loading={loading}
            onClick={handleSubmit(onSubmit)}
          />
        </div>
      </div>
    </div>
  );
};

export default Main;