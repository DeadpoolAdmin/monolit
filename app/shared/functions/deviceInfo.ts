import getWebOSInfo from './getWebOSInfo';
import { DeviceInfo } from '../types/DeviceInfo';


const isSignage = window.location.search.includes('device=signage') || window.location.search.includes('device=SIGNAGE');
const isTablet = window.location.search.includes('device=tablet') || window.location.search.includes('device=TABLET');


const getTizenDeviceInfo = async (): Promise<DeviceInfo> => {
  const globalThis = window as any;
  

  const getProp = (prop: string): Promise<any> =>
    new Promise((resolve, reject) => {
      globalThis.tizen.systeminfo.getPropertyValue(
        prop,
        (value: any) => resolve(value),
        (error: any) => reject(error)
      );
    });

  try {

    const build = await getProp("BUILD");
    const network = await getProp("NETWORK");
    const wifi = await getProp("WIFI_NETWORK");
    const os = "tizen";

    const model = build.model;
    const deviceId = globalThis.tizen.systeminfo.getCapability("http://tizen.org/system/tizenid") + (isSignage ? '-signage' : '' + (isTablet ? '-tablet' : '')) + '-web'; // sometimes available
    const ip = wifi.ipAddress || network.ipAddress || "Unavailable";

    return {
      model,
      deviceId,
      os,
      ip,
      name: build.model || "Tizen Device"
    };
  } catch (e) {
    console.error("Error fetching from tizen.systeminfo:", e);
    throw e;
  }
};

export const useDeviceInfo = () => {
  const globalThis = window as any;

  const getDeviceInfo = async (): Promise<DeviceInfo> => {
    if ('tizen' in globalThis) {
      return await getTizenDeviceInfo();
    }

    if ('Android' in globalThis || 'android' in globalThis) {
      try {
        const model = globalThis.Android.getModel();
        const deviceId = globalThis.Android.getDeviceId();
        const ip = globalThis.Android.getIP();
        const os = 'android';
        const name = globalThis.Android.getModel();
        return { model, deviceId: deviceId + (isSignage ? '-signage' : '' + (isTablet ? '-tablet' : '' + '-web' )), os, ip, name };
      } catch (e) {
        console.error('Error accessing Android device info:', e);
      }
    }

   if(/webOS|web0s/i.test(navigator.userAgent)) {

    try {

      const { deviceId, model, ipAddress } = await getWebOSInfo() as { deviceId: string; model: string; ipAddress: string };

      return { 
        deviceId: deviceId + (isSignage ? '-signage' : '' + (isTablet ? '-tablet' : '' + '-web' )), 
        model, 
        os: 'webos',
        ip: ipAddress,
        name: model || 'WebOS Device'
      };
    }
    catch(e) {
      console.error('Error accessing WebOS device info:', e);
    }
   }

    return {
      model: 'web',
      deviceId:'WEB-DEVICE00' + (isSignage ? '-signage' : '' + (isTablet ? '-tablet' : '' + '-web' )),
      os: 'android',
      ip: '1.2.3.4',  
      name: 'DEMO'
    };
  };

  return { getDeviceInfo };
};