import Back from '@/layout/Header/components/Back/Back'
import { useTranslate } from '@/shared/hooks/languages/useI18';
import { useResolution } from '@hotel-smarters/resolution-hook';
import React, { memo } from 'react'
import { useNavigate } from 'react-router'


const MessageHeader = () => {

    const navigate = useNavigate();

    const onClickBack = () => {
        navigate('/menu');
    }

    const deviceType = useResolution().getDeviceType();

    const { t } = useTranslate();


    return (
        <div className='message__header'>
            <div className="header__content">
                <div className="content-user-info">
                    

                    {
                        deviceType === 'TABLET' && (
                            <Back isActive={false} onClick={onClickBack} style={{
                                position: 'absolute',
                                left: '3rem',
                            }} />
                        )
                    }
                  
                    <div className="user-info__name">
                        <span>
                            {t('frontDesk')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(MessageHeader) 