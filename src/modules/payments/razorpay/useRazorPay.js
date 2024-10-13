import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../../utils/axios";
import toast from "react-hot-toast";



export const useCreateOrder = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (orderData) => {
        const response = await axios.post(`/orders/create`, orderData);
        return response.data;
      },
      onError: (error) => {
        toast.error("Failed to create order. Please try again.");
      },
    });
  };

  export const useVerifyPayment = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async ({ orderId, paymentId, signature }) => {
        const response = await axios.post('/orders/verify', { orderId, paymentId, signature });
        return response.data;
      },
      onSuccess: (data) => {
        // Success actions
        queryClient.invalidateQueries("paymentVerification");
        toast.success("Payment verified successfully");
      },
      onError: (error) => {
        console.error('Payment verification failed:', error);
        if (error.response?.data?.message?.length) {
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
  };
  
  export const useCreateSubscription = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async ({ userId, packageId, orderId, rawJson }) => {
        const response = await axios.post('/orders/subscribe', { userId, packageId, orderId, rawJson });
        return response.data;
      },
      onSuccess: (data) => {
        // Success actions
        queryClient.invalidateQueries("subscriptionData");
        toast.success("Subscription created successfully");
      },
      onError: (error) => {
        console.error('Subscription creation failed:', error);
        if (error.response?.data?.message?.length) {
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
  };
  