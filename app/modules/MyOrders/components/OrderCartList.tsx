
import { useResolution } from '@hotel-smarters/resolution-hook';
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { ListView } from 'smarters-ino-ui-tv'
import 'smarters-ino-ui-tv/dist/main.css'

import { useKeydown } from '@hotel-smarters/use-key-down-control';
import { useNavigate } from 'react-router-dom';
import { usePolyfillSearchParams } from '@hotel-smarters/polyfill-search-params';
import { CartItem, OrderCartListProps, ReservationData } from '../types/order.interface';
import { setRootControl } from '@/slices/RootControlSlice';
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL';
import { SelectedTab } from '../types/selectedTab';
import NoOrder from './NoOrder';
import OrderCartListItem from './OrderCartListItem';
import ScrollView from '@/shared/components/ScrollView/ScrollView';

// Using new TypeScript interfaces defined in @/types/interfaces

const OrderCartList = React.memo(({ orderData, reservationsData, orderLoading, reservationLoading, type }: OrderCartListProps) => {

    const { getDeviceType } = useResolution();

    const searchParams = usePolyfillSearchParams();

    const deviceType = useMemo(() => getDeviceType(), [getDeviceType]);

    const dispatch = useDispatch();

    const rootControl = useSelector((state: any) => state.rootControl.rootControl)

    const onUp = useCallback(() => {
        dispatch(setRootControl(ROOT_CONTROL.ORDER_TABS))
    }, [dispatch])

    const selectedTab = useSelector((state: any) => state.orderTab.selectedTab)

    const [items, setItems] = useState<CartItem[]>([]);

    const [reservations, setReservations] = useState<CartItem[]>([]);

    const [activeIndex, setActiveIndex] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setRootControl(ROOT_CONTROL.ORDER_CART))
    }, [dispatch]);

    useEffect(() => {
        if (selectedTab === SelectedTab.INVENTORIES) {
            if (orderData && orderData.length) {
                setItems(orderData);
            }
            else {
                setItems([]);
            }
        }
        else {
            if (reservationsData && reservationsData) {
                const newData = reservationsData.map((reservation: ReservationData) => {
                    return {
                        image: reservation.service.image,
                        name: reservation.service.name,
                        price: reservation.service.price,
                        status: reservation.status,
                        reservationFrom: reservation.reservedFrom,
                        date: reservation.date,
                        id: reservation.id,
                        type: 'reservation'
                    }
                });

                setReservations(newData);
            }
            else {
                setReservations([]);
            }
        }

    }, [orderData, selectedTab, reservationsData]);

    const controls = {
        isActive: rootControl === ROOT_CONTROL.ORDER_CART,
        id: 'cart-controls',
        back: () => {
            if (activeIndex > 0) {
                setActiveIndex(0)
            }
            else {
                navigate('/menu')
            }
        }
    }

    useKeydown(controls);


    const onOk = (item: CartItem) => {
        localStorage.setItem('order', JSON.stringify(item))

        // If there are search params, append them to the URL
        const search = searchParams.toString();
        navigate(`${item.id}?type=${type}${search ? `&${search}` : ''}`);
    }


    return (

        <div className='order__cart_list' style={{
            overflow: deviceType === 'TV' ? 'hidden' : 'auto',
            scrollbarWidth: 'none',
        }}>
            {
                selectedTab === SelectedTab.INVENTORIES && !orderLoading && items.length === 0 ? <NoOrder /> : selectedTab === SelectedTab.RESERVATIONS && !reservationLoading && reservations.length === 0 ? <NoOrder /> :
                    deviceType === 'TV' ?
                        <ListView
                            data={selectedTab === SelectedTab.INVENTORIES ? items : reservations}
                            id="cart"
                            uniqueKey="cart"
                            listType='vertical'
                            nativeControle={true}
                            itemsCount={6}
                            itemsTotal={selectedTab === SelectedTab.INVENTORIES ? items.length : reservations.length}
                            buffer={5}
                            itemWidth={142}
                            itemHeight={30}
                            gap={5.5}
                            isActive={rootControl === ROOT_CONTROL.ORDER_CART}
                            initialActiveIndex={0}
                            onBackScrollIndex={null}
                            startScrollIndex={0}
                            direction="ltr"
                            rowGap={5.5}
                            onOk={onOk}
                            activeIndex={activeIndex}
                            onIndexChange={(index) => {
                                setActiveIndex(index)
                            }}
                            onUp={onUp}
                            onLeft={() => { }}
                            onRight={() => { }}
                            renderItem={({ item, style, isActive, key }) => (
                                <OrderCartListItem onClick={() => onOk(item)} item={item} style={style} isActive={isActive} key={key} />
                            )}

                        />


                        :

                        <ScrollView
                            data={selectedTab === SelectedTab.INVENTORIES ? items : reservations}
                            width={142}
                            dimension={'vh'}
                            listType={'grid'}
                            type={'gird-movies'}
                            renderItem={({ item, style, isActive, key }) => (
                                <OrderCartListItem onClick={() => onOk(item)} item={item} style={{ ...style, width: '142rem', height: '30rem', margin: '4rem 0 !important' }} isActive={isActive} key={key} />
                            )}
                        />
            }



        </div>
    )
})

OrderCartList.displayName = 'OrderCartList'

export default OrderCartList