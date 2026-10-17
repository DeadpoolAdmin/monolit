import {
  useLazyGetOrdersQuery,
  useLazyGetReservationsQuery,
} from "@/services/PMS/servicesApi";
import QueryWrapper from "@/shared/components/QueryWrapper";
import Order from "@/shared/HotelServices/types/order.interface";
import React, { useEffect, useCallback, useState, useMemo } from "react";
import { CartItem, ReservationData } from "../types/order.interface";
import OrderCartTop from "./OrderCartTop";
import OrderCartList from "./OrderCartList";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { setRootControl } from "@/slices/RootControlSlice";
import { useDispatch, useSelector } from "react-redux";
import { SelectedTab } from "../types/selectedTab";

const OrderCart = React.memo(() => {
  const [getOrders] =
    useLazyGetOrdersQuery();

  const [
    getReservations,
  ] = useLazyGetReservationsQuery();

  const [orders, setOrders] = useState<Order[]>([]);

  const [orderLoading, setOrderLoading] = useState<boolean>(true);


  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [reservationLoading, setReservationLoading] = useState<boolean>(true);

  const dispatch = useDispatch();

  const selectedTab = useSelector((state: any) => state.orderTab.selectedTab);

  // Determine type based on selected tab, not API completion
  const type = useMemo(() => {
    return selectedTab === SelectedTab.INVENTORIES ? 'order' : 'reservation';
  }, [selectedTab]);

  const onGetOrders = useCallback(async () => {
    setOrderLoading(true);
    try {
      const response = await getOrders({}).unwrap();

      if (response) {
        setOrders(response);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setOrderLoading(false);
    }
  }, [getOrders]);

  const onGetReservations = useCallback(async () => {
    setReservationLoading(true);
    try {
      const response = await getReservations({}).unwrap();

      if (response) {
        setReservations(response);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setReservationLoading(false);
    }
  }, [getReservations]);

  // Initial data fetch on component mount
  useEffect(() => {
    onGetOrders();
    onGetReservations();
  }, [onGetOrders, onGetReservations]);


  useEffect(() => {
    dispatch(setRootControl(ROOT_CONTROL.ORDER_CART_LIST));
  }, [dispatch]);

  return (
    <QueryWrapper
      isLoading={orderLoading && reservationLoading}
    >

{
  type === 'order' ? (
    <div className="order__cart">
      <OrderCartTop />
      <OrderCartList
        type={type}
        orderData={orders as unknown as CartItem[]}
        reservationsData={reservations as unknown as ReservationData[]}
        orderLoading={orderLoading}
        reservationLoading={reservationLoading}
      />
    </div>
  ) : (
    <div className="order__cart">
      <OrderCartTop />
      <OrderCartList
        type={type}
        orderData={orders as unknown as CartItem[]}
        reservationsData={reservations as unknown as ReservationData[]}
        orderLoading={orderLoading}
        reservationLoading={reservationLoading}
      />
    </div>
  )
}

    </QueryWrapper>
  );
});

OrderCart.displayName = "OrderCart";

export default OrderCart;
