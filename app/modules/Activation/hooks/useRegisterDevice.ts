
import { useRegisterDeviceMutation } from "@/services/DeviceInfo/DeviceApi"
import { DeviceInfo } from "@/shared/types/DeviceInfo"
import { useCallback, useMemo } from "react"

export const useRegisterDevice = () => {
    const [registerDevice, { isLoading : registerDeviceLoading, isError : registerDeviceError }] = useRegisterDeviceMutation()

    const onRegisterDevice = useCallback(async (deviceInfo : DeviceInfo, type : string) => {
        try {
            const res = await registerDevice({ deviceInfo, type })

            if('data' in res) {
                return res.data
            }
        }
        catch(e) {
            console.log(e)
        }
    }, [registerDevice])

    const result = useMemo(() => ({
        onRegisterDevice, 
        registerDeviceLoading, 
        registerDeviceError
    }), [onRegisterDevice, registerDeviceLoading, registerDeviceError])

    return result
}