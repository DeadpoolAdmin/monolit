import { useDeviceInfo } from "@/shared/functions/deviceInfo"
import { DeviceInfo } from "@/shared/types/DeviceInfo"
import { useCallback, useState } from "react"

export const useInfo = () => {

    const { getDeviceInfo } = useDeviceInfo()

    const [showingLoader, setShowingLoader] = useState<boolean>(false)

    const [dInfo, setDInfo] = useState<DeviceInfo | null>(null)

    const onGetDeviceInfo = useCallback(() => {
        getDeviceInfo().then((deviceInfo: DeviceInfo) => {
            setShowingLoader(true);
            setTimeout(() => {
                setDInfo(deviceInfo);
                setShowingLoader(false);
            }, 2000); // Show loader for 2 seconds when deviceInfo is ready
        })
            .catch((error: Error) => {
                console.error(error)
                setShowingLoader(false);
            })
    }, [getDeviceInfo])

    

    return {
        showingLoader,
        dInfo,
        onGetDeviceInfo
    }
}