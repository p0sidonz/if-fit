// ** React Import
import { useEffect, useRef, useState, useMemo } from 'react'

// ** Full Calendar & it's Plugins
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import interactionPlugin from '@fullcalendar/interaction'

import { useGetEvents, useAddEvent, useUpdateEvent, useDeleteEvent } from './hooks/useCalendar'
import ShowWorkout from './ShowWorkout'

// ** Third Party Style Import
import 'bootstrap-icons/font/bootstrap-icons.css'

const blankEvent = {
  title: '',
  start: '',
  end: '',
  allDay: false,
  url: '',
  extendedProps: {
    calendar: '',
    guests: [],
    location: '',
    description: ''
  }
}

const Calendar = ({ events, direction, calendarsColor, handleSelectEvent, handleLeftSidebarToggle, handleAddEventSidebarToggle }) => {
  const calendarRef = useRef(null)
  const [calendarApi, setCalendarApi] = useState(null)
  const [showWorkoutDialog, setShowWorkoutDialog] = useState(false)
  const [selectedWorkout, setSelectedWorkout] = useState(null)
  // const { data: events, isLoading, isError } = useGetEvents()
  const addEventMutation = useAddEvent()
  const updateEventMutation = useUpdateEvent()
  const deleteEventMutation = useDeleteEvent()

  useEffect(() => {
    if (calendarRef.current && !calendarApi) {
      setCalendarApi(calendarRef.current.getApi())
    }
  }, [calendarApi])

  // if (isLoading) return <div>Loading...</div>
  // if (isError) return <div>Error loading events</div>



  const calendarOptions = {
    events: events || [],
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, bootstrap5Plugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      start: 'sidebarToggle, prev, next, title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
    },
    views: {
      week: {
        titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
      }
    },
    editable: true,
    eventResizableFromStart: true,
    dragScroll: true,
    dayMaxEvents: 2,
    navLinks: true,
    eventClassNames({ event: calendarEvent }) {
      const colorName = calendarsColor[calendarEvent._def.extendedProps.props]
      return [`bg-${colorName}`]
    },
    eventClick({ event: clickedEvent }) {
      if (clickedEvent.extendedProps.props === "Workout") {
        event.preventDefault()
        if(clickedEvent?.extendedProps?.Workout){
          setSelectedWorkout(clickedEvent?.extendedProps?.Workout)
          setShowWorkoutDialog(true)
        }

        return 
      }
      handleSelectEvent(clickedEvent)
      handleAddEventSidebarToggle()
    },
    customButtons: {
      sidebarToggle: {
        icon: 'bi bi-list',
        click() {
          handleLeftSidebarToggle()
        }
      }
    },
    dateClick(info) {
      console.log(info)
      // const ev = {
      //   start: info.date,
      //   end: info.date,
      //   allDay: true
      // }
      handleSelectEvent(null)
      handleAddEventSidebarToggle()
    },
    eventDrop({ event: droppedEvent }) {
      updateEventMutation.mutate(droppedEvent)
    },
    eventResize({ event: resizedEvent }) {
      updateEventMutation.mutate(resizedEvent)
    },
    ref: calendarRef,
    direction
  }

  return (<>
    <FullCalendar {...calendarOptions} />
    <ShowWorkout
      open={showWorkoutDialog}
      onClose={() => setShowWorkoutDialog(false)}
      workout_id={1}
    />
  </>)


}

export default Calendar
