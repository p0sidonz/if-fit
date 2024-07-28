// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import UserTrainerDashboard from './UserTrainerDashboard'
const Home = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {/* <Card>
          <CardHeader title='Dashboard 🚀'></CardHeader>
          <CardContent>
            <Typography sx={{ mb: 2 }}>Access the menus from the left side for now</Typography>
            
          </CardContent>
        </Card> */}

        <UserTrainerDashboard/>
      </Grid>
    </Grid>
  )
}

export default Home
