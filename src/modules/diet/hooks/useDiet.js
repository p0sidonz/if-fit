import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../../utils/axios";
import toast from "react-hot-toast";

const fetchFood = async (query) => {
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

const fetchFoodById = async (foodId) => {
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
export const useGetFoodById = (foodId) => {
  return useQuery({
    queryKey: ["searchFoodById", foodId],
    queryFn: () => fetchFoodById(foodId),
    enabled: !!foodId, // Only run the query if foodId is truthy
  });
}


export const useSearchForFood = (q) => {
  return useQuery({
    queryKey: ["searchFood"],
    enabled: false,
    queryFn: async () => {
      return fetchFood(q);
    }
  });
};



export const getDietList = async () => {
  try {
    const result = await axios.get("diet");
    return result?.data || [];
  } catch (error) {
    console.error(error);
    toast.error(error.message + ' ' + (error.response?.data?.message || ""), {
      duration: 4000
    });
    throw error;
  }
}

export const useGetDietList = () => {
  return useQuery({
    queryKey: ["dietList"],
    queryFn: getDietList
  });
}


export const useCreatNewDiet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dietData) => {
      const response = await axios.post(`/diet/add`, dietData);
      return response.data;
    },
    onSuccess: (data) => {
      // Success actions
      queryClient.invalidateQueries("dietList");
      return toast.success("Diet created successfully");
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
export const useUpdateDiet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dietData) => {
      const response = await axios.post(`/diet/update`, dietData);
      return response.data;
    },
    onSuccess: (data) => {
      // Success actions
      queryClient.invalidateQueries("dietList");
      return toast.success("Diet updated successfully");
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

export const useDeleteDiet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dietData) => {
      console.log("dietData", dietData);
      const response = await axios.post(`/diet/deleteDiet`, {diet_id: dietData});
      return response.data;
    },
    onSuccess: (data) => {
      // Success actions
      queryClient.invalidateQueries("dietList");
      return toast.success("Diet deleted successfully");
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
export const useGetMealList = (dietId) => {
  return useQuery({
    queryKey: ["mealList", dietId],
    queryFn: async () => {
      try {
        const result = await axios.get(`/diet/getMeal/${dietId}`);
        return result.data || [];
      } catch (error) {
        console.error("Error fetching meal list:", error);
        toast.error(`Error: ${error.message}. ${error.response?.data?.message || ""}`, {
          duration: 4000,
        });
        throw error;
      }
    },
    enabled: !!dietId,
    retry: 1, // Retry once before failing
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateNewMeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mealData) => {
      const response = await axios.post(`/diet/addMealToDiet`, mealData);
      return response.data;
    },
    onSuccess: (data) => {
      // Success actions
      queryClient.invalidateQueries("mealList");
      return toast.success("Meal created successfully");
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

export const useAddFoodToMeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mealData) => {
      //this expects food_id local and meal id
      const response = await axios.post(`/diet/addFoodToMeal`, mealData);
      return response.data;
    },
    onSuccess: (data) => {
      // Success actions
      queryClient.invalidateQueries("mealList");
      return toast.success("Food added to meal successfully");
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

export const useDeleteMeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({meal_id}) => {
      const response = await axios.delete(`/diet/deleteMeal/${meal_id}`);
      return response.data;
    },
    onSuccess: (data) => {
      // Success actions
      queryClient.invalidateQueries("mealList");
      return toast.success("Meal deleted successfully");
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
  

export const useUpdateMealFood = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mealData) => {
      console.log("mealData", mealData);
      //local and meal id
      const response = await axios.post(`/diet/updatecustomMeal`, mealData);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("data", data);
      // Success actions
      queryClient.invalidateQueries("mealList");
      return toast.success("Meal updated successfully");
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

export const useDeleteFood = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (foodData) => {
      const response = await axios.delete(`/diet/deleteFood/${foodData.id}`);
      return response.data;
    },
    onSuccess: (data) => {
      // Success actions
      queryClient.invalidateQueries("mealList");
      return toast.success("Food deleted successfully");
    },
    onError: (error) => {
     if(error.response.data.message.length) {
      console.log(error.response.data.message.length)
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

export const useUpdateMeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mealData) => {
      const response = await axios.post(`/diet/updateMeal`, mealData);
      return response.data;
    },
    onSuccess: (data) => {
      // Success actions
      queryClient.invalidateQueries("mealList");
      return toast.success("Meal updated successfully");
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

