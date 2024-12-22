import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Checkbox, FormControl, FormControlLabel, IconButton, InputAdornment, TextField, Typography,
} from "@mui/material";
import DefaultButton from "src/components/button/default-button";
import Iconify from "src/components/iconify";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [passwordValues, setPasswordValues] = useState({
    password: "",
    confirmPassword: "",
    showPassword: false,
  });

  const handleChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (field) => (event) => {
    setPasswordValues((prev) => ({ ...prev, [field]: event.target.value }));
  };
  const toggleShowPassword = useCallback(() => {
    setPasswordValues((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  }, []);

  const preventDefault = (event) => event.preventDefault();

  return (
    <div className="w-full h-full flex flex-col justify-between gap-[24px]">
      <div className="flex flex-col gap-[20px]">
        <div className="flex flex-col gap-[6px]">
          <Typography variant="h6" className="font-gilroyMedium">Before you post your review</Typography>
          <Typography variant="subtitle3">
            Create an account with Pickup Pointe so we can apply your delivery discount to your account.
          </Typography>
        </div>

        <div className="flex flex-col gap-[16px]">
          <FormControl variant="standard">
            <Typography variant="label1">Contact email</Typography>
            <TextField
              size="small"
              variant="outlined"
              required
              fullWidth
              value={email}
              onChange={handleChange}
              placeholder="ryan@mybusiness.com"
            />
          </FormControl>

          {['password', 'confirmPassword'].map((field, index) => (
            <FormControl key={field} variant="outlined" className="relative">
              <Typography variant="label1">{index === 0 ? 'Password' : 'Confirm Password'}</Typography>
              <TextField
                size="small"
                variant="outlined"
                fullWidth
                type={passwordValues.showPassword ? "text" : "password"}
                value={passwordValues[field]}
                onChange={handlePasswordChange(field)}
                placeholder={index === 0 ? "Enter password" : "Confirm password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={toggleShowPassword}
                        onMouseDown={preventDefault}
                        edge="end"
                      >
                        <Iconify icon={passwordValues.showPassword ? "solar:eye-bold" : "solar:eye-closed-bold"} width={24} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col gap-[12px] pt-[24px] border-t">
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={agree}
              onChange={() => setAgree(!agree)}
              sx={{ alignSelf: 'flex-start', padding: 0.35, marginLeft: 1 }}
            />
          }
          label={
            <Typography variant="subtitle3" className="pl-1">
              I agree to Pickup Pointe's Terms and Conditions
            </Typography>
          }
        />
        <div className="flex flex-col ss:flex-row ss:justify-between ss:items-center gap-[12px] ss:gap-[24px]">
          {['Create Account', 'Sign in'].map((value, index) => (
            <DefaultButton
              key={value}
              value={value}
              onClick={() => navigate(`/leave-review/${index === 0 ? 'account-created' : 'choose-platform'}`)}
              className={`w-full ${index !== 0 ? 'bg-[#F5F5F5] text-heading hover:bg-[#fef0f0]' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Register;