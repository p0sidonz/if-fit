// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
// ** Custom Components
import { useState } from 'react'
import { useUpdateUser, useWhoAmI } from '../../modules/user/hooks/usePricing'
// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'
import { useEffect } from 'react'
import { LoadingButton } from '@mui/lab'


const BillingAddressCardPublic = ({token, callback, setBillingDataLocal, handlePurchase}) => {
  const updateUser = useUpdateUser(token);
  const { data: user, isLoading, status } = useWhoAmI(token);
  
  const [defaultValues, setDefaultValues] = useState({
    companyName: '',
    billingEmail: '',
    billingPhone: '',
    billingCountry: '',
    billingAddressLine1: '',
    billingState: '',
    billingZip: ''
  });

  const { control, handleSubmit, formState: { errors }, reset } = useForm({ defaultValues });

  useEffect(() => {
    if (user) {
      const newDefaultValues = {
        companyName: user.companyName,
        billingEmail: user.billingEmail,
        billingPhone: user.billingPhone,
        billingCountry: user.billingCountry,
        billingAddressLine1: user.billingAddressLine1,
        billingState: user.billingState,
        billingZip: user.billingZip
      };

      setDefaultValues(newDefaultValues);
      reset(newDefaultValues); // Reset the form with new default values
    }
  }, [user, isLoading, status, reset]);

  const onSubmit = (data) => {
    updateUser.mutate(data);
    setBillingDataLocal(data);
    callback && callback();
    handlePurchase && handlePurchase();
  };


  return (
    
      <CardContent>
              <CardHeader title='Billing Address' />

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='companyName'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Company Name'
                      placeholder='Pixinvent'
                      error={Boolean(errors.companyName)}
                    />
                  )}
                />
                {errors.companyName && (
                  <FormHelperText sx={{ color: 'error.main' }}>This field is required</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='billingEmail'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type='email'
                      label='Billing Email'
                      placeholder='john.doe@example.com'
                      error={Boolean(errors.billingEmail)}
                    />
                  )}
                />
                {errors.billingEmail && (
                  <FormHelperText sx={{ color: 'error.main' }}>This field is required</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='billingPhone'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Phone Number'
                      placeholder='(123) 456 7890'
                      error={Boolean(errors.billingPhone)}
                    />
                  )}
                />
                {errors.billingPhone && (
                  <FormHelperText sx={{ color: 'error.main' }}>This field is required</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='country-select'>Country</InputLabel>
                <Controller
                  name='billingCountry'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId='country-select'
                      label='Country'
                      error={Boolean(errors.billingCountry)}
                    >
                      <MenuItem value='australia'>Australia</MenuItem>
                      <MenuItem value='canada'>Canada</MenuItem>
                      <MenuItem value='france'>France</MenuItem>
                      <MenuItem value='india'>India</MenuItem>
                      <MenuItem value='united-kingdom'>United Kingdom</MenuItem>
                      <MenuItem value='united-states'>United States</MenuItem>
                    </Select>
                  )}
                />
                {errors.billingCountry && (
                  <FormHelperText sx={{ color: 'error.main' }}>This field is required</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='billingAddressLine1'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Billing Address'
                    placeholder='Billing Address'
                    error={Boolean(errors.billingAddressLine1)}
                  />
                )}
              />
              {errors.billingAddressLine1 && (
                <FormHelperText sx={{ color: 'error.main' }}>This field is required</FormHelperText>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='billingState'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='State'
                    placeholder='California'
                    error={Boolean(errors.billingState)}
                  />
                )}
              />
              {errors.billingState && (
                <FormHelperText sx={{ color: 'error.main' }}>This field is required</FormHelperText>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='billingZip'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type='number'
                    label='Zip Code'
                    placeholder='231465'
                    error={Boolean(errors.billingZip)}
                  />
                )}
              />
              {errors.billingZip && (
                <FormHelperText sx={{ color: 'error.main' }}>This field is required</FormHelperText>
              )}
            </Grid>
            <Grid item xs={12}>
              <LoadingButton  loading={status === "pending"} type='submit' variant='contained' sx={{ mr: 3 }}>
                Save & Next
              </LoadingButton>
              {/* <Button variant='outlined' color='secondary'>
                Discard
              </Button> */}
            </Grid>
          </Grid>
        </form>
      </CardContent>
  )
}

export default BillingAddressCardPublic