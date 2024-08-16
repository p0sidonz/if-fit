import {
  useQuery,
} from "@tanstack/react-query";
import axios from "../../../utils/axios";


// Get all packages
export const useGetPackages= (username) => {
    return useQuery({
      queryKey: ["packages"],
      queryFn: async () => {
        try {
          const result = await axios.get(`misc/getPackages/${username}`);
          return result.data?.data || [];
        } catch (error) {
          console.error("Error fetching workouts:", error);
          toast.error(`Error: ${error.message}. ${error.response?.data?.message || ""}`, {
            duration: 4000,
          });
          throw error;
        }
      },
      enabled: !!username
    });
  };
