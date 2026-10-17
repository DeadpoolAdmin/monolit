import { QRCodeCanvas } from 'qrcode.react'
import React, { useMemo } from 'react'


const CardsQr = () => {
    const [qrCodeValue, setQrCodeValue] = React.useState('');

    const deviceInfo = JSON.parse(localStorage.getItem('deviceInfo') as string);
    

    const deviceInformation = useMemo(() => {
        return {
            deviceId: deviceInfo?.id,
            deviceIp: deviceInfo?.ip,
            roomNumber: deviceInfo?.room?.number,
            castUrl: deviceInfo?.organization?.config?.castUrl
        }
    }, [deviceInfo])

    React.useEffect(() => {
        setQrCodeValue(`${deviceInformation.castUrl}?deviceId=${deviceInformation.deviceId}&deviceIp=${deviceInformation.deviceIp}&roomNumber=${deviceInformation.roomNumber}`)
    }, [deviceInformation])


    return (
        qrCodeValue &&
        <div className='cards__wifi'>
            <div className="cards_wifi__content">
                <div className="content__title">
                    <span className='number'>2.</span>
                    <span className='title'>Pair your device</span>
                </div>

                <div className="content__icon">
                    <QRCodeCanvas style={{
                        width: '25rem',
                        height: '25rem',
                        position: 'relative',
                        top: '-1rem',
                        left: '-2rem'
                    }} bgColor='transparent' fgColor='white' level='H' value={qrCodeValue}
                    />
                </div>
            </div>
        </div>
    )
}

export default CardsQr