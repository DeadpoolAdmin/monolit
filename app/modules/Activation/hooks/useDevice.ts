import { useGetDeviceMutation } from "@/services/DeviceInfo/DeviceApi";
import { useCallback, useMemo } from "react"


export const useDevice = () => {
    const [addDevice, { isLoading : addDeviceLoading, isError : addDeviceError }] = useGetDeviceMutation()

    const onAddDevice = useCallback(async (device_id : string) => {
        try {
            const res = await addDevice(device_id);

            if('data' in res) {
                return res.data
            }
        }
        catch(e) {
            console.log(e)
        }
    }, [addDevice])

    const result = useMemo(() => ({
        onAddDevice, 
        addDeviceLoading, 
        addDeviceError
    }), [onAddDevice, addDeviceLoading, addDeviceError])

    

    return result
}