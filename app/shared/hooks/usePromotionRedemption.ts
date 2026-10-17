import { useChangeRedemptionCountMutation } from "@/services/Settings/SettingsApi";

export const usePromotionRedemption = () => {
    const [changeRedemptionCount, { isLoading, isError }] = useChangeRedemptionCountMutation()

    const onChangeRedemptionCount = async (id: string) => {
        try {
            const response = await changeRedemptionCount(id).unwrap();

            return response

        }
        catch (e) {
            console.log(e)
        }
    }

    return {
        onChangeRedemptionCount,
        isLoading,
        isError
    }
}