import React, { useEffect, useState, useRef } from "react";
// Constant
import { BASE_URL } from "src/config-global";
// @mui
import { Typography, IconButton } from "@mui/material";
// Icons
import AddIcon from "@mui/icons-material/Add";
// Sections
import DiscountItem from "./discount-item";
import DiscountItemReadOnly from "./discount-item-readonly";
// Components
import DefaultButton from "src/components/button/default-button";
import LoadingProgress from "../loading-screen/loading-progress";
// Utilites
import axiosInstance from "src/utils/axios";
// Toast
import { toast } from "react-toastify";

// --------------------------------------------------------------------------------------------------

const Discounts = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [globalSettings, setGlobalSettings] = useState({});
    const discountItemTargetRef = useRef(null);

    // New state to keep track of each newly created and deleted discount
    const [discountChanges, setDiscountChanges] = useState([]);
    const [discountErrors, setDiscountErrors] = useState({});
    
    // Handle change in discount items
    const handleDiscountChange = (index, field, value) => {
        const updatedDiscounts = [...globalSettings.discounts];
        updatedDiscounts[index][field] = value;
        setGlobalSettings({ ...globalSettings, discounts: updatedDiscounts });
    };

    // Add a new discount
    const handleAddDiscount = () => {
        const newDiscount = {
            discountCode: "",
            discountAmount: "",
            method: "dollars",
            type: "create",
        };

        setDiscountChanges((prevChanges) => [...prevChanges, newDiscount]);
    };

    // Removing a discount item
    const handleRemoveDiscount = async (id, index) => {
        const discountExistsInGlobal = globalSettings.discounts.some(
            (discount) => discount._id === id
        );

        if (discountExistsInGlobal) {
            setGlobalSettings((prevSettings) => ({
                ...prevSettings,
                discounts: prevSettings.discounts.filter((discount) => discount._id !== id),
            }));

            try {
                const response = await axiosInstance.post(
                    `${BASE_URL}/api/v1/vendor/update-discounts`,
                    { discounts: [{ type: "delete", id }] }
                );

                if (response.status === 200) {
                    setGlobalSettings((prev) => ({
                        ...prev,
                        discounts: response.data.discounts,
                    }));
                    toast("Discount deleted successfully!", {
                        theme: "light",
                        className: 'toast-custom',
                        style: {
                          backgroundColor: "white",
                          color: "primary",
                        },
                    });
                }
            } catch (err) {
                toast(err.message, { type: "error", className: 'toast-custom' });
            }
        } else {
            setDiscountChanges((prevChanges) =>
                prevChanges.filter((_, i) => i !== index)
            );
        }
    };

    // Function to validate input fields and set errors
    const validateDiscounts = (discountChanges) => {
        const errors = {};

        discountChanges.forEach((discount, index) => {
            if (discount.type === "create") {
                let discountErrors = {};

                // Check if discountCode is empty
                if (!discount.discountCode || discount.discountCode.trim() === "") {
                    discountErrors.discountCode = "Discount code is required";
                }

                // Check if discountAmount is a valid number
                if (
                    !discount.discountAmount ||
                    isNaN(discount.discountAmount) ||
                    Number(discount.discountAmount) < 0
                ) {
                    discountErrors.discountAmount = "Valid discount amount is required";
                }

                // If there are any errors for this discount, add them to the errors object
                if (Object.keys(discountErrors).length > 0) {
                    errors[index] = discountErrors;
                }
            }
        });

        return errors;
    };

    const handleDiscountFieldChange = (index, field, value) => {
        // Sanitize the input to remove any whitespace or special characters
        const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, "");

        setDiscountChanges((prevChanges) =>
            prevChanges.map((discount, i) =>
                i === index ? { ...discount, [field]: sanitizedValue } : discount
            )
        );
    };

    const saveDiscounts = async () => {
        const validationErrors = validateDiscounts(discountChanges);

        if (Object.keys(validationErrors).length > 0) {
            setDiscountErrors(validationErrors);
            return;
        }

        const existingDiscountCodes = globalSettings.discounts.map(
            (discount) => discount.discountCode
        );
        const duplicateCode = discountChanges.find((discount) =>
            existingDiscountCodes.includes(discount.discountCode)
        );

        if (duplicateCode) {
            toast(`Discount code "${duplicateCode.discountCode}" already exists!`, { type: "error", className: 'toast-custom' });
            return;
        }

        setDiscountErrors({});

        try {
            const response = await axiosInstance.post(
                `${BASE_URL}/api/v1/vendor/update-discounts`,
                { discounts: discountChanges }
            );

            if (response.status === 200) {
                setDiscountChanges([]);
                setGlobalSettings((prev) => ({
                    ...prev,
                    discounts: response.data.discounts,
                }));
                toast("Discount created successfully!", {
                    theme: "light",
                    className: 'toast-custom',
                    style: {
                      backgroundColor: "white",
                      color: "primary",
                    },
                });
            }
        } catch (err) {
            toast(err.message, { type: "error", className: 'toast-custom' });
        }
    };

    const updateActiveStatus = async (id, isSwitchActive) => {
        try {
            const response = await axiosInstance.put(
                `${BASE_URL}/api/v1/vendor/change-discount-status/${id}`,
                {}
            );

            if (response.status === 200) {
                const updatedDiscount = response.data.discount;

                setGlobalSettings((prevSettings) => {
                    return {
                        ...prevSettings,
                        discounts: prevSettings.discounts.map((discount) =>
                            discount._id === updatedDiscount._id ? updatedDiscount : discount
                        ),
                    };
                });
                toast(`Discount code has been ${isSwitchActive ? 'activated' : 'deactivated'}!`, {
                    theme: "light",
                    className: 'toast-custom',
                    style: {
                      backgroundColor: "white",
                      color: "primary",
                    },
                });
            }
        } catch (err) {
            toast(err.message, { type: "error", className: 'toast-custom' })
        }
    };

    const getSettings = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get(
                `${BASE_URL}/api/v1/vendor/get-global-settings`
            );
            setGlobalSettings(response.data.setting);
        } catch (err) {
            toast(err.message, { type: "error", className: 'toast-custom' })
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getSettings();
    }, []);

    return (
        <div className="flex flex-col gap-[14px]">
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-[14px]">
                    <Typography variant="h5" className="capitalize">Discounts</Typography>
                    <Typography variant="subtitle3">Create unlimited discount codes.</Typography>
                </div>

                <IconButton className="bg-[#F5F5F5] p-[5px]" onClick={handleAddDiscount}>
                    <AddIcon className="text-[20px] text-heading" />
                </IconButton>
            </div>
            <div className="w-full"></div>

            <div className="flex flex-col gap-[20px]" ref={discountItemTargetRef}>
                {discountChanges?.map((discount, index) =>
                    discount.type === "create" && (
                        <DiscountItem
                            key={index}
                            discount={discount}
                            discountTextError={discountErrors[index]?.error}
                            index={index}
                            handleDiscountChange={handleDiscountFieldChange}
                            handleRemoveDiscount={handleRemoveDiscount}
                            errors={discountErrors[index] || {}}
                        />
                    )
                )}

                <div className="flex justify-end">
                    {discountChanges.length > 0 && (
                        <DefaultButton
                            value="Save discount"
                            onClick={saveDiscounts}
                            btnStatus={false}
                        />
                    )}
                </div>
            </div>

            {/* <div className="relative flex flex-col max-h-[450px] overflow-scroll overflow-x-hidden custom-scrollbar pr-2"> */}
            <div className="relative flex flex-col max-h-[450px] pr-2 min-h-[10vh]">
                <Typography variant="h5" className="capitalize mb-4">My Saved Discounts</Typography>
                
                {isLoading ? (
                    <div className="w-full h-full relative flex items-center justify-center">
                        <LoadingProgress sx={{ width: '50px', marginTop: '80px' }} />
                    </div>
                ) : (
                    <>
                        {globalSettings.discounts?.length > 0 ? (
                            globalSettings.discounts.map((discount, index) => (
                                <DiscountItemReadOnly
                                    key={index}
                                    discount={discount}
                                    index={index}
                                    handleDiscountChange={handleDiscountChange}
                                    handleRemoveDiscount={handleRemoveDiscount}
                                    id={discount._id}
                                    isActive={discount.isActive}
                                    updateActiveStatus={updateActiveStatus}
                                />
                            ))
                        ) : (
                            <div className="w-full flex justify-center items-center">
                                <Typography variant="subtitle3">No saved discounts</Typography>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Discounts;