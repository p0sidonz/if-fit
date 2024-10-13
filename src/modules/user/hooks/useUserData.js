import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../../../utils/axios';
import toast from 'react-hot-toast'

// Fetch user data function
const fetchUserData = async () => {
  const { data } = await axios.get('/users/me');
  return data.user;
};

// Update user function
const updateUser = async (userData) => {
  await axios.post('/users/update', userData);
};

const whoAmI = async () => {
  const { data } = await axios.get('/users/me');
  return data.user;
}

// Custom hook to fetch user data
export const useUserData = () => {
  return useQuery({
    queryKey: ['userData'],
    queryFn: fetchUserData,
  });
};

export const updateProfilePicture = async (formData) => {
  await axios.post('/users/update-avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
}


export const updatePassword = async (passwordData) => {
  await axios.post('/users/update-password', passwordData);
}



// Custom hook to update user data
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => updateUser(data),
    onSuccess: () => {
      // queryClient.invalidateQueries(['userData']);
      toast.success('User Profile Updated Successully!', {
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

//custom hook to update password
export const useUpdatePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => updatePassword(data),
    onSuccess: () => {
      // queryClient.invalidateQueries(['userData']);
      toast.success('Password Updated Successully!', {
        duration: 2000
      })
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message + ' ' + error.response.data.message || "", {
        duration: 4000
      })
    },
  });
};

  //custom hook for updating profile picture
  export const useUpdateProfilePicture = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (data) => updateProfilePicture(data),
      onSuccess: () => {
        queryClient.invalidateQueries(['userData']);
        toast.success('Profile Picture Updated Successully!', {
          duration: 2000
        })
      },
      onError: (error) => {
        console.error(error);
        toast.error(error.message + ' ' + error.response.data.message || "", {
          duration: 4000
        })
      },
    });
  };

  export const useWhoAmI = () => {
    return useQuery({
      queryKey: ['whoAmI'],
      queryFn: fetchUserData,
    });
  }



export const useWhoYouAre = (username) => {
  console.log("usernameusername", username)
  return useQuery({
    queryKey: ['whoYouAre'],
    queryFn: ()=> fetchOtherUserData(username),
    enabled: !!username,
  });
}

const fetchOtherUserData = async (username) => {
  const { data } = await axios.get(`/misc/whoareyou/${username}`);
  return data.data;
}
