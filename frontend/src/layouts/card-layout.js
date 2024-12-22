import React, { useState, useEffect } from 'react'
// @Mui
import { Container, Grid } from "@mui/material";
// Components
import Header from 'src/layouts/header';
import FloatingActionButtons from 'src/components/floating-action-button';

// ------------------------------------------------------------------------------------------------------------------

export default function CardLayout({ children }) {

    const [isFixed, setIsFixed] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsFixed(window.scrollY > 40);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className='bg-[#F6F6F6] flex flex-col gap-[20px] p-[15px] sm:px-[32px] xl:px-[64px] py-[32px] min-h-[100vh] !h-auto'>
            <div className="flex justify-center items-start">
                <div className="max-w-[1312px] w-full">
                    <Container
                        maxWidth="xl"
                        className={`${isFixed ? "fixed" : "relative"} rounded-[16px]`}
                        sx={{
                            top: { xs: "0", md: "0" },
                            left: { xs: "0", md: "50%" },
                            zIndex: "999",
                            transform: { xs: "unset", md: "translateX(-50%)" },
                            padding: { xs: "16px", md: "16px 48px" },
                            background: "#fff",
                            width: { xs: "100%", md: "100%" },
                            maxWidth: { xs: "100%", md: "1312px", lg: "1312px" },
                            boxShadow: isFixed ? 
                                {
                                    xs: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                    md: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                }
                                : "none",
                            transition: "all 0.3s ease",
                        }}
                    >
                        <Header />
                    </Container>
                </div>
            </div>

            <Container 
                maxWidth="xl"
                sx={{
                    display: 'flex',
                    flexGrow: 1,
                    padding: { xs: '16px', md: '48px' },
                    background: '#ffffff',
                    borderRadius: '24px',
                    width: { xs: '100%', md: '100%' },
                    height: '100%',
                    maxWidth: { xs: '100%', md: '1312px', lg: '1312px' },
                }}
            >
                <div className="w-full flex-1">
                    {children}
                </div>
            </Container>

            <FloatingActionButtons/>
        </div>
    )
}