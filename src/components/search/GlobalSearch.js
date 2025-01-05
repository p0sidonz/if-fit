import { useState, useCallback } from 'react'
import { styled, alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import InputBase from '@mui/material/InputBase'
import Avatar from '@mui/material/Avatar'
import CircularProgress from '@mui/material/CircularProgress'
import { useSearchTrainers } from '../../modules/user/hooks/useUserData'
import {GET_AVATAR_COMPRESSED_URL} from 'src/utils/utils'
import useNavigateTo from '../../modules/components/useRouterPush';
import debounce from 'lodash/debounce'

// Styled components
const SearchWrapper = styled('div')(({ theme, isOpen }) => ({
  position: isOpen ? 'fixed' : 'relative',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1200,
  display: 'flex',
  flexDirection: 'column',
  alignItems: isOpen ? 'center' : 'flex-start',
  padding: isOpen ? theme.spacing(2) : 0,
  backgroundColor: isOpen ? alpha(theme.palette.background.default, 0.6) : 'transparent',
  backdropFilter: isOpen ? 'blur(0.2px)' : 'none',
  transition: 'all 0.3s ease'
}))

const SearchInput = styled(InputBase)(({ theme }) => ({
  width: '100%',
  maxWidth: '600px',
  margin: '0 auto',
  marginTop: theme.spacing(8),
  padding: theme.spacing(1),
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    fontSize: '1.25rem'
  }
}))

const ResultsContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '600px',
  marginTop: theme.spacing(2),
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  maxHeight: '60vh',
  overflowY: 'auto'
}))

const GlobalSearch = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  
  // Use debounced query for API call instead of direct searchQuery
  const { data: trainers, isLoading, error } = useSearchTrainers(debouncedQuery)
  
  // Create a debounced function to update the search query
  const debouncedSetQuery = useCallback(
    debounce((value) => {
      setDebouncedQuery(value)
    }, 800),
    []
  )

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    debouncedSetQuery(value)
  }

  const navigateTo = useNavigateTo();

  const handleClose = () => {
    setIsSearchOpen(false)
    setSearchQuery('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClose()
    }
  }

  return (
    <>
      <IconButton color='inherit' onClick={() => setIsSearchOpen(true)}>
        <SearchIcon />
      </IconButton>

      {isSearchOpen && (
        <SearchWrapper 
          isOpen={isSearchOpen} 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleClose();
            }
          }}
        >
          <SearchInput
            autoFocus
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            startAdornment={
              <SearchIcon 
                sx={{ 
                  ml: 1.5, 
                  color: 'text.secondary',
                  fontSize: '1.5rem'
                }} 
              />
            }
            endAdornment={
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  mr: 1,
                  gap: 1
                }}
              >
                {isLoading && (
                  <CircularProgress 
                    size={20} 
                    sx={{ 
                      color: 'primary.main',
                      opacity: 0.8 
                    }} 
                  />
                )}
                <IconButton 
                  size='small' 
                  onClick={handleClose}
                  sx={{
                    backgroundColor: 'action.hover',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'action.selected',
                      transform: 'scale(1.1)',
                    }
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            }
            sx={{
              '& .MuiInputBase-input': {
                pl: 1,
                fontSize: '1.1rem',
                '&::placeholder': {
                  opacity: 0.7,
                  fontStyle: 'italic'
                }
              },
              backdropFilter: 'blur(8px)',
              backgroundColor: (theme) => 
                `${alpha(theme.palette.background.paper, 0.8)} !important`,
              boxShadow: (theme) => `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.1)}`,
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: (theme) => `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.15)}`,
                borderColor: 'primary.main',
              },
              '&:focus-within': {
                borderColor: 'primary.main',
                boxShadow: (theme) => `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.2)}`,
              }
            }}
          />

          {searchQuery.length > 2 && (
            <ResultsContainer>
              {error && (
                <Box sx={{ p: 2, color: 'error.main' }}>
                  Error loading results
                </Box>
              )}
              
              {!isLoading && trainers?.length === 0 && (
                <Box sx={{ p: 2, color: 'text.secondary' }}>
                  No users found
                </Box>
              )}
              
              {trainers?.map((trainer) => (
                <Box
                  key={trainer.id}
                  sx={{
                    p: 2,
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    },
                    cursor: 'pointer',
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}
                  onClick={() => {
                    navigateTo(`/${trainer.username}/view`)
                    handleClose()
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  
                                            <Avatar
                                                src={GET_AVATAR_COMPRESSED_URL(trainer.avatar?.avatar_compressed)} // Add this prop if available
                                                sx={{
                                              color: '#fff',
                                              width: 60,
                                              height: 60,
                                            }}
                                          >
                        {!trainer.profilePicture && `${trainer.first_name[0]}${trainer.last_name[0]}`}
                      </Avatar>
                 
                    <Box>
                      <Box sx={{ fontWeight: 'bold' }}>{trainer.first_name} {trainer.last_name}</Box>
                      <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                        {trainer.specialization}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </ResultsContainer>
          )}
        </SearchWrapper>
      )}
    </>
  )
}

export default GlobalSearch 