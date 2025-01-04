// ** React Imports
import { useState, Fragment } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import {GET_AVATAR_COMPRESSED_URL} from 'src/utils/utils'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import {useSelector} from 'react-redux'
// ** Context
import { useAuth } from 'src/hooks/useAuth'
import { Chip } from '@mui/material'

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}))

const UserDropdown = props => {
  // ** Props
  const { settings } = props

  // ** States
  const [anchorEl, setAnchorEl] = useState(null)

  // ** Hooks
  const router = useRouter()
  const { logout } = useAuth()
  const currentUser = useSelector((state) => state.user.details);
  const avatarUrl = currentUser?.avatar?.avatar_compressed ? GET_AVATAR_COMPRESSED_URL(currentUser?.avatar?.avatar_compressed) : "/images/avatars/1.png";
  // ** Vars
  const { direction } = settings

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = url => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: 'action.hover',
      borderRadius: 1,
    },
    '& svg': {
      mr: 2,
      fontSize: '1.375rem',
      color: 'text.primary'
    }
  }

  const handleLogout = () => {
    logout()
    handleDropdownClose()
  }

  return (
    <Fragment>
      <StyledBadge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        <Avatar
          alt={`${currentUser?.first_name} ${currentUser?.last_name}`}
          onClick={handleDropdownOpen}
          sx={{ 
            width: 40, 
            height: 40,
            transition: 'transform 0.2s ease',
            '&:hover': {
              transform: 'scale(1.1)',
            }
          }}
          src={avatarUrl || "/images/avatars/1.png"}
        />
      </StyledBadge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ 
          '& .MuiMenu-paper': { 
            width: 280,
            mt: 4,
            borderRadius: 2,
            boxShadow: theme => theme.shadows[3]
          } 
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StyledBadge
              overlap='circular'
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
            >
              <Avatar 
                alt={`${currentUser?.first_name} ${currentUser?.last_name}`} 
                src={avatarUrl || "/images/avatars/1.png"} 
                sx={{ width: '3rem', height: '3rem' }} 
              />
            </StyledBadge>
            <Box sx={{ display: 'flex', ml: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>
                {currentUser?.first_name} {currentUser?.last_name}
              </Typography>
              <Chip 
                size='small' 
                label={`@${currentUser?.username}`} 
                sx={{ 
                  fontWeight: 400,
                  backgroundColor: theme => theme.palette.mode === 'dark' 
                    ? `${theme.palette.primary.main}20`
                    : `${theme.palette.primary.main}15`,
                  color: theme => theme.palette.mode === 'dark'
                    ? theme.palette.primary.light
                    : theme.palette.primary.dark,
                  mt: 0.5
                }}
              />
              {currentUser?.role === 'trainer' && (
                <Chip
                  size='small'
                  label='TRAINER'
                  sx={{
                    mt: 1,
                    fontWeight: 500,
                    backgroundColor: theme => theme.palette.mode === 'dark'
                      ? `${theme.palette.success.main}20`
                      : `${theme.palette.success.main}15`,
                    color: theme => theme.palette.mode === 'dark'
                      ? theme.palette.success.light
                      : theme.palette.success.dark
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: '0 !important' }} />
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose(`/${currentUser?.username}/view`)}>
          <Box sx={styles}>
            <Icon icon='mdi:account-outline' />
            Profile
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/chat')}>
          <Box sx={styles}>
            <Icon icon='mdi:message-outline' />
            Chat
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/settings/account')}>
          <Box sx={styles}>
            <Icon icon='mdi:cog-outline' />
            Settings
          </Box>
        </MenuItem>
      
       
        <Divider />
        <MenuItem
          onClick={handleLogout}
          sx={{ py: 2, '& svg': { mr: 2, fontSize: '1.375rem', color: 'text.primary' } }}
        >
          <Icon icon='mdi:logout-variant' />
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
