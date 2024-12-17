import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../../utils/axios";
import toast from 'react-hot-toast';

// Types matching the backend DTO
interface UserStat {
  id: number;
  user_id: number;
  stat_type: string;
  stat_value?: string;
  serving_id?: number;
  dietJson?: {
    title: string;
    description: string;
    calories: number;
    fat: number;
    carbs: number;
    protein: number;
    fiber: number;
  };
  waterJson?: any;
  weightJson: any;
  date: string | Date;
  created_at: string | Date;
  updated_at: string | Date;
}

interface CreateUserStatDto {
  stat_type: string;
  stat_value?: string;
  serving_id?: number;
  dietJson?: {
    title: string;
    description: string;
    calories: number;
    fat: number;
    carbs: number;
    protein: number;
    fiber: number;
  };
  waterJson?: any;
  weightJson: any;
  date: string | Date;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    last_page: number;
  };
}

interface FoodSearchResponse {
  data: {
    foods: {
      food: any[]; // Replace 'any' with proper food type if available
    };
  };
}

// Hooks for User Stats CRUD Operations
export const useUserStats = (page = 1, limit = 10) => {
  return useQuery<PaginatedResponse<UserStat>>({
    queryKey: ['userStats', page, limit],
    queryFn: async () => {
      const { data } = await axios.get(`/user-stats`, { 
        params: { page, limit } 
      });
      return data;
    }
  });
};

export const useUserStatsByType = (
  startDate: string,
  endDate: string,
  statType?: string,
  page: number = 1,
  limit: number = 10
) => {
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
export const useUserStat = (id: number) => {
  return useQuery<UserStat>({
    queryKey: ['userStat', id],
    queryFn: async () => {
      const { data } = await axios.get(`/user-stats/${id}`);
      return data;
    }
  });
};

export const useCreateUserStat = () => {
  const queryClient = useQueryClient();

  return useMutation<UserStat, Error, CreateUserStatDto>({
    mutationFn: async (newStat) => {
      const { data } = await axios.post('/user-stats', newStat);
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch user stats queries
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

  return useMutation<UserStat, Error, { id: number, updatedStat: Partial<CreateUserStatDto> }>({
    mutationFn: async ({ id, updatedStat }) => {
      const { data } = await axios.patch(`/user-stats/${id}`, updatedStat);
      return data;
    },
    onSuccess: (data) => {
      // Invalidate specific user stat and user stats queries
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

  return useMutation<UserStat, Error, number>({
    mutationFn: async (id) => {
      const { data } = await axios.delete(`/user-stats/${id}`);
      return data;
    },
    onSuccess: (_, id) => {
      // Invalidate user stats queries and remove the specific stat from cache
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
