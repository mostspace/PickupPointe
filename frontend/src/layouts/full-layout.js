import React, { useState, useEffect } from 'react'
// @Mui
import { Box } from "@mui/material"
// Components
import Header from 'src/layouts/header'
import Footer from 'src/layouts/main-footer'

// ------------------------------------------------------------------------------------------------------------------

export default function FullLayout({ children, footer }) {

    const [isFixed, setIsFixed] = useState(false);

    // useEffect(() => {
    //     const handleScroll = () => {
    //         setIsFixed(window.scrollY > 30);
    //     };

    //     window.addEventListener("scroll", handleScroll);

    //     return () => {
    //         window.removeEventListener("scroll", handleScroll);
    //     };
    // }, []);

    return (
        <div className='bg-[#F6F6F6] h-full flex flex-col gap-[20px] p-[15px] lg:p-[32px] min-h-[100vh]'>
            <Box className={`w-full ${isFixed ? "fixed rounded-b-[16px]" : "relative rounded-[16px]"}`}
                sx={{
                    top: { xs: "0", md: "0" },
                    left: { xs: "0", md: "50%" },
                    zIndex: "999",
                    transform: { xs: "unset", md: "translateX(-50%)" },
                    padding: { xs: "16px", md: "16px 48px" },
                    background: "#ffffff",
                    boxShadow: isFixed
                        ? {
                            xs: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            md: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        }
                        : "none",
                    transition: "all 0.3s ease",
                }}
            >
                <Header/>
            </Box>

            <div className='w-full flex-1 bg-white rounded-[24px] p-0'>
                {children}
            </div>

            {footer && (
                <Footer />
            )}
        </div>
    )
}