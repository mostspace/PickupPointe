import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Don't forget to import axios
import { forgotPasswordImg } from "src/assets";
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

// Constants
import { BASE_URL } from 'src/config-global';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleSubmit = async () => {
        if (!email) {
            setError('Please enter a valid email address.');
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            // Make POST request to send recovery code
            await axios.post(`${BASE_URL}/api/v1/shopper/send-recover-code`, { email });
            // Navigate to reset password page with the email state
            navigate('/reset-password', { state: { email } }); 
        } catch (err) {
            // Display a more detailed error message if available
            setError(err.response?.data?.message || 'Failed to send recovery email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='bg-[#F6F6F6] min-h-[100vh] flex justify-center items-center sm:p-[32px]'>
            <div className="max-w-[1312px] w-full p-[10px] sm:p-0">
                <div className='sm:flex justify-between gap-[48px] bg-white sm:p-[48px] items-center justify-center rounded-[24px] py-[25px]'>
                    <div className='w-full h-full flex justify-center items-center p-[5px] sm:p-0'>
                        <img src={forgotPasswordImg} className='w-[75%] sm:w-auto rounded-[18px]' alt='Forgot Password' loading="lazy"/>
                    </div>
                    <div className='w-full flex justify-center items-center'>
                        <div className='max-w-[578px] p-[24px] sm:p-[64px] bg-white sm:bg-[#fbfbfc] rounded-[24px]'>
                            <div className='grid gap-[40px]'>
                                <div>
                                    <h2 className='text-[32px] font-medium leading-[44px] text-heading pb-4 text-center ss:text-left'>Forgot password?</h2>
                                    <p className='text-normal text-[16px] leading-[26px] font-normal'>Enter the email address you used to create your Pickup Pointe account. We'll send you a recovery code.</p>
                                </div>
                                <div className='grid gap-[14px]'>
                                    <FormControl variant="standard">
                                        <label className='font-normal text-normal leading-[20px] text-[14px] pb-[4px]'>Email address</label>
                                        <TextField
                                            variant={'outlined'}
                                            size="small"
                                            required
                                            fullWidth
                                            type="email"
                                            placeholder='Enter email address'
                                            value={email}
                                            onChange={handleEmailChange}
                                            disabled={loading} // Disable the field when loading
                                        />
                                    </FormControl>
                                    {error && <p className='text-red-500'>{error}</p>}
                                </div>
                            </div>
                            <div className="mt-[60px] sm:mt-[100px] md:mt-[150px] lg:mt-[200px] flex justify-between items-center gap-[14px]">
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
                                        }
                                    }}
                                    onClick={handleSubmit}
                                    disabled={loading}
                                >
                                    {loading ? "Sending..." : "Confirm"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ForgotPassword;
