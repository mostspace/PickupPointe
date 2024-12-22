import React, { useEffect, useState } from "react";
// @mui
import { Typography, Divider } from "@mui/material";
// Icons
import PercentIcon from "@mui/icons-material/Percent";
// Components
import DefaultButton from "src/components/button/default-button";
import IOSSwitch from "src/components/ios-switch";
import IOSSlider from "src/components/ios-slider";
import { RHFTextField } from "src/components/hook-form";

// --------------------------------------------------------------------------------------------------

const BusinessModelFees = () => {
    const FEE_RATE = 0.029;
    const FIXED_FEE = 0.3;
    const DELIVERY_CHARGE = 7.5;
    const PICKUP_FEE_RATE = 0.045;
    const BASE_PICKUP_FEE = 0.5;

    // Business Modal Calculations
    const [modelFees, setModelFees] = useState({
        subtotal: 0,
        pickupFee: 0,
        tip: 0,
        deliveryCharge: DELIVERY_CHARGE,
        tax: 0,
        paymentProcessing: 0,
        customerTotal: 0,
        yourEarnings: 0,
        yourPartInPickUpFee: 0,
    });

    // Define the initial state for ModelFeeFields
    const initialModelFeeFields = {
        subtotal: null,
        tax: null,
        tip: null,
    };

    // Pickup Pointe's fee slider
    const [sliderValue, setSliderValue] = useState(0);

    const handleFeeSlider = (event, newValue) => {
        setSliderValue(newValue);
    };

    const [modelFeeFields, setModelFeeFields] = useState(initialModelFeeFields);
    const [passCreditFee, setPassCreditFee] = useState(false);
    const [simulateClicked, setSimulateClicked] = useState(false);

    useEffect(() => {
        if (simulateClicked) calculateBusinessModelFee();
    }, [sliderValue, passCreditFee, modelFeeFields]);

    // Change handler to update the fields in the state
    const handleFieldChange = (field) => (event) => {
        let { value } = event.target;
        if (isNaN(value)) return; // Handle non-numeric values gracefully
        value = Math.abs(parseFloat(value) || 0).toFixed(2); // Convert to positive float
        setModelFeeFields((prevFields) => ({
            ...prevFields,
            [field]: parseFloat(value),
        }));
    };

    const calculateBusinessModelFee = () => {
        setSimulateClicked(true);

        const subtotal = parseFloat((modelFeeFields.subtotal ?? 0).toFixed(2));
        const paymentProcessing = parseFloat((subtotal * FEE_RATE + FIXED_FEE).toFixed(2));
        const subtotalWithoutProcessing = subtotal - paymentProcessing;

        const tax = parseFloat((((modelFeeFields.tax || 0) / 100) * subtotalWithoutProcessing).toFixed(2));
        const pickupFee = parseFloat((subtotalWithoutProcessing * PICKUP_FEE_RATE + BASE_PICKUP_FEE).toFixed(2));

        const customerPartInPickUpFee = parseFloat((pickupFee * (sliderValue / 100)).toFixed(2));
        const yourPartInPickUpFee = parseFloat((pickupFee * ((100 - sliderValue) / 100)).toFixed(2));
        const passCredit = passCreditFee ? FEE_RATE * subtotal + FIXED_FEE : 0;

        const customerTotal = parseFloat(
            Number(subtotal) + 
            Number(customerPartInPickUpFee) + 
            DELIVERY_CHARGE + 
            Number(tax) + 
            (modelFeeFields.tip ? Number(modelFeeFields.tip) : 0) + 
            (passCreditFee ? Number(passCredit) : 0)
        ).toFixed(2);

        const yourEarnings = parseFloat(
            (
                Number(subtotal) - Number(yourPartInPickUpFee) - (passCreditFee ? 0 : Number(paymentProcessing))
            ).toFixed(2)
        );

        setModelFees({
            subtotal: subtotal,
            pickupFee: pickupFee,
            tip: modelFeeFields.tip ? modelFeeFields.tip : 0,
            deliveryCharge: DELIVERY_CHARGE,
            tax: tax,
            paymentProcessing: paymentProcessing,
            customerTotal: customerTotal,
            yourEarnings: yourEarnings,
            yourPartInPickUpFee: yourPartInPickUpFee,
        });
    };

    return (
        <div className="flex flex-col gap-[14px]">
            <Typography variant="h5" className="capitalize">
                Your business model fees
            </Typography>
            <Typography variant="subtitle3">
                Allocate your fees that best serves your business model.
            </Typography>

            <div className="w-full lg:w-1/2 flex flex-col justify-between gap-[24px]">
                <div className="flex flex-col gap-[24px] w-full">
                    <div className="w-full rounded-[12px] border p-[16px] flex flex-col h-fit">
                        <Typography variant="subtitle2">How do you want to split Pickup Pointe’s fee?</Typography>

                        <IOSSlider
                            aria-label="ios slider"
                            value={sliderValue}
                            valueLabelDisplay="off"
                            min={0}
                            max={100}
                            onChange={handleFeeSlider}
                            step={25}
                        />

                        <div className="flex justify-between">
                            <Typography variant="label">
                                {sliderValue}% customer
                            </Typography>
                            <Typography variant="label">
                                {100 - sliderValue}% you
                            </Typography>
                        </div>

                        <Divider className="my-[14px]" />

                        <div className="flex justify-between items-center">
                            <Typography variant="subtitle2">
                                Pass credit card fee to customer
                                <span className="text-gray-400 ml-1">
                                    2.9% + .30 cents
                                </span>
                            </Typography>
                            <IOSSwitch
                                checked={passCreditFee}
                                onChange={(e) => {
                                    setPassCreditFee(e.target.checked);
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="w-full flex flex-col gap-[14px]">
                    <div className="rounded-[12px] border p-[16px] flex flex-col gap-[10px]">
                        <div className="flex justify-between items-center">
                            <Typography variant="subtitle1">Order subtotal</Typography>
                            <RHFTextField
                                name="subtotal"
                                onChange={handleFieldChange("subtotal")}
                                placeholder=""
                                className="w-[88px]"
                                min="0"
                                value={modelFeeFields.subtotal}
                                type="number"
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <Typography variant="subtitle1">Tip</Typography>
                            <RHFTextField
                                name="tip"
                                onChange={handleFieldChange("tip")}
                                placeholder=""
                                className="w-[88px]"
                                min={0}
                                type="number"
                                value={modelFeeFields.tip}
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <Typography variant="subtitle1">Delivery charge</Typography>
                            <RHFTextField
                                name=""
                                value={DELIVERY_CHARGE}
                                disabled
                                placeholder=""
                                className="w-[88px]"
                                min={0}
                                type="number"
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <Typography variant="subtitle1">Tax</Typography>{" "}
                            <RHFTextField
                                name="tax"
                                onChange={handleFieldChange("tax")}
                                placeholder=""
                                className="w-[88px]"
                                min={0}
                                type="number"
                                value={modelFeeFields.tax}
                                icon={<PercentIcon />}
                            />
                        </div>
                        <div className="w-full flex justify-end mt-[14px]">
                            <DefaultButton
                                value="Simulate fees"
                                className="-ml-1 h-[41px]"
                                onClick={() => calculateBusinessModelFee()}
                            />
                        </div>
                        <Divider className="my-[14px]" />
                        <div className="flex justify-between items-center">
                            <Typography variant="subtitle3">Subtotal</Typography>
                            <Typography variant="subtitle1">
                                ${modelFees.subtotal}
                            </Typography>
                        </div>
                        <div className="flex justify-between items-center">
                            <Typography variant="subtitle3">Pickup Pointe fee</Typography>
                            <Typography variant="subtitle1">
                                ${modelFees.pickupFee}
                            </Typography>
                        </div>
                        <div className="flex justify-between items-center">
                            <Typography variant="subtitle3">Tip</Typography>
                            <Typography variant="subtitle1">
                                ${modelFees.tip}
                            </Typography>
                        </div>
                        <div className="flex justify-between items-center">
                            <Typography variant="subtitle3">Delivery charge</Typography>
                            <Typography variant="subtitle1">
                                ${modelFees.deliveryCharge}
                            </Typography>
                        </div>
                        <div className="flex justify-between items-center">
                            <Typography variant="subtitle3">Tax</Typography>
                            <Typography variant="subtitle1">
                                ${modelFees.tax}
                            </Typography>
                        </div>
                        <div className="flex justify-between items-center">
                            <Typography variant="subtitle3">Payment processing</Typography>
                            <Typography variant="subtitle1">
                                ${modelFees.paymentProcessing}
                            </Typography>
                        </div>
                        <Divider className="my-[14px]" />
                        <div className="flex justify-between items-center">
                            <Typography variant="subtitle1">Customer total</Typography>
                            <Typography variant="subtitle1">
                                ${modelFees.customerTotal}
                            </Typography>
                        </div>
                        <div className="flex justify-between items-center">
                            <Typography variant="subtitle1">Your earnings</Typography>
                            <Typography variant="subtitle1">
                                ${modelFees.yourEarnings}
                            </Typography>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessModelFees;