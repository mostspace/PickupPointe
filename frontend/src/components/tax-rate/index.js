import React, { useState, useEffect } from "react";
import { BASE_URL } from "src/config-global";
import { FormControl, Typography, TextField, ButtonGroup } from "@mui/material";
import DefaultButton from "src/components/button/default-button";
import axiosInstance from "src/utils/axios";

const TaxRate = () => {
    const [taxRate, setTaxRate] = useState(null);
    const [taxRateTexts, setTaxRateTexts] = useState({
        success: "",
        error: "",
        saved: true,
    });

    const handleTaxRateChange = (event) => {
        let { value } = event.target;
        if (value === "") {
            setTaxRate(null);
            setTaxRateTexts({ success: "", error: "", saved: false });
            return;
        }

        const parsedValue = parseFloat(value);

        if (!isNaN(parsedValue) && parsedValue > 0 && parsedValue <= 50) {
            setTaxRate(parseFloat(parsedValue.toFixed(2)));
            setTaxRateTexts({ success: "", error: "", saved: false });
        } else if (parsedValue <= 0) {
            setTaxRateTexts((prev) => ({
                ...prev,
                error: "Tax rate cannot be zero or negative.",
            }));
        } else if (parsedValue > 50) {
            setTaxRateTexts((prev) => ({
                ...prev,
                error: "Tax rate cannot be more than 50%.",
            }));
        }
    };

    const saveTaxRate = async () => {
        try {
            const response = await axiosInstance.put(
                `${BASE_URL}/api/v1/vendor/set-tax-rate`,
                { taxRate: parseFloat(taxRate) }
            );
            if (response.status === 200) {
                setTaxRateTexts({
                    success: "Tax rate saved successfully!",
                    error: "",
                    saved: true,
                });
            }
        } catch (err) {
            setTaxRateTexts((prev) => ({
                ...prev,
                error: err?.message || "Error saving tax rate.",
                saved: false,
            }));
        }
    };

    const getSettings = async () => {
        try {
            const response = await axiosInstance.get(
                `${BASE_URL}/api/v1/vendor/get-global-settings`
            );

            if (response.data && response.data.setting && 'taxRate' in response.data.setting) {
                const rate = response.data.setting.taxRate;
                setTaxRate(rate === 0 ? null : rate);
            } else {
                setTaxRateTexts((prev) => ({
                    ...prev,
                    error: "Failed to retrieve tax rate. Please try again.",
                }));
            }
        } catch (err) {
            setTaxRateTexts((prev) => ({
                ...prev,
                error: err?.message || "An error occurred while fetching settings.",
            }));
        }
    };

    useEffect(() => {
        getSettings();
    }, []);

    return (
        <>
            <div className="flex flex-col justify-between items-center gap-[4px]">
                <div className="w-full flex flex-col gap-[14px]">
                    {/* <Typography variant="h5" className="capitalize">Tax Rate</Typography> */}
                    <Typography variant="label1">What is your jurisdiction's tax rate?</Typography>
                </div>

                <div className="w-full flex flex-col gap-[24px]">
                    <ButtonGroup variant="text" className="flex items-end">
                        <FormControl className="w-fit">
                            <TextField
                                name="tax-rate"
                                // placeholder="Enter your tax rate percentage %"
                                type="number"
                                className="border-[1px]"
                                value={taxRate ?? ""}
                                onChange={handleTaxRateChange}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderWidth: "1px",
                                        },
                                    },
                                }}
                                inputProps={{ min: 0, max: 50, step: 0.01 }}
                            />
                        </FormControl>
                        <DefaultButton
                            value={taxRateTexts.saved ? "Saved!" : "Save rate"}
                            className="-ml-1 h-[41px]"
                            onClick={saveTaxRate}
                            btnStatus={
                                taxRateTexts.error !== "" ||
                                taxRate === null ||
                                taxRateTexts.saved
                            }
                        />
                    </ButtonGroup>
                    {(taxRateTexts.success || taxRateTexts.error) && (
                        <Typography
                            variant="subtitle3"
                            className={taxRateTexts.success ? "text-success text-[14px]" : "text-red-500 text-[14px]"}
                        >
                            {taxRateTexts.success || taxRateTexts.error}
                        </Typography>
                    )}
                </div>
            </div>
        </>
    );
};

export default TaxRate;