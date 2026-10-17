import { useTranslation } from "react-i18next";

export const useTranslate = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const getCurrentLanguage = () => {
        return i18n.language;
    };

    return {
        t,
        changeLanguage,
        getCurrentLanguage,
        language: i18n.language
    }
}