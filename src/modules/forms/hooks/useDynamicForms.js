import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../../utils/axios";
import toast from "react-hot-toast";


const fetchAllForms = async () => {
    try {
        const { data } = await axios.get('forms');
        return data;
    } catch (error) {
        console.error("Error fetching forms:", error);
        toast.error(`${error.message} ${error.response?.data?.message || ""}`, {
            duration: 4000,
        });
        throw error;
    }
  };


export const useFetchForms = () => {
    return useQuery({
        queryKey: ['forms'],
        queryFn: fetchAllForms,
        retry: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  export const useFetchForm = (id) => {
    return useQuery({
        queryKey: ['form', id],
        queryFn: async () => {
            const { data } = await axios.get(`forms/${id}`);
            return data;
        },
        retry: 1,
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

  }


export const useCreateForm = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData) => {
            const response = await axios.post(`forms`, formData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries("forms");
            toast.success("Form created successfully");
        },
        onError: (error) => {
            toast.error(`${error.message} ${error.response?.data?.message || ""}`, {
                duration: 4000,
            });
        },
    });
} 

export const useUpdateForm = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data) => {
            const response = await axios.post(`forms/${data.id}`, data.data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries("forms");
            toast.success("Form updated successfully");
        },
        onError: (error) => {
            toast.error(`${error.message} ${error.response?.data?.message || ""}`, {
                duration: 4000,
            });
        },
    });
}

export const useDeleteForm = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id) => {
            const response = await axios.delete(`forms/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries("forms");
            toast.success("Form deleted successfully");
        },
        onError: (error) => {
            toast.error(`${error.message} ${error.response?.data?.message || ""}`, {
                duration: 4000,
            });
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
  
  export const getAssignedFormList = (form_id) => {
    return useQuery({
      queryKey: ['assignedUserList', form_id],
      queryFn: async () => {
        try {
          const result = await axios.get(`/forms/assignedForm/${form_id}`);
          return result.data?.data || [];
        } catch (error) {
          console.error('Error fetching assigned user list:', error);
          toast.error(`Error: ${error.message}. ${error.response?.data?.message || ''}`, {
            duration: 4000,
          });
          throw error;
        }
      },
      enabled: !!form_id,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    });
  }
  
  export const assignUserToForms = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async ({ form_id, assignedId }) => {
        const response = await axios.post(`/forms/assignForms/${form_id}/${assignedId}`);
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
  
  export const unassignUserFromForms = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (assignedId) => {
        console.log(assignedId)
        const response = await axios.post(`/forms/unassignForm/${assignedId}`);
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

