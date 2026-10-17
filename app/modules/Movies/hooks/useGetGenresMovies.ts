import { useLazyGetMoviesWithGenresQuery } from "@/services/Media/Backend/MediaApi";

export const useGetGenresMovies = () => {
    const [getGenresMovies, { isLoading, isError }] = useLazyGetMoviesWithGenresQuery();

    const onGetGenresMovies = async (genreIds: string[]) => {
        try {
            const res = await getGenresMovies(genreIds);

            if ('data' in res) {
                return res.data
            }
        }

        catch (e) {
            console.log(e)
        }
    }

    return { onGetGenresMovies, isLoading, isError }
}