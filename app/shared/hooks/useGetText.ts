// message : { en : string, fr : string }
// or
// message : string


export const useText = () => {
    const getText = (field : string | Record<string, string>, key : string) => {
        if(typeof field === 'string') {
            return field;
        }
        else if (typeof field === 'object' && field !== null) {
            // Return the value for the key, or fallback to English, or first available, or empty string
            return field[key] || field['en'] || Object.values(field)[0] || '';
        }
        else {
            return ''
        }
    }  

    return {getText}
}