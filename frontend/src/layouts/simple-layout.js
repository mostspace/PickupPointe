import React from 'react'

import { Container, Grid, } from "@mui/material";


export default function SimpleLayout({ children }) {

    return (
        <div className='bg-[#F6F6F6] !h-full flex flex-col gap-[20px] p-[15px] sm:px-[64px] py-[32px] min-h-[100vh] overflow-auto'>
            <Container 
                maxWidth="xl"
                sx={{
                padding: { xs: '16px', md: '48px' },
                background: '#ffffff',
                borderRadius: '24px',
                width: { xs: '100%', md: '100%' }, // Keep navbar width consistent on larger screens
                maxWidth: { xs: '100%', md: '1312px', lg: '1312px' }, // Set a maximum width for larger screens
                }}
            >
                <Grid container>
                    {children}
                </Grid>
            </Container>
        </div>
    )
}
