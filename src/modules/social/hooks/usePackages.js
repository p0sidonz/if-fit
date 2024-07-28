import {
  useQuery,
} from "@tanstack/react-query";
import axios from "../../../utils/axios";


// Get all packages
export const useGetPackages= (id) => {
    return useQuery({
      queryKey: ["packages"],
      queryFn: async (id) => {
        try {
          const result = await axios.get(`misc/getPackages/1`);
          return result.data?.data || [];
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
