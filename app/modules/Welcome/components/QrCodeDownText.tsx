import { useTranslate } from '@/shared/hooks/languages/useI18';
import React from 'react'

const WelcomeContentQrcodeDownText = ({ password, ssid }: { password: string, ssid: string }) => {

    const { t } = useTranslate();

    return (
        <>
            <div className="qr_code__down_text">
                <p style={{ fontSize: '2.8rem' }}>
                    {t('or')}
                </p>
            </div>

            <div className="qr_code__code_output">
                <p style={{ fontSize: '2.8rem' }}>SSID: </p>
                <p style={{ marginLeft: '1rem', fontWeight: 700, fontSize: '2.8rem' }}>
                    {ssid}
                </p>
            </div>

            <div className="qr_code__code_output">
                <p style={{ fontSize: '2.8rem' }}>{t('code')}: </p>
                <p style={{ marginLeft: '1rem', fontWeight: 700, fontSize: '2.8rem' }}>
                    {password}
                </p>
            </div>
        </>
    )
}

export default WelcomeContentQrcodeDownText