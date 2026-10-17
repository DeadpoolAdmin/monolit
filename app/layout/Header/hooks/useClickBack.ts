import { useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom"

export const useClickBack = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isManyWarehouses = localStorage.getItem('isManyWarehouses') as string;

    const parsedIsManyWarehouses = useMemo(() => {
        return JSON.parse(isManyWarehouses)
    }, [isManyWarehouses]);


    const clickBack = useCallback(() => {

        // Handle specific route-based navigation logic
        if (location.pathname === '/menu/vod') {
            // When on VOD main page, always go back to menu
            navigate('/menu');
        } else if (location.pathname.startsWith('/menu/vod/')) {
            // When on movie detail page, go back to VOD main page
            navigate('/menu/vod');
        }
        else if (location.pathname.includes('services/') || location.pathname.includes('products/')) {

            if(window.fromPromotion) {
                return navigate('/menu');
            }

            if(location.pathname === '/menu/products/categories' || location.pathname === '/menu/services/categories'){
                if(parsedIsManyWarehouses){
                    navigate(-1);
                } else {
                    navigate('/menu');
                }
            }
            else {
                navigate(-1);
            }
        }
        else if (location.pathname.includes('myorders/')) {
        
            navigate('/menu/myorders')
            
        }
        else if(location.pathname.includes('myorders')) {
            navigate('/menu');
        }
        else if(location.pathname.includes('infocenter')) {
            if(location.pathname.includes('infocenter/')) {
                navigate(-1);

                return
            } else {
                navigate('/menu');
            }
        }
        else {
            // Default behavior for other routes
            navigate(-1);
        }
    }, [navigate, location.pathname])

    return {
        clickBack
    }
}