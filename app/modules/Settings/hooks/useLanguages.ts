import { useLazyGetLanguagesQuery } from "@/services/Settings/SettingsApi";
import { useEffect, useState } from "react";
import { Language } from "../types";

export const useLanguages = () => {
    const [getLanguages, { data: languages, isLoading, isFetching }] = useLazyGetLanguagesQuery();

    const [languagesList, setLanguagesList] = useState<Language[]>([]);

    const onGetLanguages = async () => {
        try {
            console.log('Fetching languages from:', process.env.REACT_APP_API_HOST + 'settings/languages/enabled');
            const result = await getLanguages({});
            if ('data' in result && result.data) {
                setLanguagesList(result.data);
            }
        }
        catch (error: any) {
            console.error('Error fetching languages:', error);
            console.error('Error details:', {
                status: error?.status,
                originalStatus: error?.originalStatus,
                data: error?.data,
                error: error?.error
            });
        }
    }

    useEffect(() => {
        onGetLanguages();
    }, [])

    return {
        loading : isFetching || isLoading,
        languagesList,
        languages: languages
    }
}