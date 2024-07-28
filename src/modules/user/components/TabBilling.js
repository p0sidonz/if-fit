// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components
import CurrentPlanCard from './CurrentPlanCard'
import { useGetUpgradePackages, useCurrentUserPackages } from '../hooks/usePackages'
import PaymentHistoryList from './PaymentHistoryList'
const TabBilling = () => {
    const { data } = useGetUpgradePackages()
    const { data: currentUserPackages, isLoading } = useCurrentUserPackages()
    console.log("currentUserPackages",currentUserPackages)
    if(isLoading) return <p>Loading...</p>
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CurrentPlanCard subscription={currentUserPackages?.activePackages[0]} />
      </Grid>

      <Grid item xs={12}>
        <PaymentHistoryList payments={currentUserPackages?.history}  />
      </Grid> 


      {/* <Grid item xs={12}>
        <PaymentMethodCard />
      </Grid>

      <Grid item xs={12}>
        <BillingAddressCard />
      </Grid>

    */}
    </Grid>
  )
}

export default TabBilling
