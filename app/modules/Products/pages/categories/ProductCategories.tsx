import IInventory from "@/modules/Products/types/inventory.interface";
import {
  useLazyGetHotelServicesQuery,
  useLazyGetInventoryCategoriesQuery,
} from "@/services/PMS/servicesApi";
import Loading from "@/shared/components/Loading/Loader";
import { usePolyfillSearchParams } from "@hotel-smarters/polyfill-search-params";
import React, { useCallback, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import ServicesList from "@/shared/HotelServices/components/ServicesList";
import Empty from "@/shared/components/Empty";

const ProductCategories = React.memo(() => {
  const location = useLocation();

  const [services, setServices] = React.useState<IInventory[] | []>([]);

  const searchParams = usePolyfillSearchParams();
  const type = useMemo(() => searchParams.get("type"), [location.search]);

  const serviceFlags = useMemo(
    () => ({
      isRoomDining: type === "inroomdining",
      isSpaAndWellness: type === "spaandwellness",
      isRoomServices: type === "services",
      isShop: type === "shop",
      isTransports: type === "transfers",
    }),
    [type]
  );

  const {
    isRoomDining,
    isSpaAndWellness,
    isRoomServices,
    isShop,
    isTransports,
  } = serviceFlags;

  //   const Empty = React.lazy(() => import('empty/Empty'))

  const departmentUnitId = useMemo(
    () => localStorage.getItem("departmentUnitId") as string,
    []
  );

  const [getInventoryCategories] = useLazyGetInventoryCategoriesQuery();

  const [getHotelServices] = useLazyGetHotelServicesQuery();

  const [loading, setLoading] = React.useState<boolean>(true);

  const onGetInventoryCategories = useCallback(async () => {
    try {
      setLoading(true);
      const deptId = parseInt(departmentUnitId);

      const response = await getInventoryCategories(undefined).unwrap();

      if (isRoomDining || isShop || isRoomServices) {
        if (response && response.length) {
          setServices(
            response.filter(
              (inventory: { departmentUnitId: number }) =>
                inventory.departmentUnitId === deptId
            )
          );
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [
    getInventoryCategories,
    isRoomDining,
    isShop,
    isRoomServices,
    departmentUnitId,
  ]);

  const onGetHotelServices = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getHotelServices(undefined).unwrap();

      const deptId = parseInt(departmentUnitId);

      if (isSpaAndWellness || isTransports) {
        if (response && response.length) {
          setServices(
            response.filter(
              (service: { departmentUnitId: number }) =>
                service.departmentUnitId === deptId
            )
          );
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [getHotelServices, isSpaAndWellness, departmentUnitId]);


  React.useEffect(() => {
    if (isSpaAndWellness || isTransports) {
      onGetHotelServices();
    } else if (isRoomDining || isShop || isRoomServices) {
      onGetInventoryCategories();
    }
  }, [
    isSpaAndWellness,
    onGetHotelServices,
    isRoomServices,
    isShop,
    isRoomDining,
    onGetInventoryCategories,
    isTransports,
  ]);

  if (loading) {
    return <Loading />;
  }

  if (!services.length) return <Empty />;

  return <ServicesList services={services} />;
});

ProductCategories.displayName = "ProductCategories";

export default ProductCategories;
