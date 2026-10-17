import React from 'react'

import wifi from '@assets/wifi.png'
import { useTranslate } from '@/shared/hooks/languages/useI18';



const WifiInfo = () => {

    const wifiItems = {
        name: localStorage.getItem('wifi')!,
        password: localStorage.getItem('wifiPassword')!
    }

    const { t } = useTranslate();

    return (
        <div className="wifi-content__container">
            <h2 className="wifi-content__title">{t('wi-fiInfo')}</h2>

            <div className="wifi-content__content">
                <div className="wifi-content__icon">
                    <img src={wifi} alt="wifi" />
                </div>

                <div className="wifi-content__details">
                    <div className="wifi-content__item">
                        <span className="wifi-content__label">{t('name')}:</span>
                        <span className="wifi-content__value">{wifiItems.name || 'N/A'}</span>
                    </div>

                    <div className="wifi-content__item">
                        <span className="wifi-content__label">{t('password')}: </span>
                        <span className="wifi-content__value">{wifiItems.password || 'N/A'}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WifiInfo