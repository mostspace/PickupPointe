import React from 'react'
import { Container, styled } from '@mui/material'
import { landingHero } from 'src/assets'

const ImageSection = () => {
  return (
    <>
      <Container maxWidth='xl' className='p-0'>
        <StyledImage src={landingHero} alt={'Pickup Pointe restaurant listings example'}/>
      </Container>
    </>
  )
}

export default ImageSection;

const StyledImage = styled('img')(({ theme }) => ({
  width: '100%', 
  maxWidth: '100%',
  padding: 0,
}));