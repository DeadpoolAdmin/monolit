import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

import { Button } from '@/shared/components/Button/Button'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAddOrders } from '@/shared/hooks/mutations/useAddOrders'
import { usePromotionRedemption } from '@/shared/hooks/usePromotionRedemption'
import { setRootControl } from '@/slices/RootControlSlice'
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL'
import { clearBasket } from '@/slices/HotelServices/BasketSlice'
import Order from '@/shared/HotelServices/types/order.interface'
import { useKeydown } from '@hotel-smarters/use-key-down-control'
import EmptyComponent from './EmptyComponent'
import InventoryCartItems from './InventoryCartItems'
import ButtonLoader from '@/shared/components/ButtonLoader/ButtonLoader'
import { deviceType } from 'react-device-detect'
import { useResolution } from '@hotel-smarters/resolution-hook'
import { useTranslate } from '@/shared/hooks/languages/useI18'


interface InventoryCartProps {
    departmentUnitId: number | string | undefined;
    isProduct: boolean;
    isService: boolean;
}

const InventoryCart = React.memo<InventoryCartProps>(({ departmentUnitId, isProduct }) => {

    const basket = useSelector((state: any) => state.basket?.items)
    const rootControl = useSelector((state: any) => state.rootControl?.rootControl)
    const dispatch = useDispatch();
    const location = useLocation();

    const { addOrder, orderAddLoading } = useAddOrders();

    const isInDetailPage = useMemo(() => location.pathname.includes('detail'), [location.pathname]);

    const navigate = useNavigate();

    const { onChangeRedemptionCount } = usePromotionRedemption()

    const [idFromPromotion, setIdFromPromotion] = useState<number | null>(null)

    const { t } = useTranslate();

    const onPromotionClicked = useCallback((e: Event) => {
        const { detail } = e as CustomEvent
        setIdFromPromotion(detail.id)
    }, [])

    const onLeft = useCallback(() => {
        if (orderAddLoading) return;

        if (isInDetailPage) {
            dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES_CART_ADD))
        } else {
            dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES_INVENTORIES))
        }
    }, [orderAddLoading, isInDetailPage, dispatch]);

    const removeBasketItems = useCallback(() => {
        dispatch(clearBasket())

        if (isInDetailPage) {
            dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES_CART_ADD))
        } else {
            dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES_INVENTORIES))
        }
    }, [dispatch, isInDetailPage]);


    const onAddOrder = useCallback(async (data: Order) => {
        try {
            const response = await addOrder(data);
            if (response) {
                window.dispatchEvent(new CustomEvent('toastProduct'))
                removeBasketItems();

                if (window.fromPromotion) {
                    onChangeRedemptionCount(window.fromPromotion.promotionId as string)
                }
            }
        } catch (error) {
            console.error('Error adding order:', error);
        }
    }, [addOrder, removeBasketItems, onChangeRedemptionCount]);

    const purchase = useCallback(() => {
        if (!basket.length) return;

        const items = basket.map((item: any) => {
            if (isProduct) {
                return {
                    inventoryId: item.id,
                    quantity: item.quantity,
                }
            }
        })

        const sentData = {
            departmentUnitId: departmentUnitId ? departmentUnitId as number : 0,
            items
        }

        if (isProduct) {
            onAddOrder(sentData)
        }
    }, [basket, isProduct, departmentUnitId, onAddOrder]);

    useEffect(() => {
        window.addEventListener('promotionClicked', onPromotionClicked)
        return () => window.removeEventListener('promotionClicked', onPromotionClicked)
    }, [])


    const controls = useMemo(() => ({
        isActive: rootControl === ROOT_CONTROL.HOTEL_SERVICES_CART_CLEAR,
        id: 'clear',
        left: onLeft,
        down: () => {
            dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES_CART_ITEM))
        },
        ok: removeBasketItems,
        back: () => {
            if (window.fromPromotion) {
                navigate('/menu')

                return
            }
            navigate(-1);
        }
    }), [rootControl, onLeft, dispatch, removeBasketItems]);

    useKeydown(controls)

    return (
        basket &&

        <div className='inventory__cart'>
            <div className="cart__up">
                <span></span>
                <span onClick={removeBasketItems} className={`clear ${rootControl === ROOT_CONTROL.HOTEL_SERVICES_CART_CLEAR ? 'active' : ''}`} style={{
                    color: '#444444'
                }}>{t('clear')}</span>
            </div>

            <div className="cart__content">
                {
                    !basket.length ?
                        <EmptyComponent />

                        :
                        <InventoryCartItems loading={orderAddLoading} isProduct={isProduct} />
                }

                {
                    !basket.length ? <div></div> : <Button
                        left={onLeft}
                        up={() => !orderAddLoading && basket.length && dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES_CART_ITEM))}
                        ok={purchase}
                        back={() => navigate(-1)}
                        minWidth='25'
                        maxWidth='40'
                        style={{
                            border: '.2rem solid transparent',
                            transition: '.2s ease',
                            minWidth: 38 + 'rem',
                            borderColor: rootControl === ROOT_CONTROL.HOTEL_SERVICES_CART_PURCHASE ? 'var(--active-color)' : 'transparent',
                        }} isActive={rootControl === ROOT_CONTROL.HOTEL_SERVICES_CART_PURCHASE}>
                        {
                            orderAddLoading ?
                                <ButtonLoader />
                                :
                                <span className="button-text">{t('order')}</span>
                        }

                    </Button>
                }


            </div>
        </div>
    )
})

InventoryCart.displayName = 'InventoryCart'

export default InventoryCart