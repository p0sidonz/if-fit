import {
    useQuery,
    useMutation
  } from "@tanstack/react-query";
  import axios from "../../../utils/axios";

export const useGetUpgradePackages = () => {
    return useQuery({
      queryKey: ["upgradePackages"],
      queryFn: async () => {
        try {
          const result = await axios.get(`misc/upgradePackages`);
          console.log("result",result)
          return result.data || [];
        } catch (error) {
          console.error("Error fetching upgrade packages:", error);
          toast.error(`Error: ${error.message}. ${error.response?.data?.message || ""}`, {
            duration: 4000,
          });
          throw error;
        }
      },
    });
  }
  export const useCurrentUserPackages = () => {
    return useQuery({
      queryKey: ["currentUserPackages"],
      queryFn: async () => {
        try {
          const result = await axios.get(`misc/currentUserPackages`);
          return result.data?.data || [];
        } catch (error) {
          console.error("Error fetching package details:", error);
          toast.error(`Error: ${error.message}. ${error.response?.data?.message || ""}`, {
            duration: 4000,
          });
          throw error;
        }
      },
    });
  }

  export const useHandleTrailSubscription = () => {
    return useMutation({
      mutationFn: async (data) => {
        try {
          const result = await axios.post(`orders/success-trial`, data);
          console.log("Trial subscription result:", result);
          return result.data || [];
        } catch (error) {
          console.error("Error in trial subscription:", error);
          toast.error(`Error: ${error.message}. ${error.response?.data?.message || ""}`, {
            duration: 4000,
          });
          throw error;
        }
      },
    });
  }