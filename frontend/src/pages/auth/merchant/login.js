import {useState, useCallback, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
// @mui
import {
    Box, FormControl, IconButton, InputAdornment, styled, Typography, TextField,
} from '@mui/material';
// Assets
import { logo, Pickup_delivery } from 'src/assets';
// Components
import DefaultButton from 'src/components/button/default-button';
import Iconify from 'src/components/iconify/iconify';
import { TextConstants } from 'src/constants/textConstants';
import { toast } from 'react-toastify';
// import { merchantLogin } from 'src/api/merchant';
import {merchantLogin} from "src/reducers/merchant/authSlice.js"
import {useDispatch, useSelector} from 'react-redux';
import {jwtDecode} from "jwt-decode";

// ---------------------------------------------------------------------------------------

const StyledImage = styled('img')(({ theme }) => ({
    width: '100%',
    maxWidth: '200px',
    [theme.breakpoints.down('sm')]: {
        maxWidth: '130px',
    },
}));

// ---------------------------------------------------------------------------------------

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {token, loading} = useSelector(state => state.merchant.auth);

    useEffect(() => {
        try {
            const data = jwtDecode(token);
            const current = Date.now() / 1000;
            if (data.exp > current) {
                navigate("/merchant/all-orders")
            }
        } catch (err) {
            console.log(err)
        }
    }, [token]);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        pickupId: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (prop) => (event) => {
        setFormData({ ...formData, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => setShowPassword(prev => !prev);

    const handleMouseDownPassword = useCallback((event) => {
        event.preventDefault();
    }, []);

    const onLogin = async () => {
        setIsLoading(true);
        try {
            dispatch(merchantLogin(formData));
            // const res = await merchantLogin(formData)
            // dispatch(setUser(res))
            // dispatch(setToken(res.token))
        } catch (error) {
            toast('Login failed', { type: 'error', className: 'toast-custom' })
        }
        setIsLoading(false)
    }

    return (
        <section className='w-full h-full min-h-[100vh] p-[15px] sm:p-[32px] bg-[#F6F6F6] flex justify-center'>
            <div className="w-full max-w-[960px] max-h-content p-[32px] bg-white rounded-[24px] flex justify-center">
                <div className='max-w-[464px] w-full flex flex-col gap-[36px] justify-start'>
                    <div className='flex flex-col gap-[40px] justify-start'>
                        <Box sx={{ width: "200px" }}>
                            <Link to="/" smooth={'true'} duration={500} offset={-70} style={{ display: "flex", alignItems: "center", cursor: "pointer" }} className="gap-[12px]">
                                <StyledImage src={logo} alt="Logo" style={{ cursor: "pointer", width: "44px", height: "33px" }} />
                                <span className="text-[18px] font-gilroyBold">{TextConstants.PICKUPPOINTE}</span>
                            </Link>
                        </Box>
                    </div>
                    <div className='flex gap-[40px] justify-start'>
                        <img src={Pickup_delivery} className='w-[278px]' loading="lazy"/>
                    </div>
                    <div className='w-full flex flex-col gap-[40px]'>
                        <div className='flex flex-col gap-[12px]'>
                            <Typography variant="h2" className='font-gilroyMedium'>{TextConstants.LoginAccount}</Typography>
                            <Typography variant="subtitle1">{TextConstants.WelcomeText}</Typography>
                        </div>

                        <div className='flex flex-col gap-[16px]'>
                            <FormControl variant="standard">
                                <Typography variant="subtitle3" className="pb-[5px]">{TextConstants.EmailAddress}</Typography>
                                <TextField
                                    variant='outlined'
                                    type="pickupId"
                                    size="small"
                                    placeholder='Enter email address or User ID'
                                    fullWidth
                                    required
                                    value={formData.email}
                                    onChange={handleChange('pickupId')}
                                />
                            </FormControl>
                            <FormControl variant="outlined" className='relative'>
                                <Typography variant="subtitle3" className="pb-[5px]">{TextConstants.Password}</Typography>
                                <TextField
                                    variant='outlined'
                                    size="small"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange('password')}
                                    placeholder='Enter password'
                                    fullWidth
                                    required
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? (
                                                        <Iconify icon="solar:eye-bold" width={24} />
                                                    ) : (
                                                        <Iconify icon="solar:eye-closed-bold" width={24} />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </FormControl>
                        </div>

                        <DefaultButton value={TextConstants.SignIn} onClick={onLogin} loading={isLoading || loading} btnStatus={!(formData.pickupId && formData.password)} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;