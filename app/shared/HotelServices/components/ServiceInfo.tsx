import React, { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { usePolyfillSearchParams } from "@hotel-smarters/polyfill-search-params";
import {
  useAddOrdersMutation,
  useAddReservationsMutation,
} from "@/services/PMS/servicesApi";
import { addItem } from "@/slices/HotelServices/BasketSlice";
import { setRootControl } from "@/slices/RootControlSlice";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import TimePopup from "@/shared/components/TimePopup/Timepopup";
import ServiceInfoImage from "./ServiceInfoImage";
import ServiceInfoContent, { PURCHASE_TYPE } from "./ServiceInfoContent";

interface service {
  categoryId: number;
  description: string;
  forSale: boolean;
  id: number;
  image: string;
  name: string;
  unitPrice: number;
  price: number;
}
type PService = {
  service: service;
  isService: boolean;
  purchaseType: string;
  isProduct: boolean;
};

const ServiceInfo: React.FC<PService> = React.memo(
  ({ service, isService, isProduct, purchaseType }) => {
    const dispatch = useDispatch();

    const [timePopup, setTimePopup] = React.useState<boolean>(false);

    const searchParams = usePolyfillSearchParams();
    const type = useMemo(() => searchParams.get("type"), [searchParams]);

    const isRoomService = useMemo(() => type === "services", [type]);

    const [addOrder, { isLoading: isAddingOrder }] = useAddOrdersMutation();

    const [addReservation, { isLoading: isAddingReservation }] =
      useAddReservationsMutation();

    const onAddReservation = useCallback(
      async (service: { departmentUnitId: number; serviceId: number }) => {
        try {
          await addReservation(service);

          window.dispatchEvent(new CustomEvent("toastRequest"));
        } catch (err) {
          console.error("Error adding reservation:", err);
        }
      },
      [addReservation]
    );

    const servicePrice = useMemo(
      () => (isProduct ? service.unitPrice : service.price),
      [isProduct, service.unitPrice, service.price]
    );

    const onAddOrder = useCallback(
      async (service: {
        departmentUnitId: number;
        items: {
          inventoryId: number;
          quantity: number;
        }[];
      }) => {
        try {
          const response = await addOrder(service);
          if (response) {
            window.dispatchEvent(new CustomEvent("toastProduct"));
            return true;
          }
          return false;
        } catch (err) {
          console.error("Error adding order:", err);
        }
      },
      [addOrder]
    );

    const addBasket = useCallback(
      (service: any) => {
        if (isProduct && !isRoomService) {
          dispatch(addItem(service));
          return;
        }

        if (isService) {
          if (purchaseType === PURCHASE_TYPE.RESERVABLE) {
            setTimePopup(true);
            dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES_POPUP));

            return;
          }
          onAddReservation({
            departmentUnitId: service?.departmentUnitId,
            serviceId: service?.id,
          });
          // onAddOrder({})

          return;
        }

        if (isRoomService) {
          onAddOrder({
            departmentUnitId: service.category.departmentUnitId,
            items: [
              {
                inventoryId: service.id,
                quantity: 1,
              },
            ],
          });
        }
      },
      [isProduct, isService, dispatch, isRoomService, onAddOrder]
    );

    return (
      <>
        <div className="detail__service_info">
          {timePopup && (
            <TimePopup timePopup={timePopup} setTimePopup={setTimePopup} />
          )}
          <ServiceInfoImage image={service.image} />
          <ServiceInfoContent
            purchaseType={purchaseType}
            isLoading={isAddingOrder || isAddingReservation}
            isService={isService}
            isProduct={isProduct}
            onOk={() => addBasket(service)}
            description={service.description}
            name={service.name}
            price={servicePrice}
            isAddingReservation={isAddingReservation}
          />
        </div>
      </>
    );
  }
);

ServiceInfo.displayName = "ServiceInfo";

export default ServiceInfo;
