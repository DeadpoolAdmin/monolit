import * as React from 'react'

import device from '@assets/device.png'
import { useDeviceInfo } from '../../hooks/useDeviceInfo'
import { useTranslate } from '@/shared/hooks/languages/useI18'

const DeviceInfo = () => {
    const { deviceData } = useDeviceInfo()

    const { t } = useTranslate();

    return (
        <div className='settings__device-info'>
            <div className="device-info__container">
                <h2 className="device-info__title">{t('deviceInfo')}</h2>

                <div className="device-info__content">
                    <div className="device-info__icon">
                        <img src={device} alt="device" />
                    </div>

                    <div className="device-info__details">
                        <div className="device-info__item">
                            <span className="device-info__label">{t('deviceModel')}:</span>
                            <span className="device-info__value">{deviceData?.model || 'N/A'}</span>
                        </div>

                        <div className="device-info__item">
                            <span className="device-info__label">{t('deviceIP')}:</span>
                            <span className="device-info__value">{deviceData?.ip || 'N/A'}</span>
                        </div>

                        <div className="device-info__item">
                            <span className="device-info__label">{t('deviceID')}:</span>
                            <span className="device-info__value">{deviceData?.deviceId || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeviceInfo