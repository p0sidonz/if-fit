import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../../utils/axios";
import toast from "react-hot-toast";


const fetchTrainerPackages = async () => {
  try {
      const { data } = await axios.get('trainer-packages');
      return data;
  } catch (error) {
      console.error("Error fetching trainer packages:", error);
      toast.error(`${error.message} ${error.response?.data?.message || ""}`, {
          duration: 4000,
      });
      throw error;
  }
};

const fetchTrainerPackageById = async (id) => {
  if (!id) return {};
  try {
      const { data } = await axios.get(`/trainer-packages/${id}`);
      return data;
  } catch (error) {
      console.error("Error fetching trainer package by ID:", error);
      toast.error(`${error.message} ${error.response?.data?.message || ""}`, {
          duration: 4000,
      });
      throw error;
  }
};

export const useTrainerPackageById = (id) => {
  return useQuery({
      queryKey: ['trainerPackageById', id],
      queryFn: () => fetchTrainerPackageById(id),
      enabled: !!id,
  });
};

export const useTrainerPackages = () => {
  return useQuery({
      queryKey: ['trainerPackages'],
      queryFn: fetchTrainerPackages,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateTrainerPackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
      mutationFn: async (programData) => {
          const response = await axios.post(`/trainer-packages`, programData);
          return response.data;
      },
      onSuccess: () => {
          queryClient.invalidateQueries("trainerPackages");
          toast.success("Program created successfully");
      },
      onError: (error) => {
          error.response?.data?.message.forEach((msg) => {
              toast.error(msg, {
                  className: {
                      zIndex: 10000
                  }
              });
          });
      },
  });
};

export const useUpdateTrainerPackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
      mutationFn: async ({ newData, id }) => {
        console.log("useUpdateTrainerPackage", newData, id);
        delete newData.id;
        delete newData.created_at;
        delete newData.updated_at;
        delete newData.trainer_id;
          const response = await axios.post(`trainer-packages/${id}`, newData);
          return response.data;
      },
      onSuccess: () => {
          queryClient.invalidateQueries("trainerPackages");
          toast.success("Packasdasfdsfdsge updated successfully");
      },
      onError: (error) => {
          error.response?.data?.message.forEach((msg) => {
              toast.error(msg, {
                  className: {
                      zIndex: 10000
                  }
              });
          });
      },
  });
};

export const useDeleteTrainerPackage = () => {
  const queryClient = useQueryClient();

  return useMutation(
      async (id) => {
          const { data } = await axios.delete(`/api/trainer-packages/${id}`);
          return data;
      },
      {
          onSuccess: () => {
              queryClient.invalidateQueries('trainerPackages');
              toast.success('Trainer package deleted successfully');
          },
          onError: (error) => {
              console.error(error);
              toast.error(`${error.message} ${error.response?.data?.message || ""}`, {
                  duration: 4000,
              });
          },
      }
  );
};