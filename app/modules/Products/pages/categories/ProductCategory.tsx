import React, { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { usePolyfillSearchParams } from '@hotel-smarters/polyfill-search-params'

import Inventories from '../../components/Inventories';
import ProductDetail from '../detail/ProductDetail';

const Service = React.memo(() => {
    const location = useLocation();
    // const dispatch = useDispatch();

    const searchParams = usePolyfillSearchParams();

    const { isRoomDining, isShop, isRoomServices } = useMemo(() => ({
        isRoomDining: searchParams.get('type') === 'inroomdining',
        isShop: searchParams.get('type') === 'shop',
        isRoomServices: searchParams.get('type') === 'services'
    }), [searchParams, location.search]);

    // const rootControl = useSelector((state : any) => state.rootControl.rootControl)


    const content = useMemo(() => {
        return isRoomDining || isShop || isRoomServices ? <Inventories /> : <ProductDetail />
    }, [isRoomDining, isShop, isRoomServices]);

    return (
        <div className='service__info'>
            {content}
        </div>
    )
})

Service.displayName = 'Service'

export default Service