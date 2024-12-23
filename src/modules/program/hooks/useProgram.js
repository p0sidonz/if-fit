import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../../utils/axios";
import toast from "react-hot-toast";

export const useGetProgramList = () => {
    return useQuery({
        queryKey: ["programList"],
        queryFn: async () => {
        try {
            const result = await axios.get(`/program`);
            return result.data || [];
        } catch (error) {
            console.error("Error fetching program list:", error);
            toast.error(`Error: ${error.message}. ${error.response?.data?.message || ""}`, {
            duration: 4000,
            });
            throw error;
        }
        },
        retry: 1, // Retry once before failing
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

}

export const useGetProgram = (programId) => {
    return useQuery({
        queryKey: ["program", programId],
        queryFn: async () => {
        try {
            const result = await axios.get(`/program/${programId}`);
            return result.data || null;
        } catch (error) {
            console.error("Error fetching program:", error);
            toast.error(`Error: ${error.message}. ${error.response?.data?.message || ""}`, {
            duration: 4000,
            });
            throw error;
        }
        },
        enabled: !!programId,
        retry: 1,
    });

}

export const useGetUserProgram = (programId, relationId) => {
  return useQuery({
      queryKey: ["program", programId, relationId],
      queryFn: async () => {
      try {
          const result = await axios.get(`/program/${programId}/${relationId}`);
          return result.data.data || null;
      } catch (error) {
          console.error("Error fetching program:", error);
          toast.error(`Error: ${error.message}. ${error.response?.data?.message || ""}`, {
          duration: 4000,
          });
          throw error;
      }
      },
      enabled: !!programId && !!relationId,
      retry: 1,
  });

}

export const useSyncProgram = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (program) => {
        const response = await axios.post(`/program/sync/${program.id}`, {shouldSync: program.sync});
        return response.data;
      },
      onSuccess: (data) => {
        // Success actions
        queryClient.invalidateQueries ("program");
        queryClient.invalidateQueries ("assignedUserList");

        return toast.success("Program updated successfully");
      },
      onError: (error) => {
       if(error.response.data.message.length) {
          error.response.data.message.forEach((msg) => {
            toast.error(msg, {
              className: {
                zIndex: 10000
              }
            });
          });
       }
       
      },
    });
}

export const useUpdateProgram = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (programData) => {
        const response = await axios.post(`/program/update`, programData);
        return response.data;
      },
      onSuccess: (data) => {
        // Success actions
        queryClient.invalidateQueries("programList");
        return toast.success("Program updated successfully");
      },
      onError: (error) => {
       if(error.response.data.message.length) {
          error.response.data.message.forEach((msg) => {
            toast.error(msg, {
              className: {
                zIndex: 10000
              }
            });
          });
       }
       
      },
    });
}

export const useAddNewWeek = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (program_id) => {
        let id = parseInt(program_id);
        const response = await axios.post(`/program/addWeekToProgram`, {program_id :id});
        return response.data;
      },
      onSuccess: (data) => {
        // Success actions
        queryClient.invalidateQueries("program");
        return toast.success("Week added successfully");
      },
      onError: (error) => {
       if(error.response.data.message.length) {
          error.response.data.message.forEach((msg) => {
            toast.error(msg, {
              className: {
                zIndex: 10000
              }
            });
          });
       }
       
      },
    });
}

export const useUpdateWeek = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (weekData) => {
        const response = await axios.post(`/program/updateWeek`, weekData);
        return response.data;
      },
      onSuccess: (data) => {
        // Success actions
        queryClient.invalidateQueries("program");
        return toast.success("Week updated successfully");
      },
      onError: (error) => {
       if(error.response.data.message.length) {
          error.response.data.message.forEach((msg) => {
            toast.error(msg, {
              className: {
                zIndex: 10000
              }
            });
          });
       }
       
      },
    });

}

