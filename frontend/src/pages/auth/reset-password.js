import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { resetPasswordImg } from "src/assets";
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

// Constants
import { BASE_URL } from 'src/config-global';

const ResetPassword = () => {
    const [recoverCode, setRecoverCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';

    const handleCodeChange = (event) => {
        setRecoverCode(event.target.value);
    };

    const handleResendCode = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        // Basic email validation (optional)
        if (!email) {
            setError('Email is required to resend the code.');
            setLoading(false);
            return;
        }

        try {
            await axios.post(`${BASE_URL}/api/v1/shopper/send-recover-code`, { email });
            setSuccess('A new recovery code has been sent to your email.');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to resend recovery code. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async () => {
        setLoading(true);
        setError('');
        setSuccess('');
    
        try {
            await axios.post(`${BASE_URL}/api/v1/shopper/recover`, { email, recoverCode });
            // Navigate to NewPassword page with email as state
            navigate('/new-password', { state: { email, password: recoverCode } }); // You can also pass a password here if needed
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Invalid recovery code. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };    

    return (
        <section id='resetPassword' className='bg-[#F6F6F6] min-h-[100vh] flex justify-center items-center sm:p-[32px]'>
            <div className="max-w-[1312px] w-full p-[10px] sm:p-0">
                <div className='sm:flex justify-between gap-[48px] bg-white sm:p-[48px] items-center justify-center rounded-[24px] py-[25px]'>
                    <div className='w-full h-full flex justify-center items-center p-[5px] sm:p-0'>
                        <img src={resetPasswordImg} className='w-[75%] sm:w-auto rounded-[18px]' alt='Reset Password' loading="lazy"/>
                    </div>
                    <div className='w-full flex justify-center items-center'>
                        <div className='max-w-[578px] p-[24px] sm:p-[64px] bg-white sm:bg-[#fbfbfc] rounded-[24px]'>
                            <div className='grid gap-[40px]'>
                                <div>
                                    <h2 className='text-[32px] font-medium leading-[44px] text-heading pb-4 text-center ss:text-left'>Reset password</h2>
                                    <p className='text-normal text-[16px] leading-[26px] font-normal'>We have sent you a password recovery code to your email address.</p>
                                </div>
                                <div className='grid gap-[14px]'>
                                    <FormControl variant="standard">
                                        <label className='font-normal text-normal leading-[20px] text-[14px] pb-[4px]'>Recovery code</label>
                                        <TextField
                                            variant={'outlined'}
                                            size="small"
                                            required
                                            fullWidth
                                            type="text" // Changed to text for flexibility
                                            placeholder='Paste recovery code here'
                                            value={recoverCode}
                                            onChange={handleCodeChange}
                                            disabled={loading}
                                        />
                                    </FormControl>
                                    {error && <p className='text-red-500'>{error}</p>}
                                    {success && <p className='text-green-500'>{success}</p>}
                                    <p className='font-normal text-[14px] leading-[20px] text-normal pt-[16px]'>
                                        Didn't receive the code? Check your spam or 
                                        <span 
                                            className='text-heading underline cursor-pointer pl-1' 
                                            onClick={handleResendCode}
                                        >
                                            resend a new code
                                        </span>.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-[60px] sm:mt-[100px] md:mt-[150px] lg:mt-[200px] flex justify-between items-center gap-[14px]">
                                <Button
                                    sx={{
                                        width: '100%',
                                        height: '44px',
                                        fontFamily: 'Gilroy',
                                        fontSize: '14px',
                                        color: '#181818',
                                        borderRadius: '8px',
                                        backgroundColor: '#F5F5F5',
                                        textTransform: 'unset',
                                    }}
                                    onClick={handleResendCode}
                                    disabled={loading}
                                >
                                    {loading ? "Resending..." : "Resend code"}
                                </Button>
                                <Button
                                    sx={{ 
                                        width: '100%',
                                        height: '44px',
                                        fontFamily: 'Gilroy',
                                        fontSize: '14px',
                                        color: '#ffffff',
                                        borderRadius: '8px',
                                        backgroundColor: '#F14445',
                                        textTransform: 'unset',
                                        '&:hover': {
                                            backgroundColor: '#E13031',
                                        },
                                        "&:disabled": {
                                            background: '#ccc',
                                            color: '#999'
                                        }
                                    }}
                                    onClick={handleConfirm}
                                    disabled={loading || !recoverCode}
                                >
                                    {loading ? "Confirming..." : "Confirm"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ResetPassword;
