import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
// Constant
import { BASE_URL } from "src/config-global";
// @mui
import { 
  Select, FormControl, FormControlLabel, Box, MenuItem, Typography, InputAdornment, RadioGroup, Radio, Button,
} from "@mui/material";
// Icons
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
// Components
import LightTooltip from "src/components/LightTooltip";
import ButtonLoader from "src/components/button-loader/ButtonLoader";
// Hook forms
import { RHFTextField } from "src/components/hook-form";
// Utilites
import axiosInstance from "src/utils/axios";

// --------------------------------------------------------------------------------------------------

const CourierDeliveryFees = () => {

    const [loading, setLoading] = useState(false);
  
    const [deliveryFeeSettings, setDeliveryFeeSettings] = useState({
        useThirdParty: true,
        offerFreeMile: {
            isUse: false,
            minMileAmount: 0,
            mustSpend: 0,
        },
        chargeBeyondTheFree: 0,
        costPer: "mile",
    });

    const [deliveryErrors, setDeliveryErrors] = useState({
        mustSpend: "",
        chargeBeyondTheFree: "",
        minMileAmount: "",
    });

    const [deliveryTexts, setDeliveryTexts] = useState({
        success: "",
        error: "",
        saved: true,
    });

    const validateDeliveryInput = (name, value) => {
        if (value === "" || value == null) {
            return "Field cannot be empty";
        }
        if (value < 0) {
            return "Value cannot be negative";
        }
        if (/[\s!@#$%^&*(),?":{}|<>]/.test(value)) {
            return "No spaces or special characters are allowed";
        }
        return "";
    };

    const formatDecimal = (value) => {
        if (!isNaN(value) && value.toString().includes(".")) {
            value = parseFloat(parseFloat(value).toFixed(2));
        }
        return value;
    };

    const handleDeliveryFeeChange = (field, nestedName = null, value) => {
        // Format the value if it's a field that requires decimal formatting
        let formattedValue =
        nestedName === "minMileAmount" ||
        nestedName === "mustSpend" ||
        field === "chargeBeyondTheFree"
            ? value === ""
            ? null
            : formatDecimal(value)
            : value;

        // Validate the input only for specific fields
        let errorState = nestedName ? nestedName : field;
        let error =
        nestedName === "minMileAmount" ||
        nestedName === "mustSpend" ||
        field === "chargeBeyondTheFree"
            ? validateDeliveryInput(errorState, formattedValue)
            : "";

        // Update the errors state only if there is an error
        if (error) {
            setDeliveryErrors((prevErrors) => ({
                ...prevErrors,
                [errorState]: error,
            }));
        } else {
            // Clear error for the field if no error
            setDeliveryErrors((prevErrors) => ({
                ...prevErrors,
                [errorState]: "",
            }));
        }

        // Update the delivery fee settings state
        setDeliveryFeeSettings((prevSettings) => ({
        ...prevSettings,
        ...(field === "offerFreeMile"
            ? {
                offerFreeMile: {
                    ...prevSettings.offerFreeMile,
                    [nestedName]: formattedValue,
                },
            }
            : { [field]: formattedValue }),
        }));
        setDeliveryTexts((prev) => ({
            ...prev,
            success: "",
            error: "",
            saved: false,
        }));
    };
    
    const saveDeliveryFee = async () => {
        const minFreeMiles = validateDeliveryInput(
            "minMileAmount",
            deliveryFeeSettings.offerFreeMile.minMileAmount
        );
        const mustSpendError = validateDeliveryInput(
            "mustSpend",
            deliveryFeeSettings.offerFreeMile.mustSpend
        );
        const chargeBeyondError = validateDeliveryInput(
            "chargeBeyondTheFree",
            deliveryFeeSettings.chargeBeyondTheFree
        );
        
        if (mustSpendError || chargeBeyondError || minFreeMiles) {
            setDeliveryErrors({
                mustSpend: mustSpendError,
                chargeBeyondTheFree: chargeBeyondError,
                minFreeMiles: minFreeMiles,
            });
            return; // Don't proceed with API call if there are errors
        }
        
        try {
            setLoading(true);
            const response = await axiosInstance.put(
                `${BASE_URL}/api/v1/vendor/set-delivery-fees`,
                deliveryFeeSettings
            );
            if (response.status === 200) {
                setDeliveryFeeSettings(response.data.courierDeliveryFees);
                toast("Delivery fee saved successfully", { type: "success", className: 'toast-custom' })
                setDeliveryTexts((prev) => ({
                    ...prev,
                    saved: true,
                }));
            }
        } catch (error) {
            setDeliveryTexts((prev) => ({
                ...prev,
                error: error.message,
                saved: false,
            }));
        } finally{
            setLoading(false);
        }
    };

    const getSettings = async () => {
        try {
            const response = await axiosInstance.get(
                `${BASE_URL}/api/v1/vendor/get-global-settings`
            );
            setDeliveryFeeSettings(response.data.setting.courierDeliveryFees);
        } catch (err) {
            console.error("Error fetching delivery fee settings:", err);
        }
    };

    useEffect(() => {
        getSettings();
    }, []);

    return (
        <div className="flex flex-col gap-[24px]">
            <div className="w-full flex flex-col gap-[6px]">
                <Typography variant="h5" className="capitalize">
                    Courier Delivery Fees
                    <LightTooltip title="If you offer a certain number of miles for free, specify that amount in the top field. If you don’t offer any free miles, select 'none' and enter the delivery fee you charge per mile in the bottom field. The delivery fee will then be calculated based on the dollar amount you enter for each mile from your fulfillment location.">
                    <InfoOutlinedIcon
                        sx={{
                            fontSize: "22px",
                            marginBottom: "4px",
                            marginLeft: "5px",
                        }}
                    />
                    </LightTooltip>
                </Typography>
                {/* <Typography variant="subtitle3">
                    How much do you charge per mile for door-to-door courier delivery?
                </Typography> */}
            </div>

            <div className="w-full flex flex-col gap-[14px]">
                <div className="w-full flex flex-col sm:flex-row sm:items-center gap-[14px] sm:gap-[24px]">
                    <Typography variant="subtitle1">Do you want to use a third-party service for courier delivery?</Typography>
                    <RadioGroup 
                        row
                        aria-label="tabs"
                        name="tabs"
                        value={ deliveryFeeSettings?.useThirdParty ? "yes" : "no" }
                        defaultChecked="yes"
                        onChange={(e) =>
                            handleDeliveryFeeChange("useThirdParty", null, e.target.value === "yes")
                        }
                    >
                        <FormControlLabel
                            value="yes"
                            control={
                                <Radio
                                    sx={{
                                        "&.Mui-checked": {
                                            color: "#F14445",
                                            fontSize: "12px",
                                        },
                                    }}
                                    size="small"
                                />
                            }
                            label={<span className="text-[14px]">Yes</span>}
                        />
                        <FormControlLabel
                            value="no"
                            control={
                                <Radio
                                    sx={{ "&.Mui-checked": { color: "#F14445" } }}
                                    size="small"
                                />
                            }
                            label={<span className="text-[14px]">No</span>}
                        />
                    </RadioGroup>
                </div>

                {!deliveryFeeSettings?.useThirdParty && (
                    // <Typography variant="subtitle3" className="text-center my-5">Coming Soon...</Typography>
                    <div className="w-full flex flex-col gap-[14px] relative p-10">
                        <div className="absolute inset-0 flex items-center justify-center rounded-[6px] backdrop-blur-[2px] bg-black/60 z-20">
                            <Typography variant="h6" className="text-white font-bold text-center font-gilroyMedium">Coming Soon...</Typography>
                        </div>

                        <div className="flex flex-col gap-[14px]">
                            <div className="w-full flex flex-col sm:flex-row sm:items-center gap-[14px] sm:gap-[24px]">
                                <Typography variant="subtitle1">Do you offer any free miles for courier delivery?</Typography>
                                <RadioGroup 
                                    row
                                    aria-label="tabs"
                                    name="tabs"
                                    value={
                                        deliveryFeeSettings?.offerFreeMile?.isUse ? "yes" : "no"
                                    }
                                    onChange={(e) =>
                                        handleDeliveryFeeChange(
                                            "offerFreeMile",
                                            "isUse",
                                            e.target.value == "yes" ? true : false
                                        )
                                    }
                                >
                                    <FormControlLabel
                                        value="yes"
                                        control={
                                            <Radio
                                                sx={{
                                                    "&.Mui-checked": {
                                                        color: "#F14445",
                                                        fontSize: "12px",
                                                    },
                                                }}
                                                size="small"
                                            />
                                        }
                                        label={<span className="text-[14px]">Yes</span>}
                                    />
                                    <FormControlLabel
                                        value="no"
                                        control={
                                            <Radio
                                                sx={{ "&.Mui-checked": { color: "#F14445" } }}
                                                size="small"
                                            />
                                        }
                                        label={<span className="text-[14px]">No</span>}
                                    />
                                </RadioGroup>
                            </div>
            
                            {deliveryFeeSettings?.offerFreeMile?.isUse === true && (
                                <>
                                    <FormControl className="w-full sm:w-[51%]">
                                        <RHFTextField
                                            name="order_amount"
                                            placeholder="Enter order min.amount"
                                            type="number"
                                            value={deliveryFeeSettings?.offerFreeMile?.minMileAmount}
                                            onChange={(e) =>
                                                handleDeliveryFeeChange(
                                                "offerFreeMile",
                                                "minMileAmount",
                                                e.target.value
                                                )
                                            }
                                        />
                                        <div className="w-full">
                                            {deliveryErrors.minMileAmount && (
                                                <Typography variant="subtitle2" className={"text-primary"}>
                                                    {deliveryErrors.minMileAmount}
                                                </Typography>
                                            )}
                                        </div>
                                    </FormControl>
            
                                    <div className="w-full flex flex-col sm:flex-row sm:items-center gap-[12px]">
                                        <Typography variant="subtitle1">
                                            Customer must spend
                                        </Typography>
                                        <FormControl className="w-fit">
                                            <RHFTextField
                                                name="tax_rate"
                                                placeholder="Enter amount"
                                                type="number"
                                                value={deliveryFeeSettings?.offerFreeMile?.mustSpend}
                                                onChange={(e) =>
                                                    handleDeliveryFeeChange(
                                                        "offerFreeMile",
                                                        "mustSpend",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <Typography variant="subtitle1">
                                            to obtain the free delivery miles?
                                        </Typography>
                                    </div>
                                    <div className="w-full">
                                        {deliveryErrors.mustSpend && (
                                            <Typography variant="subtitle2" className={"text-primary"}>
                                                {deliveryErrors.mustSpend}
                                            </Typography>
                                        )}
                                    </div>
                                </>
                            )}
            
                            <div className="w-full flex flex-col sm:flex-row sm:items-center gap-[24px]">
                                <Typography variant="subtitle1">
                                    What do you charge for delivery beyond the free mile radius?
                                </Typography>
                                <div className="flex items-center">
                                    <FormControl className="w-[150px]">
                                        <RHFTextField
                                            className="rightBorderNoneTextField"
                                            name="price"
                                            placeholder="0.00"
                                            type="number"
                                            value={deliveryFeeSettings?.chargeBeyondTheFree}
                                            onChange={(e) =>
                                                handleDeliveryFeeChange(
                                                    "chargeBeyondTheFree",
                                                    "",
                                                    e.target.value
                                                )
                                            }
                                            InputLabelProps={{ shrink: true }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Box
                                                        component="span"
                                                        sx={{ color: "text.disabled" }}
                                                        >
                                                        $
                                                        </Box>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </FormControl>
                                    <FormControl className="w-[155px]">
                                        <Select
                                            labelId="demo-simple-select-label"
                                            size="small"
                                            defaultValue={"mile"}
                                            className="!rounded-l-[0px] -ml-[1px]"
                                            onChange={(e) =>
                                                handleDeliveryFeeChange("costPer", e.target.value)
                                            }
                                        >
                                            <MenuItem value={"mile"} className="!text-[12px] sm:!text-[14px] !font-gilroy">Cost per mile</MenuItem>
                                            <MenuItem value={"delivery"} className="!text-[12px] sm:!text-[14px] !font-gilroy">Cost per delivery</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                            <div className="w-full">
                                {deliveryErrors.chargeBeyondTheFree && (
                                    <Typography variant="subtitle2" className={"text-red-500"}>
                                        {deliveryErrors.chargeBeyondTheFree}
                                    </Typography>
                                )}
                            </div>
                            <div className="w-full">
                                {(deliveryTexts.success !== "" ||
                                    deliveryTexts.error !== "") && (
                                    <Typography variant="subtitle2"
                                        className={
                                        deliveryTexts.success !== ""
                                            ? "text-success"
                                            : "text-red-500"
                                        }
                                    >
                                        {deliveryTexts.success !== ""
                                        ? deliveryTexts.success
                                        : deliveryTexts.error}
                                    </Typography>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* <div className="flex justify-end">
                    {loading ? (
                        <Button
                            className="w-40"
                            sx={{
                                padding: '4px 2px',
                                height: '41px',
                                fontFamily: 'Gilroy',
                                fontSize: '14px',
                                borderRadius: "8px",
                                border: "1px solid red",
                                backgroundColor: "transparent",
                            }}
                            disabled={loading}
                        >
                            <ButtonLoader/>
                        </Button> 
                    ) : (
                        !deliveryTexts.saved && (
                            <Button
                                className="w-40"
                                sx={{
                                    padding: '4px 2px',
                                    height: '41px',
                                    fontFamily: 'Gilroy',
                                    fontSize: '14px',
                                    color: "rgba(254, 254, 255, 1)", // Text color
                                    borderRadius: "8px",
                                    backgroundColor: "rgba(241, 68, 69, 1)", // Background color
                                    textTransform: "unset",
                                    "&:hover": {
                                        backgroundColor: "rgba(300, 68, 69, 1)", // Hover background color
                                    },
                                }}
                                onClick={saveDeliveryFee}
                            >
                                Save delivery fee
                            </Button>
                        )
                    )}
                </div> */}
            </div>
        </div> 
    );
};

export default CourierDeliveryFees;