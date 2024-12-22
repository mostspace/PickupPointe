import React, { useEffect, useState, useRef, useMemo } from "react";
import { Button, Typography, Avatar  } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import RemoveIcon from '@mui/icons-material/Remove';

// Assets
import { icPen, UploadImg } from 'src/assets';

import  {
    RHFTextField,
} from 'src/components/hook-form';
  
import { useForm, FormProvider } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { _tags, } from 'src/_mock/assets';

// -------------------------------------------------------------------------------------------------

export default function ProductCategory(props, {formData}) {

    const onSubmit = (data) => {
        console.log(data);
    };
    
    // RHF Hook Form
    const NewFormDataSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        images: Yup.array().min(1, 'Images is required'),
        tags: Yup.array().min(1, 'Must have at least 1 attributes'),
        category: Yup.string().required('Category is required'),
        price: Yup.number().moreThan(0, 'Price should not be $0.00'),
        description: Yup.string().required('Description is required'),
        // not required
        taxes: Yup.number(),
        newLabel: Yup.object().shape({
          enabled: Yup.boolean(),
          content: Yup.string(),
        }),
        saleLabel: Yup.object().shape({
          enabled: Yup.boolean(),
          content: Yup.string(),
        }),
    });
    
    const defaultValues = useMemo(
        () => ({
          name: formData?.name || '',
          description: formData?.description || '',
          subDescription: formData?.subDescription || '',
          images: formData?.images || [],
          //
          code: formData?.code || '',
          sku: formData?.sku || '',
          price: formData?.price || 0,
          quantity: formData?.quantity || 0,
          priceSale: formData?.priceSale || 0,
          tags: formData?.tags || [],
          taxes: formData?.taxes || 0,
          gender: formData?.gender || '',
          category: formData?.category || '',
          colors: formData?.colors || [],
          sizes: formData?.sizes || [],
          newLabel: formData?.newLabel || { enabled: false, content: '' },
          saleLabel: formData?.saleLabel || { enabled: false, content: '' },
        }),
        [formData]
    );
    
    const methods = useForm({
        resolver: yupResolver(NewFormDataSchema),
        defaultValues,
    });
    
    const {
        reset,
        watch,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;
    
    useEffect(() => {
        if (formData) {
          reset(defaultValues);
        }
    }, [formData, defaultValues, reset]);


    // Handle Item

    const { number, removeSection } = props;

    const handleRemoveClick = () => {
        removeSection(number);
    };

    // Upload product image
    const [avatarImg, setAvatarImg] = useState(UploadImg); // Initial image
    const fileInputRef = useRef(null);

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
            setAvatarImg(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <FormProvider {...methods} onSubmit={onSubmit}>
                <div className="flex flex-col gap-[16px] p-[16px]">
                    <div className="flex justify-between items-center">
                        <Typography variant="h6">Category {number}</Typography>
                        <Button className="mt-5"
                            sx={{
                                width: '25px',
                                minWidth: 'unset',
                                height: '24px',
                                padding: '0 !important',
                                fontSize: '10px',
                                color: '#181818',
                                borderRadius: '50%',
                                backgroundColor: '#f6f6f6',
                                textTransform: 'unset',
                            }}
                            onClick={handleRemoveClick}
                        >
                            <RemoveIcon className="" sx={{ color: '#181818', fontSize: '18px' }} />
                        </Button>
                    </div>
                    <div className="flex justify-between items-end gap-[14px]">
                        <div className="w-fit relative cursor-pointer" onClick={handleAvatarClick}>
                            <Avatar variant="rounded" alt="avatar" src={avatarImg} sx={{ width: 72, height: 72, border: '1px solid #dce0e4' }} />
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept="image/jpeg,image/png"
                                onChange={handleFileChange}
                            />
                            <div className="absolute -right-2 -top-2 bg-[#F5F5F5] rounded-full p-[6px]">
                                <img src={icPen} />
                            </div>
                        </div>
                        <FormControl className="w-full">
                            <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Category</label>
                            <RHFTextField name="category" placeholder='Enter category name' />
                        </FormControl>
                    </div>
                    <FormControl className="w-full">
                        <label className='font-normal text-normal leading-[20px] text-[12px] pb-[4px]'>Description</label>
                        <RHFTextField name="category_desc" multiline rows='3' placeholder='Enter category description' />
                    </FormControl>
                </div>
            </FormProvider>
        </>
    );
}
