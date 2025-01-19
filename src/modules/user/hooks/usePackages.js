import {
    useQuery,
    useMutation
  } from "@tanstack/react-query";
  import axios from "../../../utils/axios";
  import { toast } from "react-hot-toast";

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
      mutationFn: async (params) => {
        const { data, token } = params;
        console.log("useHandleTrailSubscription data:", data, "token:", token);
        try {
          const config = token ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          } : {};

          const result = await axios.post(`orders/success-trial`, data, config);
          console.log("Trial subscription result:", result);
          if(result.data.ok){
            return result.data || [];
          } else {
            toast.error(`Error: ${result.data.message}`, {
              duration: 10000,
            });
            throw new Error("Failed to subscribe to trial", result.data.message);
            //go back to the previous step
            
          }
        } catch (error) {
          console.error("Error in trial subscription:", error);
          toast.error(`Error: ${error.message}. ${error.response?.data?.message || ""}`, {
            duration: 10000,
          });
          throw error;
        }
      },
    });
  }

  export const useHandleTrailPublicSubscription = () => {
    return useMutation({
      mutationFn: async (data, token) => {
        try {
          const config = token ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          } : {};

          const result = await axios.post(`orders/success-trial`, data, config);
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