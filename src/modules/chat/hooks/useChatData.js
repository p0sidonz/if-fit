import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../../../utils/axios';
import toast from 'react-hot-toast'

// Fetch user data function
const fetchContacts = async () => {
    const { data } = await axios.get('chat/getContacts');
    return data.data;
  };


export const useGetContact = () => {
    return useQuery({
      queryKey: ['contacts'],
      queryFn: fetchContacts,
    });
  };
  