import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useKeydown } from '@hotel-smarters/use-key-down-control';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/shared/components/Button/Button'
import 'smarters-ino-ui-tv/dist/main.css'

import { Popup } from '@shared/components/Popup';
import { useCancelOrderMutation, useCancelReservationMutation } from '@/services/PMS/servicesApi';
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL';
import { setRootControl } from '@/slices/RootControlSlice';
import { setSelectedTab } from '@/slices/Orders/OrderTabSlice';
import { SelectedTab } from '../types/selectedTab';
import ButtonLoader from '@/shared/components/ButtonLoader/ButtonLoader';
import { useTranslate } from '@/shared/hooks/languages/useI18';

const ConfirmPopup = ({ setPopup }: { setPopup: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const rootControl = useSelector((state: any) => state.rootControl.rootControl);

    const [orderCancel, { isLoading, isError }] = useCancelOrderMutation();
    const [reservationCancel, { isLoading: isReservationLoading, isError: isReservationError }] = useCancelReservationMutation();

    const dispatch = useDispatch();

    const [index, setIndex] = useState<number>(0);

    const { id } = useParams();

    const navigate = useNavigate();

    const order = JSON.parse(localStorage.getItem('order') || '{}');

    const { t } = useTranslate();

    const orderCacnel = async () => {
        try {
            const response = await orderCancel(id!).unwrap();

            if (response) {
                window.dispatchEvent(new CustomEvent('toastOrderCanceled'));
                window.dispatchEvent(new CustomEvent('refetchOrders'));
            }

            if (isError) {
                dispatch(setRootControl(ROOT_CONTROL.ORDER_CART_ITEM))
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    const reservationCacnel = async () => {
        try {
            const response = await reservationCancel(id!).unwrap();

            if (response) {
                window.dispatchEvent(new CustomEvent('toastReservationCanceled'));
                window.dispatchEvent(new CustomEvent('refetchReservations'));
            }


            if (isReservationError) {
                dispatch(setRootControl(ROOT_CONTROL.ORDER_CART_ITEM))
            }
        }
        catch (e) {
            console.log(e);
        }
    }


    const onIndexZero = () => {
        if (isLoading) return;

        dispatch(setRootControl(ROOT_CONTROL.ORDER_CART_ITEM));
        setPopup(false);
    }

    const onIndexOne = async () => {
        if (isLoading) return;

        if (order?.type === 'reservation') {
            await reservationCacnel();

            if (!isReservationLoading) {
                dispatch(setRootControl(ROOT_CONTROL.ORDER_CART));
                setPopup(false);

                navigate(-1);

                dispatch(setSelectedTab(SelectedTab.RESERVATIONS))
            }
        }
        else {
            await orderCacnel();

            if (!isLoading) {
                dispatch(setRootControl(ROOT_CONTROL.ORDER_CART));
                setPopup(false);

                navigate(-1);

                dispatch(setSelectedTab(SelectedTab.INVENTORIES))
            }
        }
    }

    const controls = useMemo(() => ({
        isActive: rootControl === ROOT_CONTROL.ORDER_POPUP,
        id: 'confirm__popup__controls',
        back: () => {
            if (isLoading) return;
            dispatch(setRootControl(ROOT_CONTROL.ORDER_CART_ITEM));
            setPopup(false);
            setIndex(0)
        },
        ok: async () => {
            if (isLoading) return;

            if (index === 0) {
                onIndexZero();
            }
            else {
                await onIndexOne();
            }
        }
    }), [rootControl, isLoading, index, onIndexZero, onIndexOne, dispatch, setPopup]);

    useKeydown(controls);

    return (
        <Popup
            isOpen={true}
            closable={!isLoading}
            onClose={() => {
                dispatch(setRootControl(ROOT_CONTROL.ORDER_CART_ITEM));
                setPopup(false);
                setIndex(0);
            }}
            keyboardControls={controls}
            className="confirm__popup"
            contentClassName="confirm__popup__content"
            overlayOpacity={0.5}
        >
            <div className='confirm__popup__content__title'>
                <span>{t('areYouSureYouWantToCancel')}</span>
            </div>

            <div className="confirm__popup__content__buttons">
                <Button 
                    className='primary' 
                    ok={onIndexZero} 
                    minWidth='25'
                    maxWidth='35'
                    style={{
                        backgroundColor: 'var(--primary-button-bg-color, var(--initial-primary-button-bg-color))',
                        color: 'var(--primary-button-text-color, var(--initial-primary-button-text-color))',
                        border: '.2rem solid transparent',
                        borderColor: index === 0 ? 'var(--active-color, var(--initial-active-color))' : 'transparent'
                    }} 
                    isActive={index === 0} 
                    right={() => !isLoading && setIndex(1)}
                >
                    <span className="button-text">{t('close')}</span>
                </Button>

                <Button 
                    className='secondary' 
                    minWidth='25'
                    maxWidth='35'
                    ok={async () => await onIndexOne()} 
                    style={{
                        opacity: isLoading ? 0.5 : 1,
                        border: '.2rem solid transparent',
                        borderColor: index === 1 ? 'var(--active-color, var(--initial-active-color))' : 'transparent'
                    }} 
                    isActive={index === 1} 
                    left={() => !isLoading && setIndex(0)}
                >
                    {isLoading || isReservationLoading ? <ButtonLoader /> : <span className="button-text">{t('confirm')}</span>}
                </Button>
            </div>
        </Popup>
    )
}

export default ConfirmPopup