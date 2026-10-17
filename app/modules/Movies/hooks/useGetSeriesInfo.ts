import { useLazyGetSeriesInfoQuery } from "@/services/Media/Backend/MediaApi";

export const useGetSeriesInfo = () => {
    const [getSeriesInfo, { isLoading, isError }] = useLazyGetSeriesInfoQuery();

    const onGetSeriesInfo = async (seriesId: string) => {
        try {
            const res = await getSeriesInfo(seriesId);

            if ('data' in res) {
                return res.data
            }
        }

        catch (e) {
            console.log(e)
        }
    }
    return { onGetSeriesInfo, isLoading, isError }
}