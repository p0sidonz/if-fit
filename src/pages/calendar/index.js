// ** React Imports
import { useEffect, useState,useMemo } from 'react'
import AddEventSidebar from '../../modules/calendar/AddEventSidebar'
import SidebarLeft from '../../modules/calendar/SidebarLeft'
import Calendar from '../../modules/calendar/Calendar'
// ** MUI Imports
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'
import { useGetEvents, useUpdateEvent, useAddEvent, useDeleteEvent } from 'src/modules/calendar/hooks/useCalendar'
// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** FullCalendar & App Components Imports
import CalendarWrapper from 'src/@core/styles/libs/fullcalendar'


// ** CalendarColors
const calendarsColor = {
  Personal: 'error',
  Event: 'primary',
  ETC: 'info'
}

const AppCalendar = () => {
   // ** States
   const [calendarApi, setCalendarApi] = useState(null)
   const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
   const [addEventSidebarOpen, setAddEventSidebarOpen] = useState(false)
   const [selectedEvent, setSelectedEvent] = useState(null)
   const [selectedCalendars, setSelectedCalendars] = useState(['Personal', 'Event', 'ETC'])
 
   // ** Hooks
   const { settings } = useSettings()
   const { data: events, isLoading, isError } = useGetEvents(selectedCalendars)
  const updateEventMutation = useUpdateEvent()
  const addEventMutation = useAddEvent()
  const deleteEventMutation = useDeleteEvent()


   // ** Vars
   const leftSidebarWidth = 260
   const addEventSidebarWidth = 400
   const { skin, direction } = settings
   const mdAbove = useMediaQuery(theme => theme.breakpoints.up('md'))
 
   const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)
  //  const handleAddEventSidebarToggle = () => setAddEventSidebarOpen(!addEventSidebarOpen)

  const handleAddEventSidebarToggle = () => {
    if (addEventSidebarOpen) {
      // Only set selectedEvent to null when closing the sidebar
      setSelectedEvent(null);
    }
    
    // Toggle the sidebar open state
    setAddEventSidebarOpen(!addEventSidebarOpen);
  };
  

  const handleSelectCalendar = (calendarId) => {
    setSelectedCalendars(prevSelected => {
      const filterIndex = prevSelected.findIndex(i => i === calendarId);
      if (filterIndex !== -1) {
        // If calendar is already selected, remove it
        const newSelected = [...prevSelected];
        newSelected.splice(filterIndex, 1);
        return newSelected;
      } else {
        // If calendar is not selected, add it
        return [...prevSelected, calendarId];
      }
    });
    console.log(selectedCalendars)
  }

   const handleSelectEvent = (event) => {
      setSelectedEvent(event)
   }
   if (isLoading) return <div>Loading...</div>
  //  if (isError) return <div>Error loading events</div>

  // Filter events based on selected calendars
  const filteredEvents = events.filter(event => selectedCalendars.includes(event.props))

  console.log(filteredEvents)

  return (
    <CalendarWrapper
      className='app-calendar'
      sx={{
        boxShadow: skin === 'bordered' ? 0 : 6,
        ...(skin === 'bordered' && { border: theme => `1px solid ${theme.palette.divider}` })
      }}
    >
      <SidebarLeft
        handleSelectCalendar={handleSelectCalendar}
        selectedCalendars={selectedCalendars}
        mdAbove={mdAbove}
        calendarsColor={calendarsColor}
        leftSidebarOpen={leftSidebarOpen}
        leftSidebarWidth={leftSidebarWidth}
        handleSelectEvent={handleSelectEvent}
        handleAllCalendars={()=>{}}
        handleCalendarsUpdate={()=>{}}
        handleLeftSidebarToggle={handleLeftSidebarToggle}
        handleAddEventSidebarToggle={handleAddEventSidebarToggle}
      />
      <Box
        sx={{
          px: 5,
          pt: 3.75,
          flexGrow: 1,
          borderRadius: 1,
          boxShadow: 'none',
          backgroundColor: 'background.paper',
          ...(mdAbove ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 } : {})
        }}
      >
        <Calendar
          events={filteredEvents}
          direction={direction}
          updateEvent={updateEventMutation.mutate}
          calendarsColor={calendarsColor}
          handleSelectEvent={handleSelectEvent}
          handleLeftSidebarToggle={handleLeftSidebarToggle}
          handleAddEventSidebarToggle={handleAddEventSidebarToggle}
        />
      </Box>
      <AddEventSidebar
        setSelectedEvent={setSelectedEvent}
        selectedEvent={selectedEvent}
        addEvent={addEventMutation.mutate}
        updateEvent={updateEventMutation.mutate}
        deleteEvent={deleteEventMutation.mutate}
        drawerWidth={addEventSidebarWidth}
        handleSelectEvent={handleSelectEvent}
        addEventSidebarOpen={addEventSidebarOpen}
        handleAddEventSidebarToggle={handleAddEventSidebarToggle}
      />
    </CalendarWrapper>
  )
}

export default AppCalendar
