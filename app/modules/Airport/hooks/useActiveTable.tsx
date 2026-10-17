import { useEffect } from "react";
import { useControl } from "./useControl";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";

export const useActiveTable = () => {
    const { setControl } = useControl();

    useEffect(() => {
        setControl(ROOT_CONTROL.FLIGHT_TABLE as unknown as typeof ROOT_CONTROL);
    }, [])
}