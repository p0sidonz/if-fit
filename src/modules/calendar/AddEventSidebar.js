// ** React Imports
import { useState, useEffect, forwardRef, useCallback, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useAddEvent, useUpdateEvent, useDeleteEvent } from './hooks/useCalendar'

// ** Third Party Imports
import DatePicker from 'react-datepicker'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { getAllUserAndTrainerList } from 'src/modules/diet/hooks/useDiet';
// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

const capitalize = string => string && string[0].toUpperCase() + string.slice(1)

const defaultState = {
  url: '',
  title: '',
  guests: [],
  allDay: true,
  description: '',
  endDate: new Date(),
  calendar: 'Event',
  startDate: new Date(),

}

const AddEventSidebar = props => {
  const {
    selectedEvent,
    drawerWidth,
    calendarApi,
    handleSelectEvent,
    addEventSidebarOpen,
    handleAddEventSidebarToggle,
    setSelectedEvent
  } = props


  const [values, setValues] = useState(defaultState)

  const {
    control,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: { title: '' } })

  const addEventMutation = useAddEvent()
  const updateEventMutation = useUpdateEvent()
  const deleteEventMutation = useDeleteEvent()
  const { data: users, isLoading: usersLoading, error: usersError, isFetched: usersFetched } = getAllUserAndTrainerList();

  const handleSidebarClose = useCallback(() => {
    setValues(defaultState)
    clearErrors()
    handleSelectEvent(null)
    handleAddEventSidebarToggle()
  }, [clearErrors, handleSelectEvent, handleAddEventSidebarToggle])

  const onSubmit = data => {
    const modifiedEvent = {
      url: values.url,
      title: data.title,
      end: values.endDate,
      allDay: values.allDay,
      start: values.startDate,
      guests: values.guests.length ? values.guests : undefined,
      props: values.calendar,
      description: values.description.length ? values.description : undefined,
    }
    if (selectedEvent === null) {
      addEventMutation.mutate(modifiedEvent)
    } else {
      updateEventMutation.mutate({ id: selectedEvent.id, ...modifiedEvent })
    }
    // calendarApi.refetchEvents()
    handleSidebarClose()
  }

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      deleteEventMutation.mutate(selectedEvent.id)
    }
    handleSidebarClose()
  }

  const handleStartDate = date => {
    if (date > values.endDate) {
      setValues({ ...values, startDate: new Date(date), endDate: new Date(date) })
    }
  }

  const resetToStoredValues = useCallback(() => {
    if (selectedEvent !== null) {
      //get the ids of the guests
      const guests = selectedEvent?.extendedProps?.UserCalendar?.map(guest => guest.userId)
      const event = selectedEvent
      setValue('title', event.title || '')
      setValues({
        url: event.url || '',
        title: event.title || '',
        allDay: event.allDay,
        guests: guests || [],
        description: event?.description || '',
        calendar: event.props || 'Event',
        endDate: event.end !== null ? event.end : event.start,
        startDate: event.start !== null ? event.start : new Date()
      })
    }

  }, [selectedEvent, setValue])

  const resetToEmptyValues = useCallback(() => {
    setValue('title', '')
    setValues(defaultState)
  }, [setValue])

  useEffect(() => {
    if (addEventSidebarOpen) {
      if (selectedEvent !== null) {
        resetToStoredValues()
      } else {
        resetToEmptyValues()
      }
    }
  }, [addEventSidebarOpen, selectedEvent, resetToStoredValues, resetToEmptyValues])

  const PickersComponent = forwardRef(({ ...props }, ref) => (
    <TextField
      inputRef={ref}
      fullWidth
      {...props}
      label={props.label || ''}
      sx={{ width: '100%' }}
      error={props.error}
    />
  ))

  const RenderSidebarFooter = () => (
    <Fragment>
      <Button size='large' type='submit' variant='contained' sx={{ mr: 4 }}>
        {selectedEvent ? 'Update' : 'Add'}
      </Button>
      <Button 
        size='large' 
        variant='outlined' 
        color='secondary' 
        onClick={selectedEvent ? resetToStoredValues : resetToEmptyValues}
      >
        Reset
      </Button>
    </Fragment>
  )

  if(usersLoading) return <div>Loading...</div>

  return (
    <Drawer
      anchor='right'
      open={addEventSidebarOpen}
      onClose={handleSidebarClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: ['100%', drawerWidth] } }}
    >
      <Box
        className='sidebar-header'
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: 'background.default',
          p: theme => theme.spacing(3, 3.255, 3, 5.255)
        }}
      >
        <Typography variant='h6'>
          {selectedEvent ? 'Update Event' : 'Add Event'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {selectedEvent && (
            <IconButton
              size='small'
              onClick={handleDeleteEvent}
              sx={{ color: 'text.primary', mr: 1 }}
            >
              <Icon icon='mdi:delete-outline' fontSize={20} />
            </IconButton>
          )}
          <IconButton size='small' onClick={handleSidebarClose} sx={{ color: 'text.primary' }}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Box>
      </Box>
      <Box className='sidebar-body' sx={{ p: theme => theme.spacing(5, 6) }}>
        <DatePickerWrapper>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='title'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField label='Title' value={value} onChange={onChange} error={Boolean(errors.title)} />
                )}
              />
              {errors.title && (
                <FormHelperText sx={{ color: 'error.main' }} id='event-title-error'>
                  This field is required
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <InputLabel id='event-calendar'>Calendar</InputLabel>
              <Select
                label='Calendar'
                value={values.calendar}
                labelId='event-calendar'
                onChange={e => setValues({ ...values, calendar: e.target.value })}
              >

                <MenuItem value='Personal'>Personal</MenuItem>
                <MenuItem value='Event'>Event</MenuItem>
                <MenuItem value='ETC'>ETC</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ mb: 6 }}>
              <DatePicker
                selectsStart
                id='event-start-date'
                endDate={values.endDate}
                selected={values.startDate}
                startDate={values.startDate}
                showTimeSelect={!values.allDay}
                dateFormat={!values.allDay ? 'yyyy-MM-dd hh:mm' : 'yyyy-MM-dd'}
                customInput={<PickersComponent label='Start Date' registername='startDate' />}
                onChange={date => setValues({ ...values, startDate: new Date(date) })}
                onSelect={handleStartDate}
              />
            </Box>
            <Box sx={{ mb: 6 }}>
              <DatePicker
                selectsEnd
                id='event-end-date'
                endDate={values.endDate}
                selected={values.endDate}
                minDate={values.startDate}
                startDate={values.startDate}
                showTimeSelect={!values.allDay}
                dateFormat={!values.allDay ? 'yyyy-MM-dd hh:mm' : 'yyyy-MM-dd'}
                customInput={<PickersComponent label='End Date' registername='endDate' />}
                onChange={date => setValues({ ...values, endDate: new Date(date) })}
              />
            </Box>
            <FormControl sx={{ mb: 6 }}>
              <FormControlLabel
                label='All Day'
                control={
                  <Switch checked={values.allDay} onChange={e => setValues({ ...values, allDay: e.target.checked })} />
                }
              />
            </FormControl>
            <TextField
              fullWidth
              type='url'
              id='event-url'
              sx={{ mb: 6 }}
              label='Event URL'
              value={values.url}
              onChange={e => setValues({ ...values, url: e.target.value })}
            />
            <FormControl fullWidth sx={{ mb: 6 }}>
              <InputLabel id='event-guests'>Guests</InputLabel>
              <Select
                multiple
                label='Guests'
                value={values.guests}
                labelId='event-guests'
                id='event-guests-select'
                onChange={e => setValues({ ...values, guests: e.target.value })}
              >
                {users?.map(guest => (
                  <MenuItem key={guest.id} value={guest.id}>
                    {guest.userInfo.first_name + ' ' + guest.userInfo.last_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              rows={4}
              multiline
              fullWidth
              sx={{ mb: 6 }}
              label='Description'
              id='event-description'
              value={values.description}
              onChange={e => setValues({ ...values, description: e.target.value })}
            />
            {/* Rest of the form fields... */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <RenderSidebarFooter />
            </Box>
          </form>
        </DatePickerWrapper>
      </Box>
    </Drawer>
  )
}

export default AddEventSidebar

