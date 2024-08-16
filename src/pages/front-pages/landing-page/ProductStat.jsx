import frontCommonStyles from './styles.module.css'

import React, { useState } from 'react';
import { Grid, Typography, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledSection = styled('section')(({ theme }) => ({
  paddingTop: theme.spacing(10.5),
  paddingBottom: theme.spacing(10.5),
  backgroundColor: theme.palette.background.paper,
}));

const CustomAvatar = styled(Avatar)(({ theme, skin, color }) => ({
  width: 82,
  height: 82,
  cursor: 'pointer',
  ...(skin === 'light' && {
    color: theme.palette[color].main,
    backgroundColor: theme.palette[color].light,
  }),
  ...(skin === 'filled' && {
    color: theme.palette.common.white,
    backgroundColor: theme.palette[color].main,
  }),
}));


// Data
const statData = [
  {
    title: 'Completed Sites',
    value: 137,
    icon: 'ri-layout-line',
    color: 'primary',
    isHover: false
  },
  {
    title: 'Working Hours',
    value: 1100,
    icon: 'ri-time-line',
    color: 'success',
    isHover: false
  },
  {
    title: 'Happy Customers',
    value: 137,
    icon: 'ri-user-smile-line',
    color: 'warning',
    isHover: false
  },
  {
    title: 'Awards Winning',
    value: 23,
    icon: 'ri-award-line',
    color: 'info',
    isHover: false
  }
]

const ProductStat = () => {
  const [hoverIndex, setHoverIndex] = useState(null)

  return (
 <StyledSection>
      <div className={frontCommonStyles.layoutSpacing}>
        <Grid container sx={{m: 'auto'}} spacing={6}>
          {statData.map((stat, index) => (
            <Grid item key={index} xs={6} md={3}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
                <CustomAvatar
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                  skin={hoverIndex === index ? 'filled' : 'light'}
                  color={stat.color}
                >
                  <i className={stat.icon} style={{ fontSize: '2.625rem' }} />
                </CustomAvatar>
                <div style={{ textAlign: 'center' }}>
                  <Typography color="textPrimary" variant="h4" fontWeight="bold">
                    {stat.value}+
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {stat.title}
                  </Typography>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
      </div>
    </StyledSection>
  )
}

export default ProductStat
