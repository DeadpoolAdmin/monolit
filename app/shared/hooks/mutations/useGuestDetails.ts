import { useEffect, useState } from "react";
import { useLazyGetGestDetailsQuery } from "@/services/Settings/SettingsApi";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsGuestAlive, setIsGuestLoaded } from "@/slices/SettingsSlice";

let hasRequestedGuestDetails = false;
let lastRequestedToken: string | null = null;

export const useGuestDetails = () => {
    const location = useLocation();
    const [guestName, setGuestName] = useState<string | null>(() => {
        try { return localStorage.getItem('guest'); } catch { return null; }
    })

    const [getGuestDetails, { isSuccess, isLoading, error }] = useLazyGetGestDetailsQuery();

    const dispatch = useDispatch();

    const onGetGuestDetails = async () => {
        try {
            const response = await getGuestDetails(undefined).unwrap();
            if (response) {
                dispatch(setIsGuestAlive(true));

                if (response.firstName) {
                    const fullName = `${response.firstName + ' ' + response.lastName}`;
                    setGuestName(fullName);

                    try { localStorage.setItem('guest', fullName); } catch { }
                }
                else {
                    setGuestName(null);

                    dispatch(setIsGuestAlive(false))
                }
            }
            else {
                dispatch(setIsGuestAlive(false))
            }

            // Set guest loaded only after we've determined the guest status
            dispatch(setIsGuestLoaded(true));
        }
        catch (err) {
            console.log(err)

            // Set guest as not alive on error to show the popup
            dispatch(setIsGuestAlive(false))

            // Set guest loaded even on error since we've determined the status
            dispatch(setIsGuestLoaded(true));
        }
    }





    useEffect(() => {
        const token = localStorage.getItem('token');
        const currentPath = location.pathname || '';
        const onActivateRoute = currentPath.includes('activate');
        const isInitialRoot = currentPath === '/';
        if (!onActivateRoute && !isInitialRoot && token) {
            const tokenChanged = lastRequestedToken !== token;
            if (!hasRequestedGuestDetails || tokenChanged) {
                hasRequestedGuestDetails = true;
                lastRequestedToken = token;
                onGetGuestDetails();
            }
        }
    }, [location.pathname])



    // No debug logging in production hook

    return { isSuccess, isLoading, error, guestName }
}   