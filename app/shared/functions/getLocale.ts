export const getLocale = (language: string) => {
    const localeMap: { [key: string]: string } = {
        'en': 'en-US',
        'es': 'es-ES',
        'fr': 'fr-FR',
        'hy': 'hy-AM',
        'pt': 'pt-PT',
        // Add more languages as needed
    };
    return localeMap[language] || 'en-US';
}