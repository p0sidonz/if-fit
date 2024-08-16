// React Imports
import { useEffect, useRef } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
// import { useIntersection } from '../../../hooks/useIntersection'
import React from 'react';
import { Box, Container } from '@mui/material';
import { styled } from '@mui/system';


// SVG Imports
import Lines from '../../../assets/svg/front-pages/landing-page/Lines'
import LaptopCharging from '../../../assets/svg/front-pages/landing-page/LaptopCharging'
import TransitionUp from '../../../assets/svg/front-pages/landing-page/TransitionUp'
import Edit from '../../../assets/svg/front-pages/landing-page/Edit'
import Cube from '../../../assets/svg/front-pages/landing-page/Cube'
import LifeBuoy from '../../../assets/svg/front-pages/landing-page/Lifebuoy'
import Document from '../../../assets/svg/front-pages/landing-page/Document'

// Styles Imports
import styles from './styles.module.css'
import frontCommonStyles from './styles.module.css'

// Data
const feature = [
  {
    icon: <LaptopCharging />,
    title: 'Quality Code',
    description: 'Code structure that all developers will easily understand and fall in love with.'
  },
  {
    icon: <TransitionUp />,
    title: 'Continuous Updates',
    description: 'Free updates for the next 12 months, including new demos and features.'
  },
  {
    icon: <Edit />,
    title: 'Stater-Kit',
    description: 'Start your project quickly without having to remove unnecessary features.'
  },
  {
    icon: <Cube />,
    title: 'API Ready',
    description: 'Just change the endpoint and see your own data loaded within seconds.'
  },
  {
    icon: <LifeBuoy />,
    title: 'Excellent Support',
    description: 'An easy-to-follow doc with lots of references and code examples.'
  },
  {
    icon: <Document />,
    title: 'Well Documented',
    description: 'An easy-to-follow doc with lots of references and code examples.'
  }
]

const UsefulFeature = () => {
  // Refs
  const skipIntersection = useRef(true)
  const ref = useRef(null)

  // Hooks
  // const { updateIntersections } = useIntersection()

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     ([entry]) => {
  //       if (skipIntersection.current) {
  //         skipIntersection.current = false

  //         return
  //       }

  //       updateIntersections({ [entry.target.id]: entry.isIntersecting })
  //     },
  //     { threshold: 0.35 }
  //   )

  //   ref.current && observer.observe(ref.current)
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])
  const StyledSection = styled('section')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(12, 0),
  }));
  
  const FeatureIcon = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 82,
    height: 82,
    borderRadius: '50%',
    border: `2px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing(2),
  }));

  return (
    <StyledSection id="features">
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}
          >
            <Lines /> Useful Feature
          </Typography>
          <Typography variant="h4" component="h2" fontWeight="bold" sx={{ mb: 1 }}>
            Everything you need
          </Typography>
          <Typography variant="h5" sx={{ mb: 2 }}>
            to start your next project
          </Typography>
          <Typography variant="body1">
            Not just a set of tools, the package includes ready-to-deploy conceptual application.
          </Typography>
        </Box>

        <Grid container spacing={6}>
          {feature.map((feature, index) => (
            <Grid item xs={12} sm={6} lg={4} key={index}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <FeatureIcon>
                  {feature.icon}
                </FeatureIcon>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ maxWidth: 364 }}>
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </StyledSection>
  )
}

export default UsefulFeature
