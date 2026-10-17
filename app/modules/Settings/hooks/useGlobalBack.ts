import { useKeydown } from "@hotel-smarters/use-key-down-control";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom"

export const useGlobalBack = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const controls = useMemo(() => {
        return {
            id: 'global-back-control',
            isActive: location.pathname.includes('settings'),
            back: () => {
                navigate('/menu')
            }
        }
    }, [location])

    useKeydown(controls);
}