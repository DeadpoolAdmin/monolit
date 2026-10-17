import React from 'react'
import { QRCodeCanvas } from 'qrcode.react';
import WelcomeContentQrCodeTopText from './QrCodeTopText';
import WelcomeContentQrcodeDownText from './QrCodeDownText';
import { useSelector } from 'react-redux';

const WelcomeContentQrCode = () => {


    const settingsData = useSelector((state: any) => state.settingsData.settingsData);

    const wifiString = `WIFI:S:${settingsData?.wifiSsid};T:WPA;P:${settingsData?.wifiPassword};;`;

    return (
        <div className="content__qr_code">
            <WelcomeContentQrCodeTopText />

            <QRCodeCanvas style={{
                width: '18rem',
                height: '18rem',
            }} bgColor='transparent' fgColor='white' level='H' value={wifiString || ''}
            />

            {
                settingsData?.wifiSsid && settingsData?.wifiPassword ? <WelcomeContentQrcodeDownText ssid={settingsData?.wifiSsid} password={settingsData?.wifiPassword} /> : <></>
            }
        </div>

    )
}

export default WelcomeContentQrCode