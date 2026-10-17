import { useCallback } from "react"
import { useTranslate } from "@shared/hooks/languages/useI18"

export const useChoosenLanguage = () => {
    const { changeLanguage, language } = useTranslate()

    const onChooseLanguage = useCallback((code: string) => {
        changeLanguage(code)
    }, [changeLanguage])

    return {
        onChooseLanguage,
        choosenLanguage: language
    }
}