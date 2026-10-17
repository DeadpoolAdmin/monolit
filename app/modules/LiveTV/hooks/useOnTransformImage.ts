import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { useKeydown } from "@hotel-smarters/use-key-down-control";
import { useMemo, useRef } from "react"
import { useSelector } from "react-redux";

export const useOnTransformImage = () => {
    const transformTimeout = useRef<NodeJS.Timeout | null>(null)

    const rootControl = useSelector((state: any) => state.rootControl?.rootControl)


    const onTransformEnd = () => {
        clearTimeout(transformTimeout.current!)

        transformTimeout.current = setTimeout(() => {
            window.transforming = false
            window.dispatchEvent(new Event("transformend"))
        }, 700)

    }

    const controls = useMemo(() => {
        return {
            id: 'on-transform-image',
            isActive: rootControl === ROOT_CONTROL.LIVETV_CONTENT,
            down: () => {
                window.transforming = true;
                window.dispatchEvent(new Event("transformstart"));

                onTransformEnd();
            },
            up: () => {
                window.transforming = false;
                window.dispatchEvent(new Event("transformend"));

                onTransformEnd();
            }
        }
    }, [])

    useKeydown(controls)
}