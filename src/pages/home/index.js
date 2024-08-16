// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import UserTrainerDashboard from './UserTrainerDashboard'
import TraineeDashboard from './TraineeDashboard'
const Home = () => {
  const user = JSON.parse(localStorage.getItem('userData'))
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {user.role === 'user' ? <TraineeDashboard /> : <UserTrainerDashboard />}
      </Grid>
    </Grid>
  )
}

export default Home
