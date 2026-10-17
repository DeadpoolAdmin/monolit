import { useGenerateUrl } from '@hotel-smarters/generatefileurl';
import React, { useEffect, useCallback, useMemo, useState } from 'react'

import dinning_error from '@/assets/smarters.png'

import { GridView } from 'smarters-ino-ui-tv';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useResolution } from '@hotel-smarters/resolution-hook';
import { useKeydown } from '@hotel-smarters/use-key-down-control';
import { usePolyfillSearchParams } from '@hotel-smarters/polyfill-search-params';
import IInventory from '@/modules/Products/types/inventory.interface';
import { useText } from '@/shared/hooks/useGetText';
import useAspectRatio from '@/shared/hooks/useAspectRatio';
import { setPrevRootControl, setRootControl } from '@/slices/RootControlSlice';
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL';
import { setOpenWarehouse } from '@/slices/HotelServices/HotelServiceSlice';
import ScrollView from '@/shared/components/ScrollView/ScrollView';
import { FaClock } from 'react-icons/fa';
import { formatTime } from '@/shared/functions/formatTime';

type PServicesList = {
    services: IInventory[],
}

// const ScrollView = React.lazy(() => import('scrollview/ScrollView'));
// const Empty = React.lazy(() => import('empty/Empty'))

const ServicesList: React.FC<PServicesList> = React.memo(({ services }) => {

    const language = useMemo(() => localStorage.getItem('lang') as string, []);

    const { getText } = useText();
    const { getDeviceType } = useResolution();
    const deviceType = useMemo(() => getDeviceType(), [getDeviceType]);

    const dispatch = useDispatch();
    const openWarehouse = useSelector((state: any) => state.serviceControl?.openWarehouse)

    
    const { getDimensions } = useAspectRatio(56.1);
    const { getUrl } = useGenerateUrl(process.env.REACT_APP_API_HOST as string);

    const location = useLocation();
    const searchParams = usePolyfillSearchParams();
    const type = useMemo(() => searchParams.get('type'), [location.search]);

    const navigate = useNavigate();

    const dimensions = useMemo(() => getDimensions(), [getDimensions]);

    const [activeIndex, setActiveIndex] = useState(0);

    const rootControl = useSelector((state: any) => state.rootControl.rootControl)

    const isManyWarehouses = useMemo(() => localStorage.getItem('isManyWarehouses') === 'true', []);

    useEffect(() => {
        dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES))
    }, [dispatch])

    const handleOk = useCallback((item: IInventory) => {
        window.fromPromotion = null
        if (type === 'inroomdining' || type === 'shop' || type === 'services') {
            dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES_INVENTORIES))
            navigate(`${item.id}?type=${type}`);        }
        else if (type === 'spaandwellness' || type === 'transfers') {
            dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES_CART_ADD))
            localStorage.setItem('serviceId', item.id.toString());
            navigate(`${item.id}?type=${type}`);
        }
    }, [type, dispatch, navigate]);

    const onUp = useCallback(() => {
        dispatch(setPrevRootControl(rootControl));
        dispatch(setRootControl(ROOT_CONTROL.HEADER_BACK))
    }, [dispatch, rootControl]);

    useEffect(() => {
        dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES))
    }, [dispatch]);


    useEffect(() => {
        dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES))

        const handleBack = () => {
            if (!openWarehouse) {
                dispatch(setOpenWarehouse(true));
            }
        };

        window.addEventListener('backOnServices', handleBack);

        return () => {
            window.removeEventListener('backOnServices', handleBack);
        }
    }, [openWarehouse])


    const controls = useMemo(() => ({
        isActive: rootControl === ROOT_CONTROL.HOTEL_SERVICES,
        id: 'service-controls',
        back: () => {
            if (activeIndex > 0) {
                setActiveIndex(0);
                return
            }
            // For single warehouse, always navigate to main menu instead of warehouses page
            if (!isManyWarehouses) {
                navigate('/menu');
                return
            }

            navigate(-1);
        }
    }), [rootControl, isManyWarehouses, navigate, location.pathname, activeIndex]);

    useKeydown(controls);

    return (
        services && services.length > 0 ?

            <div className='services__list' style={{
                height: deviceType === 'TV' ? 'var(--screen-height)' : '95%',
                overflowY: deviceType === 'TV' ? 'hidden' : 'auto',
                scrollbarWidth: 'none',
            }}>
                {
                    deviceType === 'TV' ?

                        <GridView
                            id='services'
                            data={services}
                            isActive={rootControl === ROOT_CONTROL.HOTEL_SERVICES}
                            gap={2}
                            onUp={onUp}
                            initialActiveIndex={0}
                            nativeControle={true}
                            bufferStart={5}
                            rowItemsCount={3}
                            onOk={handleOk}
                            itemWidth={57.5}
                            itemHeight={26.3}
                            scrollOffset={25.3}
                            onIndexChange={(index) => setActiveIndex(index)}
                            activeIndex={activeIndex}
                            renderItem={({ item, style, isActive, key }) => (
                                <div onClick={() => handleOk(item)} key={key} className={`services__item ${isActive ? 'active' : ''}`} style={style}>

                                    <div className="background" style={{
                                        background: isActive ? 'black' : 'transparent',
                                        width: '100%',
                                        height: '100%',
                                        transition: 'background .2s ease',
                                        opacity: 0.4,
                                        borderRadius: '2rem',
                                    }}></div>

                                    <img className='item__image' onError={
                                        (e: any) => e.target.src = dinning_error
                                    } src={getUrl(item.image)} alt={getText(item.name, language)} />
                                    <div className='services__item__name'>{getText(item.name, language)}</div>
                                    {
                                        item?.departmentUnit?.availableHours && (
                                            <div className="services__item__working__times">
                                                <FaClock />
                                                {item.departmentUnit.availableHours.map((hour: { id?: string | number; open: string; close: string }) => (
                                                    <div className="services__item__working__times__item" key={hour.id || hour.open + hour.close}>{formatTime(hour.open)} - {formatTime(hour.close)}</div>
                                                ))}
                                            </div>
                                        )
                                    }
                                </div>
                            )}
                        />

                        :
                        <ScrollView
                            style={{
                                position: 'relative',
                                left: '-1rem'
                            }}
                            data={services}
                            width={192}
                            // height={88}
                            dimension={'vh'}
                            listType={'grid'}
                            type={'gird-movies'}
                            renderItem={({ item, style, isActive, key }) => (
                                <div onClick={() => handleOk(item)} key={key} className={`services__item ${isActive ? 'active' : ''}`} style={{
                                    ...style,
                                    width: 57.5 + 'rem',
                                    height: dimensions.height + 'rem',
                                    margin: '1rem 1rem'
                                }}>
                                    <img className='item__image' onError={
                                        (e: any) => e.target.src = dinning_error
                                    } src={getUrl(item.image)} alt={getText(item.name, language)} />
                                    <div className='services__item__name'>{getText(item.name, language)}</div>
                                    {
                                        item.departmentUnit.availableHours && (
                                            <div className="services__item__working__times">
                                                <FaClock />
                                                {item.departmentUnit.availableHours.map((hour: { id?: string | number; open: string; close: string }) => (
                                                    <div className="services__item__working__times__item" key={hour.id || hour.open + hour.close}>{formatTime(hour.open)} - {formatTime(hour.close)}</div>
                                                ))}
                                            </div>
                                        )
                                    }
                                </div>
                            )}
                        />
                }

            </div>
            
            :
            <></>


    )
})

ServicesList.displayName = 'ServicesList'

export default ServicesList