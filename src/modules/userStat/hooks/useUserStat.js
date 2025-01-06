import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../../utils/axios";
import toast from 'react-hot-toast';

export const useUserStats = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['userStats', page, limit],
    queryFn: async () => {
      const { data } = await axios.get(`/user-stats`, { 
        params: { page, limit } 
      });
      return data;
    }
  });
};

export const useUserStatsByType = (startDate, endDate, statType, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['userStatsByDateRange', startDate, endDate, statType, page, limit],
    queryFn: async () => {
      const params = {
        startDate,
        endDate,
        statType,
        page,
        limit
      };
      
      const { data } = await axios.get('/user-stats/range', { params });
      console.log("data", data);
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(startDate && endDate),
  });
};

export const useUserStat = (id) => {
  return useQuery({
    queryKey: ['userStat', id],
    queryFn: async () => {
      const { data } = await axios.get(`/user-stats/${id}`);
      return data;
    }
  });
};

export const useCreateUserStat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newStat) => {
      const { data } = await axios.post('/user-stats', newStat);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      toast.success('Stat created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create stat: ${error.message}`);
    }
  });
};

export const useUpdateUserStat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updatedStat }) => {
      const { data } = await axios.patch(`/user-stats/${id}`, updatedStat);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      queryClient.invalidateQueries({ queryKey: ['userStat', data.id] });
      toast.success('Stat updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update stat: ${error.message}`);
    }
  });
};

export const useDeleteUserStat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.delete(`/user-stats/${id}`);
      return data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      queryClient.removeQueries({ queryKey: ['userStat', id] });
      toast.success('Stat deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete stat: ${error.message}`);
    }
  });
};

export const fetchFood = async (query) => {
  if(!query) return [];
  try {
    const results = await axios.get(`misc/food-search/${query}`);
    return results?.data?.data?.foods?.food || [];
  } catch (error) {
    console.error(error);
    toast.error(error.message + ' ' + (error.response?.data?.message || ""), {
      duration: 4000
    });
    throw error;
  }
};

export const fetchFoodById = async (foodId) => {
  console.log("fetchFoodById", foodId);
  if (!foodId) return {};
  
  try {
    const result = await axios.get(`misc/food-id/${foodId}`);
    return result?.data || {};
  } catch (error) {
    console.error("Error fetching food by ID:", error);
    toast.error(`${error.message} ${error.response?.data?.message || ""}`, {
      duration: 4000,
    });
    throw error;
  }
}; 