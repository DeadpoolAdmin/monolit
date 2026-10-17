import React, { useEffect } from 'react'

import emptyIcon from '@assets/empty.png'

import '@/shared/styles/Empty/empty.scss'

import { Button } from '@/shared/components/Button/Button'
import { useTranslate } from '@/shared/hooks/languages/useI18'
import { useSelector } from 'react-redux'
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL'
import { useDispatch } from 'react-redux'
import { setRootControl } from '@/slices/RootControlSlice'
import { useClickBack } from '@/layout/Header/hooks/useClickBack'

const Empty = () => {
    const { t } = useTranslate()

    const dispatch = useDispatch();

    const { clickBack } = useClickBack()

    const rootControl = useSelector((state: any) => state.rootControl.rootControl)

    useEffect(() => {
        dispatch(setRootControl(ROOT_CONTROL.EMPTY))
    }, [])


    return (
        <div className='empty' style={{
            position: 'absolute',
            top: 0,
            left: 0
        }}>
            <div className='empty-content'>
                <div className="empty-content__icon">
                    <img
                        src={emptyIcon}
                        alt="empty"
                        onError={(e) => {
                            console.warn('Failed to load empty icon');
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                </div>

                <div className='empty-content-title'>
                    <span>{t('thisPageIsEmpty')}</span>
                    <br />
                    <span>{t('pressBackToGoBack')}</span>
                </div>

                <Button minWidth='38' maxWidth='38' ok={clickBack} className='app_button secondary' back={clickBack} isActive={rootControl === ROOT_CONTROL.EMPTY} style={{
                    border: '.2rem solid var(--active-color)',
                }}>
                    <span className='button-text'>{t('back')}</span>
                </Button>
            </div>
        </div>
    )
}

export default React.memo(Empty)