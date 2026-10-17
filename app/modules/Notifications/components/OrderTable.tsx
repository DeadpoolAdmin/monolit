import React, { memo, useMemo } from "react";
import { useGenerateUrl } from "@hotel-smarters/generatefileurl";
import { useResolution } from "@hotel-smarters/resolution-hook";
import { useSelector } from "react-redux";
import ErrImage from "@assets/smarters.png";
import { useText } from "@/shared/hooks/useGetText";
import { Button } from '@/shared/components/Button/Button';
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { useOrderTableControl } from "../hooks/useOrderTableControl";
import {
  OrderStatusBackground,
  ToastType,
} from "@/shared/types/toast/toast.type";
import { MdOutlinePending } from "react-icons/md";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import { useTranslate } from "@/shared/hooks/languages/useI18";

interface OrderItem {
  id: number;
  inventory?: {
    id: number;
    name: string;
    image: string;
  };
  quantity: number;
  price: number;
  status?: string;
}

interface OrderTableProps {
  items: OrderItem[];
  rejectedItemsIds: number[];
  isLoading?: boolean;
  currency?: string;
  onNextPage?: () => void;
  onPrevPage?: () => void;
  currentPage?: number;
  totalPages?: number;
  onClose?: () => void;
  onRemoveItem?: (itemId: number) => void;
}

export const OrderTable: React.FC<OrderTableProps> = ({
  items,
  rejectedItemsIds,
  isLoading = false,
  currency = "$",
  onNextPage,
  onPrevPage,
  currentPage = 1,
  totalPages = 1,
  onClose,
  onRemoveItem,
}) => {
  const { getUrl } = useGenerateUrl(process.env.REACT_APP_API_HOST as string);
  const { getDeviceType } = useResolution();
  const deviceType = getDeviceType();

  const { getText } = useText();

  const language = useMemo(() => localStorage.getItem("lang") as string, []);

  const { t } = useTranslate();

  const { index, tableRef, containerRef } = useOrderTableControl({
    items,
    onNextPage,
    onPrevPage,
    itemsPerPage: deviceType === "TV" ? 3 : 1000,
    currentPage,
    totalPages,
    onClose,
    onRemoveItem,
  });

  const rootControl = useSelector(
    (state: any) => state.rootControl.rootControl
  );
  

  const getIconType = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <MdOutlinePending style={{ color: OrderStatusBackground.PENDING }} />
        );
      case "confirmed":
        return (
          <IoCheckmarkCircle
            style={{ color: OrderStatusBackground.CONFIRMED }}
          />
        );
      case "in_progress":
        return (
          <MdOutlinePending
            style={{ color: OrderStatusBackground.IN_PROGRESS }}
          />
        );
      case "rejected":
        return (
          <IoCloseCircle style={{ color: OrderStatusBackground.REJECTED }} />
        );
      case "finished":
        return (
          <IoCheckmarkCircle
            style={{ color: OrderStatusBackground.FINISHED }}
          />
        );
      case "canceled":
        return (
          <IoCloseCircle style={{ color: OrderStatusBackground.CANCELED }} />
        );
      case "paid":
        return (
          <IoCheckmarkCircle style={{ color: OrderStatusBackground.PAID }} />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="order-table-loading">
        <span>Loading order details...</span>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="order-table-empty">
        <span>No items found</span>
      </div>
    );
  }

  return (
    <div className="order-table" ref={containerRef}>
      <table ref={tableRef}>
        <thead>
          <tr>
            <th></th>
            <th>{t('item')}</th>
            <th>{t('quantity')}</th>
            <th>{t('price')}</th>
            <th>{t('status')}</th>
            <th>{t('action')}</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, i) => (
            <tr
              key={item.id}
              className={`${
                rootControl === ROOT_CONTROL.NOTIFICATIONS_ORDER_TABLE &&
                i === index &&
                deviceType === "TV"
                  ? "active"
                  : ""
              }`}
            >
              <td className="image-cell">
                <div className="item-image">
                  <img
                    src={getUrl(item.inventory?.image || "")}
                    alt={item.inventory?.name || "Item"}
                    onError={(e) => {
                      e.currentTarget.src = ErrImage;
                    }}
                  />
                </div>
              </td>
              <td className="name-cell">
                {getText(item.inventory?.name || "Unknown Item", language)}
              </td>
              <td className="quantity-cell">{item.quantity}</td>
              <td className="price-cell">
                {currency}
                {typeof item.price === "number"
                  ? item.price.toFixed(2)
                  : item.price}
              </td>
              <td className={`status-cell`}>
                <div className={`${item.status?.toLowerCase()}`}>
                  <span className="status-icon">
                    {getIconType(item.status as string)}
                  </span>
                  
                  <span>
                    {item.status ? item.status.charAt(0).toUpperCase() +
                      item.status.slice(1).toLowerCase() : "N/A"}
                  </span>
                </div>
              </td>

              <td className="action-cell">
                <Button
                  minWidth="19"
                  maxWidth="19"
                  className={`secondary ${
                    rootControl === ROOT_CONTROL.NOTIFICATIONS_ORDER_TABLE &&
                    i === index
                      ? "active"
                      : ""
                  }`}
                  isActive={
                    rootControl === ROOT_CONTROL.NOTIFICATIONS_ORDER_TABLE &&
                    i === index
                  }
                  ok={() => {
                    onRemoveItem?.(item.id);
                  }}
                  style={{
                    border: ".2rem solid",
                    borderColor:
                      deviceType === "TV" &&
                      rootControl === ROOT_CONTROL.NOTIFICATIONS_ORDER_TABLE &&
                      i === index
                        ? "var(--active-color, var(--initial-active-color))"
                        : "transparent",
                    height: "6rem",
                    width: "100%",
                  }}
                >
                  <span className="button-text">{t('remove')}</span>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Info */}
      {totalPages > 1 && (
        <div className="order-table__pagination">
          <span className="pagination__text">
            {t('page')} {currentPage} {t('of')} {totalPages}
          </span>
        </div>
      )}
    </div>
  );
};

export default memo(OrderTable);
