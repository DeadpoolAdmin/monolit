import React, { useCallback, useEffect, useMemo, useState } from "react";
import basket from "@/assets/basket.png";
import { Button } from '@/shared/components/Button/Button';
import { INotification } from "../types/Notification.type";
import OrderTable from "./OrderTable";
import { useLazyGetOrderByIdQuery } from "@/services/PMS/servicesApi";
import { useDispatch } from "react-redux";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { setRootControl } from "@/slices/RootControlSlice";
import { useOrderPagination } from "../hooks/useOrderPagination";
import { useResolution } from "@hotel-smarters/resolution-hook";
import { useSelector } from "react-redux";
import { useAddOrders } from "@/shared/hooks/mutations/useAddOrders";
import ButtonLoader from "@/shared/components/ButtonLoader/ButtonLoader";
import { SkeletonTable } from "@shared/components/Skeleton";
import { CartItem } from "@modules/MyOrders/types/order.interface";
import { useTranslate } from "@/shared/hooks/languages/useI18";

const OrderPopupContent = ({
  data,
  onClose,
}: {
  data: INotification;
  onClose?: () => void;
}) => {
  const [getOrderById, { isLoading: isOrderLoading, data: orderData }] =
    useLazyGetOrderByIdQuery();

  const dispatch = useDispatch();
  const { getDeviceType } = useResolution();
  const deviceType = getDeviceType();

  const rootControl = useSelector(
    (state: any) => state.rootControl.rootControl
  );

  const deviceInfoData = useMemo(
    () => JSON.parse(localStorage.getItem("deviceInfo")! || "{}"),
    []
  );

  const currency = deviceInfoData.organization?.currency?.symbol
    ? deviceInfoData.organization?.currency.symbol
    : "$";

  // Track removed items
  const [removedItemIds, setRemovedItemIds] = useState<number[]>([]);

  const { orderAddLoading, addOrder, isSuccess } = useAddOrders();

  // Filter out removed items
  const filteredItems = useMemo(() => {
    return (orderData?.items || []).filter(
      (item: CartItem) => !removedItemIds.includes(Number(item.id))
    );
  }, [orderData?.items, removedItemIds]);

  // Handle item removal
  const handleRemoveItem = useCallback((itemId: number) => {
    setRemovedItemIds((prev) => [...prev, itemId]);
  }, []);

  const onGetOrderById = useCallback(async () => {
    try {
      await getOrderById(data.orderId?.toString() || "").unwrap();
    } catch (error) {
      console.log(error);
    }
  }, [getOrderById, data]);

  // Pagination for order items
  const {
    paginatedItems,
    currentPage,
    totalPages,
    handleNextPage,
    handlePrevPage,
  } = useOrderPagination({
    items: filteredItems,
    itemsPerPage: deviceType === "TV" ? 3 : 1000,
  });
  
  const { t } = useTranslate();

  useEffect(() => {
    if (isSuccess) {
      window.dispatchEvent(new CustomEvent("toastProduct"));
      onClose?.();
    }
  }, [isSuccess]);

  // Close popup when all items are removed
  useEffect(() => {
    if (
      data.rejectedItemsIds.length > 0 &&
      orderData?.items &&
      filteredItems.length === 0
    ) {
      onClose?.();
    }
  }, [filteredItems.length, data.rejectedItemsIds.length, orderData?.items, onClose]);

  const onUp = useCallback(() => {
    if (data.rejectedItemsIds.length) {
      dispatch(setRootControl(ROOT_CONTROL.NOTIFICATIONS_ORDER_TABLE));
    }
  }, [data.rejectedItemsIds.length, dispatch]);

  const onRight = useCallback(() => {
    if (!filteredItems.find((item: CartItem) => item.status === "rejected")) {
      dispatch(
        setRootControl(ROOT_CONTROL.NOTIFICATIONS_ORDER_TABLE_ORDER_AGAIN)
      );
    }
  }, [dispatch, filteredItems]);

  const onOrderAgain = useCallback(() => {
    try {
      if (filteredItems.find((item: CartItem) => item.status === "rejected")) {
        return;
      }

      const items = filteredItems.map((item: CartItem) => ({
        inventoryId: item.inventory?.id,
        quantity: item.quantity,
      }));

      const orderPayload = {
        departmentUnitId: orderData?.departmentUnitId || 0,
        items,
      };

      addOrder(orderPayload);
    } catch (error) {
      console.error("Error adding order again:", error);
    }
  }, [filteredItems, orderData, addOrder, onClose, dispatch]);

  useEffect(() => {
    if (!data.rejectedItemsIds.length) return;
    onGetOrderById();

    dispatch(setRootControl(ROOT_CONTROL.NOTIFICATIONS_ORDER_TABLE));
  }, [data, onGetOrderById, dispatch]);

  return (
    <>
      <div className="reject__popup__content__title">
        <span>
          {!data.rejectedItemsIds.length
            ? "Order Rejected"
            : "Some items couldn't be ordered"}
        </span>
      </div>
      <div className="reject__popup__content__description">
        <span>{data.reason || data.message}</span>
      </div>

      {data.rejectedItemsIds.length ? (
        isOrderLoading ? (
          <div
            className="order-table order-table-skeleton"
            style={{
              height: deviceType === "TV" ? "60rem" : "100%",
              overflow: deviceType === "TABLET" ? "auto" : "hidden",
            }}
          >
            <SkeletonTable
              rows={deviceType === "TV" ? 3 : 5}
              columns={[
                { width: "10rem", height: "10rem" }, // Image
                { width: "100%", height: "2.5rem" }, // Item
                { width: "8rem", height: "2.5rem" }, // Quantity
                { width: "8rem", height: "2.5rem" }, // Price
                { width: "8rem", height: "2.5rem" }, // Status
                { width: "12rem", height: "5rem" }, // Action
              ]}
              showHeader={true}
              headers={["", "Item", "Quantity", "Price", "Status", "Action"]}
            />
          </div>
        ) : orderData ? (
          <OrderTable
            items={paginatedItems}
            rejectedItemsIds={data.rejectedItemsIds}
            currency={currency}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
            currentPage={currentPage}
            totalPages={totalPages}
            onClose={onClose}
            onRemoveItem={handleRemoveItem}
          />
        ) : (
          <></>
        )
      ) : (
        <div className="reject__popup__content__reason">
          <div className="reason__block">
            <div className="basket__image">
              <img src={basket} />
            </div>
            <div className="reason__text">
              <span>Order ID: {data.orderId}</span>
            </div>
          </div>
        </div>
      )}

      <div className="reject__popup__content__reason__button">
        <Button
          minWidth="25"
          maxWidth="33"
          up={onUp}
          ok={onClose}
          right={onRight}
          isActive={
            rootControl === ROOT_CONTROL.NOTIFICATIONS_ORDER_TABLE_ORDER_CLOSE
          }
          className={
            "reason__button" +
            (rootControl === ROOT_CONTROL.NOTIFICATIONS_ORDER_TABLE_ORDER_CLOSE
              ? " active"
              : "")
          }
        >
          <span className="button-text">{t('close')}</span>
        </Button>

        {data.rejectedItemsIds.length ? (
          <Button
            minWidth="25"
            maxWidth="33"
            left={() =>
              dispatch(
                setRootControl(
                  ROOT_CONTROL.NOTIFICATIONS_ORDER_TABLE_ORDER_CLOSE
                )
              )
            }
            up={onUp}
            ok={onOrderAgain}
            isActive={
              rootControl === ROOT_CONTROL.NOTIFICATIONS_ORDER_TABLE_ORDER_AGAIN
            }
            style={{
                opacity: filteredItems.find(
                  (item: CartItem) => item.status === "rejected"
                )
                  ? 0.6
                  : 1,
            }}
            className={
              "primary" +
              (rootControl ===
              ROOT_CONTROL.NOTIFICATIONS_ORDER_TABLE_ORDER_AGAIN
                ? " active"
                : "")
            }
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%"
              }}
            >
              {orderAddLoading ? <ButtonLoader /> : <span className="button-text">{t('orderAgain')}</span>}
            </div>
          </Button>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default OrderPopupContent;
