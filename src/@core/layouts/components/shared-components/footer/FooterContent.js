// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FooterContent = () => {
  // ** Var
  const hidden = useMediaQuery(theme => theme.breakpoints.down('md'))

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ mr: 2 }}>
        {`© ${new Date().getFullYear()} ${'Fetch Fit'}`}
        {/* <Box component='span' sx={{ color: 'error.main' }}>
          ❤️
        </Box>
        {` by `}
        <LinkStyled target='_blank' href='https://fetch.fit'>
          iankit.me
        </LinkStyled> */}
      </Typography>
      {/* {hidden ? null : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', '& :not(:last-child)': { mr: 4 } }}>
          <LinkStyled target='_blank' href='#'>
           Terms and Conditions
          </LinkStyled>
          <LinkStyled
            target='_blank'
            href='#'
          >
            Privacy Policy
          </LinkStyled>
          <LinkStyled target='_blank' href='#'>
            Support
          </LinkStyled>
        </Box>
      )} */}
       <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', '& :not(:last-child)': { mr: 4 } }}>
          <LinkStyled target='_blank' href='#'>
           Terms and Conditions
          </LinkStyled>
          <LinkStyled
            target='_blank'
            href='#'
          >
            Privacy Policy
          </LinkStyled>
          <LinkStyled target='_blank' href='#'>
            Support
          </LinkStyled>
          <LinkStyled href='/faq'>
            FAQ
          </LinkStyled>
        </Box>
    </Box>
  )
}

export default FooterContent
