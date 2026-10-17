import { useLazyGetLanguagesQuery } from "@/services/Settings/SettingsApi"

export const useGetLanguages = () => {
    const [getLanguages, {isLoading : languagesLoading, data : langaugesData}] = useLazyGetLanguagesQuery()

    const getLanguagesData = async () => {
        try {
            const res = await getLanguages(undefined)

            if('data' in res) {
                return res.data
            }
        }
        catch(e) {
            console.log(e)
        }
    }

    return { getLanguagesData, languagesLoading, langaugesData }
}
