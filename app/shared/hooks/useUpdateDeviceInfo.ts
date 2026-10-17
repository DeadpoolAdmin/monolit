import { useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { usePolyfillSearchParams } from "@hotel-smarters/polyfill-search-params";
import { setDeviceInfo } from "@/slices/DeviceInfo";
import { useSelector } from "react-redux";
import { useGetDeviceInfoMutation } from "@/services/DeviceInfo/DeviceInfoApi";

export const useUpdateDeviceInfo = () => {
    const [updateDeviceInfo, { isLoading, isError }] = useGetDeviceInfoMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const location = useLocation();
    const queryParams = usePolyfillSearchParams().toString();

    const deviceInfoFromStore = useSelector((state: any) => state.deviceInfo?.deviceInfo);

    const updateDeviceInfoData = useCallback(async () => {
        try {
            const result = await updateDeviceInfo(undefined).unwrap();
            
            dispatch(setDeviceInfo(result))
            
        } catch (error: any) {
            console.error('Error fetching device info:', error);
            
            // Only clear localStorage and redirect on authentication errors (401, 403)
            if (error?.status === 401 || error?.status === 403) {
                if (!queryParams.includes('deviceToken')) {
                    localStorage.clear();
                    navigate('/');
                }
            }
        }
    }, [location, dispatch, updateDeviceInfo, queryParams, navigate]);


    useEffect(() => {
        if(isError) {
            localStorage.clear();
            navigate('/');
        }
    }, [isError]);

    useEffect(() => {
       if(deviceInfoFromStore) {
        localStorage.setItem('deviceInfo', JSON.stringify(deviceInfoFromStore));
       }
    }, [deviceInfoFromStore]);

    return { updateDeviceInfoData, isLoading };
}