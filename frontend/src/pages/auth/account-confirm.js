import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// @mui
import { FormControl, TextField } from '@mui/material';

// Constants
import { BASE_URL } from 'src/config-global';

// Asset
import { accountConfirmImg } from "src/assets";

import { useSelector } from 'react-redux';

// Components
import Button from "src/components/button/primary-button";

const AccountConfirm = () => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [confirmCode, setConfirmCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.userInfo);
  
    useEffect(() => {
        const storedEmail = user?.email || localStorage.getItem('shopperEmail');
        const userRole = user?.role || 'shopper'
        console.log(storedEmail)
        console.log(userRole)
        if (storedEmail) {
            setEmail(storedEmail);
            setRole(userRole)
        }
     
    }, []);

    useEffect(()=>{
        if(!user?.verified && email!=""){
            handleResendCode()
        }
    },[email])

    const handleCodeChange = (event) => {
        setConfirmCode(event.target.value);
    };

    const handleConfirm = async () => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const response = await axios.post(`${BASE_URL}/api/v1/${role}/verify`, { email, confirmCode });
            console.log(response)
            if(response.status==200){
                setSuccess('Account confirmed successfully!');
                setTimeout(() => {
                    navigate('/login');
                }, 2000); // Redirect after 2 seconds
            }
           
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid confirmation code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await axios.post(`${BASE_URL}/api/v1/${role}/send-verification-code`, { email });
            setSuccess('A new confirmation code has been sent to your email.');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend confirmation code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='bg-[#F6F6F6] min-h-[100vh] flex justify-center items-center sm:p-[32px]'>
            <div className="max-w-[1312px] w-full">
                <div className='sm:flex justify-between gap-[48px] bg-white sm:p-[48px] items-center justify-center rounded-[24px]'>
                    <div className='w-full h-full flex justify-center items-center p-[5px] sm:p-0'>
                        <img src={accountConfirmImg} className='w-[50%] sm:w-auto rounded-[18px]' loading="lazy" alt='Account Confirmation' />
                    </div>
                    <div className='w-full flex justify-center items-center'>
                        <div className='max-w-[578px] p-[24px] sm:p-[64px] bg-[#fbfbfc] rounded-[24px]'>
                            <div className='grid gap-[40px]'>
                                <div>
                                    <h2 className='text-[32px] font-medium leading-[44px] text-heading pb-4 text-center ss:text-left'>Congratulations! Your account was created successfully.</h2>
                                    <p className='text-normal text-[16px] leading-[26px] font-normal'>We have sent you a confirmation code to your email address</p>
                                </div>
                                <div className='grid gap-[14px]'>
                                    <FormControl variant="standard">
                                        <label className='font-normal text-normal leading-[20px] text-[14px] pb-[4px]'>Confirmation code</label>
                                        <TextField
                                            variant={'outlined'}
                                            size="small"
                                            required
                                            fullWidth
                                            type="text"
                                            placeholder='Paste confirmation code here'
                                            value={confirmCode}
                                            onChange={handleCodeChange}
                                        />
                                    </FormControl>
                                    {error && <p className='text-red-500'>{error}</p>}
                                    {success && <p className='text-green-500'>{success}</p>}
                                    <p className='font-normal text-[14px] leading-[20px] text-normal pt-[16px]'>Didn't receive the code? Check your spam or <span className='text-heading underline cursor-pointer' onClick={handleResendCode}>resend a new code</span>.</p>
                                </div>
                            </div>
                            <div className="mt-[60px] sm:mt-[100px] md:mt-[150px] lg:mt-[200px] flex justify-between items-center gap-[14px]">
                                <Button
                                    click={handleResendCode}
                                    className="w-full"
                                    value={loading ? "Resending..." : "Resend code"}
                                    bg={"rgba(245, 245, 245, 1)"}
                                    size={'100%'}
                                    color={"rgba(24, 24, 24, 1)"}
                                    disabled={loading}
                                />
                                <Button
                                    click={handleConfirm}
                                    className="w-full"
                                    value={loading ? "Confirming..." : "Confirm"}
                                    size={'100%'}
                                    bg={"rgba(241, 68, 69, 1)"}
                                    color={"rgba(254, 254, 255, 1)"}
                                    disabled={loading || !confirmCode}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AccountConfirm;