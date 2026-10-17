import { useTranslate } from '@/shared/hooks/languages/useI18';
import React from 'react'

const WelcomeContentQrCodeTopText = () => {

    const { t } = useTranslate();


    return (
        <>
            <div className="qr_code__top_text">
                <p>
                    {t('connectToWiFi')}
                </p>
            </div>

            <div className="qr_code__top_subtext">
                <p>
                    {t('scanQR')}
                </p>
            </div>
        </>
    )
}

export default WelcomeContentQrCodeTopText