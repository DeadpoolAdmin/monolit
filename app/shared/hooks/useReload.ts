// Non-hook version that can be called from anywhere

import { useResolution } from "@hotel-smarters/resolution-hook";

const globalThis = window as any

export const reloadApp = () => {
    const isAndroid = typeof window.Android !== 'undefined';
    const isWebOS = /webOS|web0s/i.test(navigator.userAgent);
    const isTizen = typeof window.tizen !== 'undefined';

    const { getDeviceType } = useResolution();

    const deviceType = getDeviceType();

    if (isAndroid) {
        globalThis.Android.destroyPlayer();
        globalThis.Android.restartApp();
    }
    else if (isWebOS) {
        globalThis.location.href = '/'
    }
    else if (isTizen) {
        const appId = window.tizen.application.getCurrentApplication().appInfo.id;
        window.tizen.application.launch(appId);
    }
    else {
        localStorage.clear();
        window.location.href = `${deviceType === 'SIGNAGE' ? '/?device=signage' : deviceType === 'TABLET' ? '/?device=tablet' : '/'}`
    }
}
