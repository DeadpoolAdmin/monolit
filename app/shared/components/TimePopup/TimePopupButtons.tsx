import React from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

import { Button } from '@/shared/components/Button/Button'
import { setRootControl } from '@/slices/RootControlSlice'
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL'
import { useTranslate } from '@/shared/hooks/languages/useI18'

const TimePopupButtons = ({ setTimePopup }: { setTimePopup: React.Dispatch<React.SetStateAction<boolean>> }) => {

    const rootControl = useSelector((state: any) => state.rootControl?.rootControl)

    const dispatch = useDispatch();

    const { t } = useTranslate();

    const confirmDate = () => {
        window.dispatchEvent(new CustomEvent('confirm', { detail: 'confirm' }))

        setTimePopup(false);
    }

    const closePopup = () => {
        setTimePopup(false)
        dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES_CART_ADD))
    }



    return (
        <div className="popup__buttons">
            <Button
                className='secondary'
                up={() => window.dispatchEvent(new CustomEvent('up', { detail: 'up' }))}
                ok={closePopup}
                right={() => dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES_POPUP_CONFIRM))}
                style={{
                    width: '30rem',
                    fontSize: '2.5rem',
                    border: '.2rem solid transparent',
                    borderColor: rootControl === 'close' ? 'var(--active-color)' : 'transparent',
                }} isActive={rootControl === ROOT_CONTROL.HOTEL_SERVICES_POPUP_CLOSE}>
                <span>{t('close')}</span>
            </Button>
            <Button
                left={() => dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES_POPUP_CLOSE))}
                ok={confirmDate}
                up={() => window.dispatchEvent(new CustomEvent('up', { detail: 'up' }))}
                style={{
                    width: '30rem',
                    fontSize: '2.5rem',
                    border: '.2rem solid transparent',
                    borderColor: rootControl === 'confirm' ? 'var(--active-color)' : 'transparent',
                }} isActive={rootControl === ROOT_CONTROL.HOTEL_SERVICES_POPUP_CONFIRM}>
                <span>{t('confirm')}</span>
            </Button>
        </div>
    )
}

export default TimePopupButtons