import { useAddReservationsMutation } from "@/services/PMS/servicesApi";


export const useAddReservations = () => {
    const [addReservations, { isSuccess, isLoading, isError }] = useAddReservationsMutation();

    const addReservation = async (data: any) => {
        try {
            const response = await addReservations(data).unwrap();

            return response;
        } catch (error) {
            console.error('Error adding reservation:', error);
            throw error;
        }
    }

    return {
        addReservation,
        isSuccess,
        isLoading,
        isError
    }
}