export const useAddWorkoutToProgramDay = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ day_id, workout_id, rest_day = false }) => {
      const dataToSend = rest_day
        ? { day_id, rest_day, workout_id: null }
        : { day_id, rest_day, workout_id };

      const response = await axios.post('/program/addWorkout', dataToSend);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries('program');
      toast.success('Workout added successfully');
    },
    onError: (error) => {
      if (error.response?.data?.message?.length) {
        error.response.data.message.forEach((msg) => {
          toast.error(msg, {
            className: {
              zIndex: 10000,
            },
          });
        });
      }
    },
  });
};

export const useDeleteWeek = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({program_week_id}) => {
      const response = await axios.post(`/program/deleteWeek`, {program_week_id});
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries('program');
      toast.success('Week deleted successfully');
    },
    onError: (error) => {
      if (error.response?.data?.message?.length) {
        error.response.data.message.forEach((msg) => {
          toast.error(msg, {
            className: {
              zIndex: 10000,
            },
          });
        });
      }
    },
  });
}

export const addNewProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (programData) => {
      const response = await axios.post('/program/add', programData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries('programList');
      toast.success('Program added successfully');
    },
    onError: (error) => {
      if (error.response.data.message.length) {
        error.response.data.message.forEach((msg) => {
          toast.error(msg, {
            className: {
              zIndex: 10000,
            },
          });
        });
      }
    },
  });
  
}

export const useDeleteProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (program_id) => {
      const response = await axios.post('/program/delete', { id: program_id });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries('programList');
      toast.success('Program deleted successfully');
    },
    onError: (error) => {
      if (error.response?.data?.message?.length) {
        error.response.data.message.forEach((msg) => {
          toast.error(msg, {
            className: {
              zIndex: 10000,
            },
          });
        });
      }
    },
  });
}

export const getAllUserAndTrainerList = () => {
  return useQuery({
    queryKey: ['userList'],
    queryFn: async () => {
      try {
        const result = await axios.get('/userandtrainer/getUsers');
        return result.data?.data || [];
      } catch (error) {
        console.error('Error fetching user list:', error);
        toast.error(`Error: ${error.message}. ${error.response?.data?.message || ''}`, {
          duration: 4000,
        });
        throw error;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
}

export const getAssignedUserList = (program_id) => {
  return useQuery({
    queryKey: ['assignedUserList', program_id],
    queryFn: async () => {
      try {
        const result = await axios.get(`/userandtrainer/assignedPrograms/${program_id}`);
        return result.data?.data || [];
      } catch (error) {
        console.error('Error fetching assigned user list:', error);
        toast.error(`Error: ${error.message}. ${error.response?.data?.message || ''}`, {
          duration: 4000,
        });
        throw error;
      }
    },
    enabled: !!program_id,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
}

export const assignUserToProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ program_id, assignedId }) => {
      const response = await axios.post(`/userandtrainer/assignProgram/${program_id}/${assignedId}`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries('assignedUserList');
      queryClient.invalidateQueries('userList');

      toast.success('User assigned successfully');
    },
    onError: (error) => {
      if (error.response?.data?.message?.length) {
        error.response.data.message.forEach((msg) => {
          toast.error(msg, {
            className: {
              zIndex: 10000,
            },
          });
        });
      }
    },
  });
}

export const unassignUserFromProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assignedId) => {
      const response = await axios.post(`/userandtrainer/unassignProgram/${assignedId}`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries('assignedUserList');
      queryClient.invalidateQueries('userList');
      
      toast.success('User unassigned successfully');
    },
    onError: (error) => {
      if (error.response?.data?.message?.length) {
        error.response.data.message.forEach((msg) => {
          toast.error(msg, {
            className: {
              zIndex: 10000,
            },
          });
        });
      }
    },
  });
}


export const useAddProgramToCalendar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ program_id, start_date, duration }) => {
      const response = await axios.post(`calender/add/program-to-calendar`, { program_id, start_date, duration });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries('programList');
      toast.success('Program added to calendar successfully');
    },
    onError: (error) => {
      if (error.response?.data?.message?.length) {
        error.response.data.message.forEach((msg) => {
          toast.error(msg, {
            className: {
              zIndex: 10000,
            },
          });
        });
      }
    },
  });
}