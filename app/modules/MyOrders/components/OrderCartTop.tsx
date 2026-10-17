import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useKeydown } from '@hotel-smarters/use-key-down-control'
import { useNavigate } from 'react-router-dom'
import { setSelectedTab } from '@/slices/Orders/OrderTabSlice'
import { SelectedTab } from '../types/selectedTab'
import { setPrevRootControl, setRootControl } from '@/slices/RootControlSlice'
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL'
import { useTranslate } from '@/shared/hooks/languages/useI18'

const OrderCartTop = React.memo(() => {
    const activeBorderRef = useRef<HTMLDivElement>(null)

    const [index, setIndex] = useState(0)

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const tabs = useSelector((state: any) => state.orderTab.selectedTab)

    const rootControl = useSelector((state: any) => state.rootControl.rootControl)

    const { t } = useTranslate();

    const onClickInventories = useCallback(() => {
        dispatch(setSelectedTab(SelectedTab.INVENTORIES))
    }, [dispatch])

    const onClickReservations = useCallback(() => {
        dispatch(setSelectedTab(SelectedTab.RESERVATIONS))
    }, [dispatch])

    const handleLeft = useCallback(() => {
        if (index === 0) return;
        setIndex(0)
    }, [index])

    const handleRight = useCallback(() => {
        if (index === 1) return;
        setIndex(1)
    }, [index])

    const handleUp = useCallback(() => {
        dispatch(setPrevRootControl(rootControl))
        dispatch(setRootControl(ROOT_CONTROL.HEADER_BACK))
    }, [rootControl])

    const handleOk = useCallback(() => {
        if (index === 0) {
            onClickInventories();
        }

        if (index === 1) {
            onClickReservations();
        }
    }, [index, onClickInventories, onClickReservations])

    const handleDown = useCallback(() => {
        dispatch(setRootControl(ROOT_CONTROL.ORDER_CART))
    }, [dispatch])


    const controls = useMemo(() => ({
        id: 'order_cart_top',
        isActive: rootControl === ROOT_CONTROL.ORDER_TABS,
        left: handleLeft,
        right: handleRight,
        up: handleUp,
        ok: handleOk,
        down: handleDown,
        back: () => {
            if (index === 0) {
                navigate(-1)
            }
            else {
                setIndex(0)
            }
        }
    }), [rootControl, handleLeft, handleRight, handleUp, handleOk, handleDown, navigate])


    useKeydown(controls)


    return (
        <div className='order__cart_top'>
            <div className="top__tabs">
                <div className={`inventories ${index === 0 && rootControl === ROOT_CONTROL.ORDER_TABS ? 'active' : ''} ${tabs === SelectedTab.INVENTORIES ? 'selected' : ''}`} onClick={onClickInventories}>
                    <span>{t('orders')}</span>
                </div>
                <div className={`reservations ${index === 1 && rootControl === ROOT_CONTROL.ORDER_TABS ? 'active' : ''} ${tabs === SelectedTab.RESERVATIONS ? 'selected' : ''}`} onClick={onClickReservations}>
                    <span>{t('serviceRequests')}</span>
                </div>

                <div className="active__border" ref={activeBorderRef}></div>
            </div>
        </div>
    )
})

OrderCartTop.displayName = 'OrderCartTop'

export default OrderCartTop