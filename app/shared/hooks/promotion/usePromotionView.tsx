import { useChangeViewCountMutation } from "@/services/Settings/SettingsApi";

export const usePromotionView = () => {
    const [changeViewCount, { isLoading: viewLoading, isError: viewError }] = useChangeViewCountMutation();

    const handleChangeViewCount = async (id: string) => {
        try {
            const response = await changeViewCount({ id }).unwrap();
            return response;
        } catch (error) {
            console.error('Error changing view count:', error);
            return null;
        }
    }

    return { handleChangeViewCount, viewLoading, viewError }
}