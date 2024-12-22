import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
// Constants
import { BASE_URL } from "src/config-global";
// @mui
import { FormControlLabel, Checkbox, Typography } from "@mui/material";
// Utilities
import axiosInstance from "src/utils/axios";

const GlobalSettings = () => {
  const [globalSettings, setGlobalSettings] = useState({ settings: {} });
  const [notificationsSuccess, setNotificationsSuccess] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const debounceTimeout = useRef(null); // useRef to store debounce timeout

  // Fetch global settings
  const getSettings = async () => {
    try {
      const { data } = await axiosInstance.get(`${BASE_URL}/api/v1/vendor/get-global-settings`);
      setGlobalSettings(data.setting);
    } catch (err) {
      setGlobalError(err.message);
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    setGlobalSettings((prevState) => ({
      ...prevState,
      settings: {
        ...prevState.settings,
        [name]: checked,
      },
    }));

    // Clear previous debounce timeout
    clearTimeout(debounceTimeout.current);

    // Set new debounce timeout
    debounceTimeout.current = setTimeout(() => {
      saveNotificationsSetting(name, checked);
    }, 500);
  };

  // Save notification settings
  const saveNotificationsSetting = async (name, value) => {
    try {
      const response = await axiosInstance.put(
        `${BASE_URL}/api/v1/vendor/set-notification-settings`,
        { [name]: value }
      );
      if (response.status === 200) {
        setNotificationsSuccess(true);
        setTimeout(() => setNotificationsSuccess(false), 5000);
      }
    } catch (err) {
      setGlobalError(err.message || "Error saving settings.");
    }
  };

  useEffect(() => {
    getSettings();
  }, []);

  const checkboxSettings = [
    { name: "pickupNotification", label: "Pickup notifications" },
    { name: "dropOffNotification", label: "Drop-off notifications" },
    { name: "enableChat", label: "Enable chat feature" },
    { name: "qrCodeSecurity", label: "QR Code security pickup signing" },
    { name: "emailACopyofOrder", label: "Email a copy of every order" },
  ];

  return (
    <div className="flex flex-col gap-[14px]">
      <Typography variant="h5" className="capitalize">Global settings</Typography>
      <div className="w-fit flex flex-col">
        {checkboxSettings.map(({ name, label }) => (
          <CheckboxSetting
            key={name}
            name={name}
            label={label}
            checked={!!globalSettings?.settings[name]}
            onChange={handleCheckboxChange}
          />
        ))}
      </div>
      {notificationsSuccess && (
        <Typography variant="subtitle2" className="text-success">
          Notifications settings changed successfully
        </Typography>
      )}
      {globalError && (
        <Typography variant="subtitle2" className="text-primary">
          {globalError}
        </Typography>
      )}
    </div>
  );
};

// Checkbox component for better reusability
const CheckboxSetting = ({ name, label, checked, onChange }) => (
  <FormControlLabel
    control={<Checkbox size="small" name={name} checked={checked} onChange={onChange} />}
    label={<span className="text-[14px]">{label}</span>}
  />
);

GlobalSettings.propTypes = {
  formData: PropTypes.object,
};

export default GlobalSettings;