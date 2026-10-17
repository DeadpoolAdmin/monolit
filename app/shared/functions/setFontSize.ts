export const setFontSize = (fontFromAPI : string) => {
    const fontSize = parseInt(fontFromAPI);
    
    const toRem = fontSize / 10 + 'rem'

    return toRem;
}
