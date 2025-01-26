import BlankLayout from 'src/@core/layouts/BlankLayout'
import { Box, Typography, Button } from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'


const Already = () => {
  const { user, logout } = useAuth()
  const userData = JSON.parse(localStorage.getItem('userData'))
  console.log("Fdsfdsfdsfdsf", userData, user)

  const handleLogout = () => {
    logout({
      returnUrl: '/pricing',
      callback: () => {
        window.location.reload()
      }
    })
  }

  return (
    <Box 
      className='content-center'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4
      }}
    >
      <Typography variant='h4' sx={{ textAlign: 'center' }}>
        You are already logged in as '{userData?.first_name} {userData?.last_name}'
      </Typography>
      <Button variant='contained' onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  )
}
Already.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default Already
