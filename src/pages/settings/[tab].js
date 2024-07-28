// ** MUI Imports
import Grid from '@mui/material/Grid'

import { UserComponent } from 'src/modules/user'
const SecondPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
      <UserComponent/>
      </Grid>
    </Grid>
  )
}

export default SecondPage
