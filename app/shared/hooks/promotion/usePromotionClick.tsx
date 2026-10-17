import { useChangeClickCountMutation } from "@/services/Settings/SettingsApi";

export const usePromotionClick = () => {
    const [changeClickCount, { isLoading: clickLoading, isError: clickError }] = useChangeClickCountMutation();

    const handleChangeClickCount = async (id: string) => {
        try {
            const response = await changeClickCount({ id }).unwrap();
            return response;
        } catch (error) {
            console.error('Error changing click count:', error);
            return null;
        }
    }

    return { handleChangeClickCount, clickLoading, clickError }
}