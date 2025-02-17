// ** Next Import
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import axios from  "../../../src/utils/axios"

// ** MUI Components
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Logo from 'src/views/components/Logo'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'

// Styled Components
const ForgotPasswordIllustrationWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(20),
  paddingRight: '0 !important',
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(10)
  }
}))

const ForgotPasswordIllustration = styled('img')(({ theme }) => ({
  maxWidth: '48rem',
  [theme.breakpoints.down('xl')]: {
    maxWidth: '38rem'
  },
  [theme.breakpoints.down('lg')]: {
    maxWidth: '30rem'
  }
}))

const RightWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 400
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 450
  }
}))

const BoxWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down('md')]: {
    maxWidth: 400
  }
}))

const TypographyStyled = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: '0.18px',
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  '& svg': { mr: 1.5 },
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: theme.palette.primary.main
}))

const ForgotPassword = () => {
  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()

  // ** Vars
  const { skin } = settings

  // Add state for email and loading
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await axios.post('/auth/forgot', {
        email: email
      })
      
      if (!response?.data?.ok) {
        throw new Error('Failed to send reset link')
      }

      // Show success message
      toast.success(response?.data?.message || 'Reset link sent to your email')
    } catch (error) {
      console.error(error)
      toast.error('Failed to send reset link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const imageSource =
    skin === 'bordered' ? 'auth-v2-forgot-password-illustration-bordered' : 'auth-v2-forgot-password-illustration'

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1, width: '100%', maxWidth: 450 }}>
        <CardContent sx={{ p: theme => `${theme.spacing(7)} !important` }}>
          <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Logo />
          </Box>
          
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <TypographyStyled variant='h5'>Forgot Password? 🔒</TypographyStyled>
            <Typography variant='body2'>
              Enter your email and we&prime;ll send you instructions to reset your password
            </Typography>
          </Box>

          <form noValidate autoComplete='off' onSubmit={handleSubmit}>
            <TextField 
              autoFocus 
              type='email' 
              label='Email' 
              value={email}
              onChange={e => setEmail(e.target.value)}
              sx={{ display: 'flex', mb: 4 }} 
            />
            <Button 
              fullWidth 
              size='large' 
              type='submit' 
              variant='contained' 
              sx={{ mb: 5.25 }}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </Button>
            <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LinkStyled href='/login'>
                <Icon icon='mdi:chevron-left' fontSize='2rem' />
                <span>Back to login</span>
              </LinkStyled>
            </Typography>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}
ForgotPassword.guestGuard = true
ForgotPassword.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default ForgotPassword
