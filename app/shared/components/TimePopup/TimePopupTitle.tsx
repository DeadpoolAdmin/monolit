import { useTranslate } from '@/shared/hooks/languages/useI18';
import React from 'react'

const TimePopupTitle = () => {

    const { t } = useTranslate();

    return (
        <div className='popup__title'>
            <span>{t('selectTimeAndDate')}</span>
        </div>
    )
}

export default TimePopupTitle