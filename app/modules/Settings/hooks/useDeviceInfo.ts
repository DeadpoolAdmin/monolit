import { useEffect, useState } from "react";

export interface DeviceInfo {
    id: number;
    ip: string;
    model: string;
    deviceId: string;
}

const getDeviceInfoFromStorage = (): DeviceInfo | null => {
    try {
        const deviceDataStr = localStorage.getItem('deviceInfo');
        if (!deviceDataStr) return null;

        const deviceData = JSON.parse(deviceDataStr);
        return {
            id: deviceData.id,
            ip: deviceData.ip,
            model: deviceData.model,
            deviceId: deviceData.deviceId
        };
    } catch (error) {
        console.warn('Failed to read device info from localStorage:', error);
        return null;
    }
};

export const useDeviceInfo = () => {
    const [deviceData, setDeviceData] = useState<DeviceInfo | null>(null);

    useEffect(() => {
        const data = getDeviceInfoFromStorage();
        setDeviceData(data);
    }, []);

    return {
        deviceData
    }
}
