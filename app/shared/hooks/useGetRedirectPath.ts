import { useMemo } from "react";
import { useResolution } from "@hotel-smarters/resolution-hook";

export const useGetRedirectPath = () => {
    const { getDeviceType } = useResolution();
    const deviceType = useMemo(() => getDeviceType(), []);

    const redirectPath = useMemo(() => {
        // Always check token fresh from localStorage to avoid stale closures
        const token = localStorage.getItem('token');

        if (!token) {
            // Check if device=tablet in URL and preserve it during redirect
            if (deviceType === 'TABLET') {
                return '/activate?device=tablet';
            }
            return '/activate';
        }
        if (deviceType === 'TABLET') {
            return '/menu?device=tablet';
        }
        return '/menu';
    }, [deviceType]);


    return {
        getRedirectPath: () => redirectPath,
    }
}