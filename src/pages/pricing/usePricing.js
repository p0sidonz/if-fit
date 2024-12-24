import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../../utils/axios';
import toast from 'react-hot-toast'


// Fetch user data function with token
const fetchUserData = async ({ token }) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const { data } = await axios.get('/users/me', { headers });
  return data.user;
};


// Update user function with token
const updateUser = async ({ userData, token }) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  await axios.post('/users/update', userData, { headers });
};

  
  
export const useWhoAmI = (token) => {
    return useQuery({
      queryKey: ['whoAmI'],
      queryFn: () => fetchUserData({ token }),
      enabled: !!token,
    });
  }


// Custom hook to update user data
export const useUpdateUser = (token) => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (userData) => updateUser({ userData, token }),
      onSuccess: () => {
        // queryClient.invalidateQueries(['userData']);
        toast.success('User Profile Updated Successfully!', {
          duration: 2000
        })
      },
      onError: (error) => {
        console.error(error);
        toast.error(error.message, {
          duration: 2000
        })
      },
    });
  };