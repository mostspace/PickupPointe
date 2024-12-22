import {
  FormControl, Typography, IconButton, InputAdornment, TextField,
} from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
// Assets
import { icCopy } from "src/assets";

export default function ReferralLinkForm() {

    const user = useSelector((state) => state.auth.user);

    // Clipboard invite link
    const inviteLink = 'https://www.pickuppointe.com/referral/' + user?._id;
    const handleCopyClick = () => {
            navigator.clipboard.writeText(inviteLink)
            .then(() => {
            toast("Invite link copied to clipboard!", {
                theme: "light",
                style: {
                backgroundColor: "white",
                color: "primary",
                fontFamily: 'Gilroy',
                fontSize: '14px',
                },
            });
        })
        .catch((err) => {
            console.error("Failed to copy: ", err);
        });
    };

    return (
        <div className='flex flex-col gap-[32px] mt-6'>
            <Typography variant="subtitle3">Invite a friend to join Pickup Pointe, whether as a vendor or a shopper, and enjoy a reduction in your POS fees. Upon their first purchase, you’ll receive a 1% reduction on your POS fees for 30 days. Invite two friends, and you’ll get an additional 30 days of reduced fees. You can continue this process, extending your benefit period until you reach a maximum of one year.</Typography>
            <FormControl variant="standard" className=''>
                <Typography variant="label" className='pb-[4px]'>Your personal link</Typography>
                <TextField
                    readOnly 
                    placeholder="Paste your invite link"
                    value={inviteLink}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleCopyClick}>
                            <img src={icCopy} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
            </FormControl>
        </div>
    )
}