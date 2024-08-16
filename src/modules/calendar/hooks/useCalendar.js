import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../../utils/axios";
import toast from "react-hot-toast";


// Fetch events
export const useGetEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: async (props) => {
      let params = {}
      if (props && props.length > 0) {
        params = { params: { calendars: props.join(',') } }
      }
      console.log(params)
      try {
        const result = await axios.get('calender')
        return result.data || []
      } catch (error) {
        console.error("Error fetching events:", error)
        // toast.error(`Error: ${error.message}. ${error.response?.data?.message || ""}`)
        throw error
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Add event
export const useAddEvent = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (eventData) => {
      const response = await axios.post('calender', eventData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries('events')
      toast.success("Event added successfully")
    },
    onError: (error) => {
      toast.error(`Error adding event: ${error.message}`)
    },
  })
}

// Update event
export const useUpdateEvent = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (eventData) => {
      const response = await axios.post(`calender/${eventData.id}`, eventData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries('events')
      toast.success("Event updated successfully")
    },
    onError: (error) => {
      toast.error(`Error updating event: ${error.message}`)
    },
  })
}

// Delete event
export const useDeleteEvent = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (eventId) => {
      const response = await axios.delete(`calender/${eventId}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries('events')
      toast.success("Event deleted successfully")
    },
    onError: (error) => {
      toast.error(`Error deleting event: ${error.message}`)
    },
  })
}