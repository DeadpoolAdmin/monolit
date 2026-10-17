import React, { useEffect, useCallback, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { GridView } from 'smarters-ino-ui-tv';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useResolution } from '@hotel-smarters/resolution-hook';

import { useKeydown } from '@hotel-smarters/use-key-down-control';
import { usePolyfillSearchParams } from '@hotel-smarters/polyfill-search-params';
import { useLazyGetInventoryQuery } from '@/services/PMS/servicesApi';
import IInventory from '../types/inventory.interface';
import { setPrevRootControl, setRootControl } from '@/slices/RootControlSlice';
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL';
import QueryWrapper from '@/shared/components/QueryWrapper';
import InventoryItem from './InventoryItem';
import InventoryCart from './InventoryCart';
import ScrollView from '@/shared/components/ScrollView/ScrollView';

// const ScrollView = React.lazy(() => import('scrollview/ScrollView'))

const Inventories = React.memo(() => {
    const location = useLocation();
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchParams = usePolyfillSearchParams();

    const serviceTypes = useMemo(() => {
        const type = searchParams.get('type');
        return {
            isRoomDining: type === 'inroomdining',
            isShop: type === 'shop',
            isSpaAndWellness: type === 'spaandwellness',
            isService: type === 'services'
        };
    }, [searchParams, location.search]);

    const { isRoomDining, isShop, isSpaAndWellness, isService } = serviceTypes;

    const departmentUnitId = useMemo(() => localStorage.getItem('departmentUnitId') as string, []);

    const [getInventory, { data, isLoading, isError, error }] = useLazyGetInventoryQuery();

    const [inventory, setInventory] = React.useState<IInventory[] | null>(null);
    const [initialLoading, setInitialLoading] = React.useState<boolean>(true);

    const basket = useSelector((state: any) => state.basket?.items)

    const rootControl = useSelector((state: any) => state.rootControl.rootControl)

    const { getDeviceType } = useResolution();
    const deviceType = useMemo(() => getDeviceType(), [getDeviceType]);

    const [activeIndex, setActiveIndex] = useState(0);


    const type = useMemo(() => searchParams.get('type'), [searchParams])

    React.useEffect(() => {
        dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES_INVENTORIES))

        if (data) {
            setInventory(data.inventories)
        }
    }, [data, dispatch])

    React.useEffect(() => {
        if ((isRoomDining || isShop || isService) && id) {
            getInventory(parseInt(id as string));
        }
    }, [isRoomDining, isShop, id, getInventory, isService])

    React.useEffect(() => {
        if (!isLoading && (data !== undefined)) {
            setInitialLoading(false);
        }
    }, [isLoading, data]);

    const handleHeaderDownControl = useCallback((e: Event) => {
        const { detail } = e as CustomEvent;
        if (detail.control === 'services') {
            dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES_INVENTORIES))
        }
    }, [dispatch]);

    React.useEffect(() => {
        window.addEventListener('headerdowncontrol', handleHeaderDownControl);

        return () => {
            window.removeEventListener('headerdowncontrol', handleHeaderDownControl);
        }
    }, [handleHeaderDownControl])

    const navigateDetail = useCallback((item: any) => {
        if (type === 'services') {
            navigate(`detail?type=${type}`);
        } else {
            navigate(`detail`);
        }

        localStorage.setItem('serviceId', item.id.toString());
        window.fromPromotion = null
    }, [navigate, type]);

    const onRight = useCallback(() => {
        if (basket.length) {
            dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES_CART_ITEM));
        }
    }, [basket.length, dispatch]);

    const onUp = useCallback(() => {
        dispatch(setPrevRootControl(rootControl));
        dispatch(setRootControl(ROOT_CONTROL.HEADER_BACK));
    }, [dispatch, rootControl]);



    useEffect(() => {
        dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES_INVENTORIES))
    }, [])

    const controls = useMemo(() => ({
        isActive: rootControl === ROOT_CONTROL.HOTEL_SERVICES_INVENTORIES,
        id: 'service-controls',
        back: () => {
            if (activeIndex > 0) {
                setActiveIndex(0);
                return
            }

            if(window.fromPromotion) {
                navigate('/menu')
                return
            }

            navigate(-1);
        }
    }), [activeIndex, rootControl, navigate]);

    useKeydown(controls);

    return (
        <QueryWrapper
            isLoading={isLoading || initialLoading}
            isError={isError}
            isEmpty={(isLoading || initialLoading) && (!inventory || inventory.length === 0)}
            error={error}
        >
            <div className='inventories'>

                    <div className="inventories__list" style={{
                        height: deviceType === 'TV' ? 'var(--screen-height)' : '85%',
                        overflowY: deviceType === 'TV' ? 'hidden' : 'auto',
                        scrollbarWidth: 'none',
                    }}>
                        {
                            deviceType === 'TV' ? <GridView
                                id='inventories'
                                data={inventory?.filter((inventory) => inventory.isPublished) || []}
                                isActive={rootControl === ROOT_CONTROL.HOTEL_SERVICES_INVENTORIES}
                                nativeControle={true}
                                gap={3}
                                bufferStart={3}
                                initialActiveIndex={0}
                                activeIndex={activeIndex}
                                onIndexChange={(index) => setActiveIndex(index)}
                                scrollOffset={47}
                                onOk={(item) => navigateDetail(item)}
                                onUp={onUp}
                                itemWidth={37}
                                itemHeight={46.2}
                                rowItemsCount={3}
                                onRight={onRight}
                                renderItem={({ item, style, isActive, key }) => (
                                    <InventoryItem isActive={isActive} key={key} style={style} item={item} />
                                )}
                            />

                            :
                        
                            <ScrollView
                                data={inventory!}
                                width={120}
                                dimension={'vh'}
                                listType={'grid'}
                                type={'gird-movies'}
                                renderItem={({ item, style, isActive, key }) => (
                                    <InventoryItem isActive={isActive} key={key} style={{
                                        ...style,
                                        width: '37rem',
                                        height: '46.2rem',
                                        margin: '0 1rem',
                                        marginBottom: '2rem',
                                    }} item={item as IInventory} />
                                )}
                            />
                        }
                    </div>

                    {
                        (isRoomDining || isShop) &&
                        <InventoryCart departmentUnitId={departmentUnitId} isProduct={isRoomDining || isShop} isService={isSpaAndWellness} />
                    }

                </div>
        </QueryWrapper>
    )
})




Inventories.displayName = 'Inventories'

export default Inventories