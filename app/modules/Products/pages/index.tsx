import { useLazyGetWarehousesQuery } from '@/services/PMS/servicesApi';
import QueryWrapper from '@/shared/components/QueryWrapper';
import Warehouses from '@/shared/HotelServices/components/Warehouses';
import IWarehouse from '@/shared/HotelServices/types/warehouse.interface';
import { WarehouseTypes } from '@/shared/HotelServices/types/warehouse.types';
import { usePolyfillSearchParams } from '@hotel-smarters/polyfill-search-params';
import React, { useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';


const Products = React.memo(() => {
    const location = useLocation();
    const navigate = useNavigate();

    const searchParams = usePolyfillSearchParams();
    const type = useMemo(() => searchParams.get('type'), [location.search]);

    const productFlags = useMemo(() => ({
        isRoomDining: type === 'inroomdining',
        isShop: type === 'shop',
        isService: type === 'services',
        isSpaAndWellness: type === 'spaandwellness',
        isTransports: type === 'transfers',
    }), [type]);
    

    const { isRoomDining, isShop, isService, isSpaAndWellness, isTransports } = productFlags;

    const types = useMemo(() => {
        let warehouseTypes: string[] = [];
        switch (true) {
            case isRoomDining:
                warehouseTypes = [WarehouseTypes.BARS, WarehouseTypes.RESTURANTS]
                localStorage.setItem('type', JSON.stringify(warehouseTypes));
                break;
            case isShop && type === 'shop':
                warehouseTypes = [WarehouseTypes.SHOPS];
                localStorage.setItem('type', JSON.stringify(warehouseTypes));
                break;

            case isService:
                warehouseTypes = [WarehouseTypes.ROOM_SERVICE];
                localStorage.setItem('type', JSON.stringify(warehouseTypes));
                break;

            case isSpaAndWellness:
                warehouseTypes = [WarehouseTypes.SPA];
                localStorage.setItem('type', JSON.stringify(warehouseTypes));
                break;
            case isTransports:
                warehouseTypes = [WarehouseTypes.TRANSPORT];
                localStorage.setItem('type', JSON.stringify(warehouseTypes));
                break;
        }
        return warehouseTypes;
    }, [isRoomDining, isShop, type]);


    const [getWarehouses, { data: warehousesData, isLoading: warehousesLoading, isError: warehouseError }] = useLazyGetWarehousesQuery();

    const [warehouses, setWarehouses] = React.useState<IWarehouse[] | null>(null);
    const [initialLoading, setInitialLoading] = React.useState<boolean>(true);

    useEffect(() => {
        if (types.length > 0) {
            getWarehouses({ types });
        }
    }, [types, getWarehouses]);

    useEffect(() => {
        if (!warehousesLoading && (warehousesData !== undefined)) {
            setInitialLoading(false);
        }
    }, [warehousesLoading, warehousesData]);

    useEffect(() => {
        if (warehousesData && warehousesData.length) {
            const activeWarehouses = warehousesData.filter((item: IWarehouse) => item.isActive);

            setWarehouses(activeWarehouses);

            if (activeWarehouses.length == 1) {
                localStorage.setItem('departmentId', activeWarehouses[0]?.departmentId?.toString() || '');

                localStorage.setItem('isManyWarehouses', 'false');

                localStorage.setItem('departmentUnitId', activeWarehouses[0]?.id?.toString() || '');

                navigate(`categories?type=${type}`)
            }
            else {
                localStorage.setItem('isManyWarehouses', 'true');
            }
        }
    }, [warehousesData, warehousesLoading, navigate, type]);

    return (
        <QueryWrapper isLoading={warehousesLoading} error={warehouseError} isEmpty={warehousesData && warehousesData.length === 0}>
            <Warehouses warehouseError={warehouseError} warehouseLoading={warehousesLoading} warehouses={warehouses as IWarehouse[]} />
        </QueryWrapper>
    )
})

Products.displayName = 'Products'

export default Products
