// ** MUI Imports
import React from 'react'
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
import LoadingButton from '@mui/lab/LoadingButton'
// ** Custom Components
import { useState } from 'react'
import { useWhoAmI } from '../../../user/hooks/useUserData'
// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'
import { useEffect } from 'react'
import { Typography } from '@mui/material'

const PackageBilling = React.forwardRef((props, ref) => {
// const PackageBilling = ({ onSubmit, onValidation, ref }) => {
  const { onSubmit, onValidation } = props;

    const { data: user, isLoading, status } = useWhoAmI();
    const [defaultValues, setDefaultValues] = useState({
      companyName: '',
      billingEmail: '',
      billingPhone: '',
      billingCountry: '',
      billingAddressLine1: '',
      billingState: '',
      billingZip: ''
    });
  
    const { control, handleSubmit, formState: { errors, isValid }, reset, watch } = useForm({ 
      defaultValues,
      mode: 'onChange'
    });
  
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
        reset(newDefaultValues);
      }
    }, [user, isLoading, status, reset]);
  
    useEffect(() => {
      onValidation(isValid);
    }, [isValid, onValidation]);
  

  
    const onFormSubmit = (data) => {
      onSubmit(data);
    };
    

  return (
    <Card>
      <CardHeader title='Billing Address' />
      <Typography variant='subtitle2' color='text.secondary' sx={{ px: 5, pb: 2 }}> 
        Please enter your billing address details (This info will saved in your profile's billing address)
      </Typography>
      <CardContent>
      <form onSubmit={handleSubmit(onFormSubmit)} ref={ref}
      >
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
            {/* <Grid item xs={12}> */}
              {/* <LoadingButton  loading={status === "pending"} type='submit' variant='contained' sx={{ mr: 3, display: 'none' }}>
                Save Changes
              </LoadingButton> */}
              {/* <Button variant='outlined' color='secondary'>
                Discard
              </Button> */}
            {/* </Grid> */}
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
})

export default PackageBilling
