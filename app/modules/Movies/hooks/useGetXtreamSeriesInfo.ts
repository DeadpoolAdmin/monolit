import { useLazyGetXtreamSeriesInfoQuery } from "@/services/Media/PlaylistApi/PlaylistApi";

export const useGetXtreamSeriesInfo = () => {
    const [ getXtreamSeriesInfo, {isLoading : xtreamSeriesInfoLoading, isError : xtreamSeriesInfoError} ] = useLazyGetXtreamSeriesInfoQuery();

    const onGetXtreamSeriesInfo = async (series_id : number | string) => {
        try {
            const res = await getXtreamSeriesInfo(series_id);

            if('data' in res) {
                return res.data;
            }
        }
        catch(e) {
            console.log(e)
        }
    }

   return { onGetXtreamSeriesInfo, xtreamSeriesInfoLoading, xtreamSeriesInfoError }
}