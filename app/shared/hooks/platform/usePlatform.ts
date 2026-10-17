export const usePlatform = () => {
    const isAndroid = typeof window.Android !== 'undefined';
    const isWebOS = /webOS|web0s/i.test(navigator.userAgent);
    const isTizen = typeof window.tizen !== 'undefined';
    const isWeb = !(/android|webos|tizen/i.test(navigator.userAgent)); // everything else = web


    return {
        isAndroid,
        isWebOS,
        isTizen,
        isWeb
    }
}