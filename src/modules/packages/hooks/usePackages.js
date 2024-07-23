import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../../utils/axios";
import toast from "react-hot-toast";

const fetchTrainerPackages = async () => {
    try {
      const { data } = await axios.get('trainer-packages');
      return data;
    } catch (error) {
      console.error("Error fetching trainer packages:", error);
      toast.error(`Error: ${error.message}. ${error.response?.data?.message || ""}`, {
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
    console.error(error);
    toast.error(error.message + ' ' + (error.response?.data?.message || ""), {
      duration: 4000,
    });
    throw error;
  }
};

export const useTrainerPackages = () => {
    return useQuery({
      queryKey: ['trainerPackages'],
      queryFn: fetchTrainerPackages,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };
  
export const useTrainerPackage = (id) => {
  return useQuery(['trainerPackage', id], () => fetchTrainerPackageById(id), {
    enabled: !!id,
  });
};

export const useCreateTrainerPackage = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (newPackage) => {
      const { data } = await axios.post('trainer-packages', newPackage);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('trainerPackages');
        toast.success('Trainer package created successfully');
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
    }
  );
};

export const useUpdateTrainerPackage = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id, updatedPackage }) => {
      const { data } = await axios.patch(`/api/trainer-packages/${id}`, updatedPackage);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('trainerPackages');
        toast.success('Trainer package updated successfully');
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
    }
  );
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
        toast.error(error.message + ' ' + (error.response?.data?.message || ""), {
          duration: 4000,
        });
      },
    }
  );
};