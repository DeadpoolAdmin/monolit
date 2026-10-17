import { useAddOrdersMutation } from "@/services/PMS/servicesApi";

export const useAddOrders = () => {
    const [addOrders, { isLoading: orderAddLoading, isSuccess, isError, error }] = useAddOrdersMutation();

    const addOrder = async (data: any) => {
        try {
            const response = await addOrders(data).unwrap();
            return response;
        } catch (err) {
            throw err;
        }
    };

    return {
        addOrder,
        orderAddLoading,
        isSuccess,
        isError,
        error
    }
}