import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../../utils/axios";
import toast from 'react-hot-toast';
import _ from 'lodash';


// Get all workouts
export const useGetWorkouts = () => {
  return useQuery({
    queryKey: ["workouts"],
    queryFn: async () => {
      try {
        const result = await axios.get('/workout');
        return result.data || [];
      } catch (error) {
        console.error("Error fetching workouts:", error);
        toast.error(`Error: ${error.message}. ${error.response?.data?.message || ""}`, {
          duration: 4000,
        });
        throw error;
      }
    },
  });
};

// Get a single workout
export const useGetWorkout = (workoutId) => {
  return useQuery({
    queryKey: ["workout", workoutId],
    queryFn: async () => {
      try {
        const result = await axios.get(`/workout/${workoutId}`);
        return result.data || null;
      } catch (error) {
        console.error("Error fetching workout:", error);
        toast.error(`Error: ${error.message}. ${error.response?.data?.message || ""}`, {
          duration: 4000,
        });
        throw error;
      }
    },
    enabled: !!workoutId,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create a new workout
export const useCreateWorkout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workoutData) => {
      const response = await axios.post('/workout/add', workoutData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("workouts");
      return toast.success("Workout created successfully");
    },
    onError: (error) => {
      if(error.response?.data?.message?.length) {
        error.response.data.message.forEach((msg) => {
          toast.error(msg, {
            className: {
              zIndex: 10000
            }
          });
        });
      } else {
        toast.error("An error occurred while creating the workout");
      }
    },
  });
};

// Update a workout
export const useUpdateWorkout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workoutData) => {
      const response = await axios.post('/workout/update', workoutData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("workouts");
      return toast.success("Workout updated successfully");
    },
    onError: (error) => {
      if(error.response?.data?.message?.length) {
        error.response.data.message.forEach((msg) => {
          toast.error(msg, {
            className: {
              zIndex: 10000
            }
          });
        });
      } else {
        toast.error("An error occurred while updating the workout");
      }
    },
  });
};

// Delete a workout
export const useDeleteWorkout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workoutId) => {
      console.log("workoutId", workoutId);
      const response = await axios.delete(`/workout/delete/${workoutId}`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("workouts");
      return toast.success("Workout deleted successfully");
    },
    onError: (error) => {
      if(error.response?.data?.message?.length) {
        error.response.data.message.forEach((msg) => {
          toast.error(msg, {
            className: {
              zIndex: 10000
            }
          });
        });
      } else {
        toast.error("An error occurred while deleting the workout");
      }
    },
  });
};

// Add exercise to workout
export const useAddExerciseToWorkout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await axios.post('/workout/addExerciseToWorkout', data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("workouts");
      return toast.success("Exercise added to workout successfully");
    },
    onError: (error) => {
      if(error.response?.data?.message?.length) {
        error.response.data.message.forEach((msg) => {
          toast.error(msg, {
            className: {
              zIndex: 10000
            }
          });
        });
      } else {
        toast.error("An error occurred while adding exercise to workout");
      }
    },
  });
};

// Delete exercise from workout
export const useDeleteExerciseFromWorkout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workoutExerciseId) => {
      const response = await axios.post('/workout/deleteExerciseFromWorkout', {  workout_exercise_id: workoutExerciseId.workout_exercise_id  });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("workouts");
      return toast.success("Exercise removed from workout successfully");
    },
    onError: (error) => {
      if(error.response?.data?.message?.length) {
        error.response.data.message.forEach((msg) => {
          toast.error(msg, {
            className: {
              zIndex: 10000
            }
          });
        });
      } else {
        toast.error("An error occurred while removing exercise from workout");
      }
    },
  });
};

// Add set to exercise
export const useAddSet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (setData) => {
      const response = await axios.post('/workout/addSet', setData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("workouts");
      return toast.success("Set added successfully");
    },
    onError: (error) => {
      if(error.response?.data?.message?.length) {
        error.response.data.message.forEach((msg) => {
          toast.error(msg, {
            className: {
              zIndex: 10000
            }
          });
        });
      } else {
        toast.error("An error occurred while adding set");
      }
    },
  });
};

// Delete set
export const useDeleteSet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workoutSetId) => {
      console.log("workoutSetId", workoutSetId);
      const response = await axios.post('/workout/deleteSet', { workout_set_id: workoutSetId.workout_set_id});
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("workouts");
      return toast.success("Set deleted successfully");
    },
    onError: (error) => {
      if(error.response?.data?.message?.length) {
        error.response.data.message.forEach((msg) => {
          toast.error(msg, {
            className: {
              zIndex: 10000
            }
          });
        });
      } else {
        toast.error("An error occurred while deleting set");
      }
    },
  });
};

const fetchExercise = async ({ queryKey }) => {
  const [_, searchTerm] = queryKey;
  console.log("SearchTerm in fetchExercise:", searchTerm);
  if(!searchTerm) return [];
  try {
    const results = await axios.get(`misc/exercise-search/${searchTerm}`);
    return results?.data.data|| [];
  } catch (error) {
    console.error(error);
    toast.error(error.message + ' ' + (error.response?.data?.message || ""), {
      duration: 4000
    });
    throw error;
  }
};

export const useSearchExercises = (searchTerm) => {
  return useQuery({
    queryKey: ["exercises", searchTerm],
    queryFn: fetchExercise,
    enabled: !!searchTerm,
    retry: 1,
  });
};

export const useUpdateExcercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (exerciseData) => {
      const response = await axios.post('/workout/updateExercise', exerciseData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("workouts");
      return toast.success("Exercise updated successfully");
    },
    onError: (error) => {
      if(error.response?.data?.message?.length) {
        error.response.data.message.forEach((msg) => {
          toast.error(msg, {
            className: {
              zIndex: 10000
            }
          });
        });
      } else {
        toast.error("An error occurred while updating exercise");
      }
    },
  });
}