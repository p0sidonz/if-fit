// ** Next Import
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import axios from  "../../../../src/utils/axios"
import { useRouter } from 'next/router'
import Logo from 'src/views/components/Logo'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import jwt from 'jsonwebtoken'

// ** MUI Components
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

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

const ForgotChangePassword = () => {
  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const router = useRouter()
  const { token } = router.query

  // ** Vars
  const { skin } = settings
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // Update state for password fields
  const [formData, setFormData] = useState({
    password: '',
    rePassword: ''
  })
  const [loading, setLoading] = useState(false)

  // Add useEffect to check token on component mount
  useEffect(() => {
    if (token) {
      const decoded = jwt.decode(token)
      
      if (!decoded) {
        toast.error('Invalid reset token')
        router.push('/login')
        return
      }

      // Check if token is expired
      const currentTime = Date.now() / 1000 // Convert to seconds
      if (decoded.exp && decoded.exp < currentTime) {
        toast.error('Password reset link has expired. Please request a new one.')
        router.push('/forgot-password')
        return
      }
    }
  }, [token, router])

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Validate passwords match
      if (formData.password !== formData.rePassword) {
        throw new Error('Passwords do not match')
      }

      const response = await axios.post(`/auth/change-password/${token}`, {
        password: formData.password,
        rePassword: formData.rePassword
      })
      
      if (!response?.data?.ok) {
        throw new Error(response?.data?.message || 'Failed to reset password')
      }

      toast.success('Password reset successful')
      router.push('/login')
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message || 'Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const imageSource =
    skin === 'bordered' ? 'auth-v2-forgot-password-illustration-bordered' : 'auth-v2-forgot-password-illustration'


    if(token){
      const decoded = jwt.decode(token)
      console.log(decoded)
    }

    
  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1, width: '100%', maxWidth: 450 }}>
        <CardContent sx={{ p: theme => `${theme.spacing(7)} !important` }}>
          <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Logo sx={{ width: '35px', height: '35px' }} />
          </Box>
          
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <TypographyStyled variant='h5'>Change Password 🔒</TypographyStyled>
            <Typography variant='body2'>
              Enter your new password
            </Typography>
          </Box>

          <form noValidate autoComplete='off' onSubmit={handleSubmit}>
            <TextField
              autoFocus
              type='password'
              label='New Password'
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              sx={{ display: 'flex', mb: 4 }}
              fullWidth
            />
            <TextField
              type='password'
              label='Confirm Password'
              value={formData.rePassword}
              onChange={e => setFormData({ ...formData, rePassword: e.target.value })}
              sx={{ display: 'flex', mb: 4 }}
              fullWidth
            />
            <Button
              fullWidth
              size='large'
              type='submit'
              variant='contained'
              sx={{ mb: 5.25 }}
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LinkStyled href='/login'>
                <Icon icon='mdi:chevron-left' fontSize='2rem' />
                <span>Back to login</span>
              </LinkStyled>
            </Box>
          </form>
        </CardContent>
      </Card>

      {!hidden ? (
        <FooterIllustrationsV2 />
      ) : null}
    </Box>
  )
}
ForgotChangePassword.guestGuard = true
ForgotChangePassword.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default ForgotChangePassword
