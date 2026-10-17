import { useTranslate } from '@/shared/hooks/languages/useI18';
import { QRCodeCanvas } from 'qrcode.react'
import React from 'react'

const WifiConnect = () => {

    const wifi = localStorage.getItem('wifi')!;
    const password = localStorage.getItem('wifiPassword')!;

    const wifiString = `WIFI:S:${wifi};T:WPA;P:${password};`

    const { t } = useTranslate();

    return (
        <div className="wifi-connect__container" >
            <div className="wifi-connect__header">
                <h2 className="wifi-content__title"> {t('orScanQR')}:</h2>
            </div>

            <div className="wifi-connect__content">
                <div className="wifi-connect__icon">
                    <QRCodeCanvas style={{
                        width: '18rem',
                        height: '18rem',
                    }} bgColor='transparent' fgColor='white' level='L' value={wifiString} />
                </div>
            </div>
        </div >
    )
}

export default WifiConnect