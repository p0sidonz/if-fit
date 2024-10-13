// React Imports

import React, { useState, useEffect } from 'react';
import { Typography, Button, Box, Container, useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/system';
import Link from 'next/link';


const HeroSection = ({ mode }) => {
  const [dashboardPosition, setDashboardPosition] = useState({ x: 0, y: 0 });
  const [elementsPosition, setElementsPosition] = useState({ x: 0, y: 0 });

  const theme = useTheme();
  const isAboveLgScreen = useMediaQuery(theme.breakpoints.up('lg'));

  const images = {
    dashboardLight: '/images/front-pages/landing-page/hero-dashboard-light.png',
    dashboardDark: '/images/front-pages/landing-page/hero-dashboard-dark.png',
    elementsLight: '/images/front-pages/landing-page/hero-elements-light.png',
    elementsDark: '/images/front-pages/landing-page/hero-elements-dark.png',
    bgLight: '/images/front-pages/landing-page/hero-bg-light.png',
    bgDark: '/images/front-pages/landing-page/hero-bg-dark.png',
  };

  const dashboardImage = mode === 'dark' ? images.dashboardDark : images.dashboardLight;
  const elementsImage = mode === 'dark' ? images.elementsDark : images.elementsLight;
  const heroSectionBg = mode === 'dark' ? images.bgDark : images.bgLight;

  useEffect(() => {
    const handleMouseMove = (ev) => {
      const { clientX, clientY } = ev;
      const { innerWidth, innerHeight } = window;

      setDashboardPosition({
        x: (innerWidth - clientX * 2) / 100,
        y: Math.max((innerHeight - clientY * 2) / 100, -40),
      });

      setElementsPosition({
        x: (innerWidth - clientX * 2.5) / 100,
        y: Math.max((innerHeight - clientY * 2.5) / 100, -40),
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);


  const StyledSection = styled('section')(({ theme }) => ({
    position: 'relative',
    overflow: 'hidden',
    paddingTop: 70,
    marginTop: -70,
    backgroundColor: theme.palette.background.paper,
    zIndex: 1,
  }));
  
  
  const HeroBackground = styled('img')({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: -1,
  });
  
  const HeroContent = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    maxWidth: '100%',
    margin: '0 auto',
    [theme.breakpoints.up('md')]: {
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  }));
  
  const HeroImage = styled(Box)(({ theme }) => ({
    position: 'relative',
    textAlign: 'center',
    '& img': {
      maxWidth: '100%',
      height: 'auto',
    },
  }));
  
  const HeroElements = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  }));

  return (
    <StyledSection id="home">
 <HeroBackground src={heroSectionBg} alt="hero-bg" />
       <Container className='mx-auto'>
        <HeroContent>
          <Typography variant="h2" color="primary" fontWeight="fontWeightBold" gutterBottom>
            All in one SaaS application for your business
          </Typography>
          <Typography variant="body1" color="text.primary" paragraph>
            No coding required to make customizations. The live customizer has everything your marketing needs.
          </Typography>
          <Button
            component={Link}
            href="/front-pages/landing-page#pricing-plans"
            variant="contained"
            color="primary"
            size="large"
          >
            Get Early Access
          </Button>
        </HeroContent>
    
      <HeroImage
        sx={{
          transform: isAboveLgScreen
            ? `translate(${dashboardPosition.x}px, ${dashboardPosition.y}px)`
            : 'none',
        }}
      >
        <Link href="/" target="_blank">
          <img src={dashboardImage} alt="dashboard-image" />
          <HeroElements
            sx={{
              transform: isAboveLgScreen
                ? `translate(${elementsPosition.x}px, ${elementsPosition.y}px)`
                : 'none',
            }}
          >
            <img src={elementsImage} alt="dashboard-elements" />
          </HeroElements>
        </Link>
      </HeroImage>
      </Container>
    </StyledSection>
  )
}

export default HeroSection
