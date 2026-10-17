import React, { useEffect, useCallback, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { useKeydown } from '@hotel-smarters/use-key-down-control'
import { usePolyfillSearchParams } from '@hotel-smarters/polyfill-search-params'
import { useLazyGetHotelServiceQuery, useLazyGetInventoryItemQuery } from '@/services/PMS/servicesApi'
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL'
import { setRootControl } from '@/slices/RootControlSlice'
import QueryWrapper from '@/shared/components/QueryWrapper'
import InventoryCart from '../../components/InventoryCart'
import ServiceInfo from '@/shared/HotelServices/components/ServiceInfo'

// Global type declarations for window properties
declare global {
    interface Window {
        __isServiceDetailBack?: boolean;
    }
}

const ProductDetail = React.memo(() => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const searchParams = usePolyfillSearchParams();

    const type = useMemo(() => {
        return searchParams.get('type')
    }, [searchParams])

    const pathInfo = useMemo(() => ({
        isProduct: location.pathname.includes('products'),
        isService: location.pathname.includes('services'),
    }), [location.pathname, type]);

    const { isProduct, isService } = pathInfo;

    const [getInventoryItem, { isLoading: inventoryLoading, isFetching: isFetchingInventory }] = useLazyGetInventoryItemQuery();


    const [getHotelService, { isLoading: serviceLoading, isFetching: isFetchingService }] = useLazyGetHotelServiceQuery();

    const isRoomService = useMemo(() => type === 'services', [type]);

    const [service, setService] = React.useState<any>(null);

    const serviceIdRef = useRef<string>(localStorage.getItem('serviceId') as string);

    const rootControl = useSelector((state: any) => state.rootControl.rootControl);

    const onGetInventoryItem = useCallback(async () => {
        try {
            const currentId = parseInt(localStorage.getItem("serviceId") as string);

            const response = await getInventoryItem(currentId).unwrap();
            setService(response);
        }
        catch (error) {
            console.log(error);
        }
    }, [getInventoryItem, setService]);

    const onGetHotelService = useCallback(async () => {
        try {

            const currentId = parseInt(localStorage.getItem("serviceId") as string);

            const response = await getHotelService(currentId).unwrap();

            setService(response);
        }
        catch (error) {
            console.log(error);
        }
    }, [getHotelService, setService]);


    useEffect(() => {
        const interval = setInterval(() => {
            const current = localStorage.getItem("serviceId");
            if (current !== serviceIdRef.current) {
                serviceIdRef.current = current!;
                if (isProduct) {
                    onGetInventoryItem();
                }
                else {
                    onGetHotelService();
                }
            }
        }, 500); // check every 0.5s

        return () => clearInterval(interval);
    }, [isProduct, onGetInventoryItem, onGetHotelService]);

    useEffect(() => {
        if (isProduct) {
            onGetInventoryItem();
        }
        else {
            onGetHotelService();
        }
    }, [isProduct, onGetInventoryItem, onGetHotelService]);

    // Set serviceControl for detail page navigation
    useEffect(() => {
        dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES_CART_ADD))
    }, [dispatch])


    const controls = useMemo(() => ({
        isActive: rootControl === ROOT_CONTROL.HOTEL_SERVICES_POPUP, // Only active when popup is NOT open
        id: 'service-detail-controls',
        back: () => {
            if(window.fromPromotion) {
                navigate('/menu')
                return
            }
            navigate(-1);
        }
    }), [navigate, rootControl]);

    useKeydown(controls);

    const isLoading = inventoryLoading || serviceLoading || isFetchingInventory || isFetchingService;

    return (
        <QueryWrapper
            isLoading={isLoading}
           isEmpty={false}
        >
            <div className='detail'>
                {
                    service && <ServiceInfo purchaseType={service?.type} isService={isService} isProduct={isProduct} service={service!} />

                }
                {
                    isProduct && !isRoomService &&
                    <InventoryCart departmentUnitId={service?.category.departmentUnitId} isService={isService} isProduct={isProduct} />
                }
            </div>
        </QueryWrapper>
    )
})

ProductDetail.displayName = 'ProductDetail'

export default ProductDetail