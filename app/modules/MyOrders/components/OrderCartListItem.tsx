import { useGenerateUrl } from "@hotel-smarters/generatefileurl";
import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { FaChevronRight } from "react-icons/fa";

import ErrImage from "@assets/smarters.png";
import { useSelector } from "react-redux";
import {
  InventoryItem,
  OrderCartListItemProps,
} from "../types/order.interface";
import { SelectedTab } from "../types/selectedTab";
import { formatDate } from "@/shared/functions/orderDate";
import { getWholeAndDecimal } from "../functions/getWholeAndDecimal";
import { useTranslate } from "@/shared/hooks/languages/useI18";
import { getLocale } from "@/shared/functions/getLocale";

const OrderCartListItem = ({
  item,
  style,
  isActive,
  onClick,
}: OrderCartListItemProps) => {
  const { getUrl } = useGenerateUrl(process.env.REACT_APP_API_HOST as string);

  const deviceInfoData = JSON.parse(
    localStorage.getItem("deviceInfo")! || "{}"
  );

  const { t, language } = useTranslate();

  const currency = deviceInfoData.organization?.currency?.symbol
    ? deviceInfoData.organization?.currency.symbol
    : "$";

  // Scrolling functionality state
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isWaitingAtEnd, setIsWaitingAtEnd] = useState(false);
  const [isScrollingLeft, setIsScrollingLeft] = useState(false);
  const [maxScroll, setMaxScroll] = useState(0);

  const imagesContainerRef = useRef<HTMLDivElement>(null);
  const imagesWrapperRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const waitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const tab = useSelector((state: any) => state.orderTab.selectedTab);

  // Calculate if images overflow the container and max scroll distance
  const checkOverflow = useCallback(() => {
    if (imagesContainerRef.current && imagesWrapperRef.current) {
      const containerWidth = imagesContainerRef.current.offsetWidth;
      const contentWidth = imagesWrapperRef.current.scrollWidth;
      const overflow = contentWidth > containerWidth;
      setHasOverflow(overflow);

      if (overflow) {
        const maxScrollDistance = (contentWidth - containerWidth) / 10; // px → rem
        setMaxScroll(maxScrollDistance);
      } else {
        setMaxScroll(0);
      }
    }
  }, []);

  // Check overflow on mount and when items change
  useEffect(() => {
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [checkOverflow, item.items || []]);

  // Reset scroll position and clear animations when item becomes inactive
  useEffect(() => {
    if (!isActive) {
      setScrollPosition(0);
      setIsPaused(false);
      setIsWaitingAtEnd(false);
      setIsScrollingLeft(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (waitTimeoutRef.current) {
        clearTimeout(waitTimeoutRef.current);
        waitTimeoutRef.current = null;
      }
    }
  }, [isActive]);

  // Auto-scroll functionality with 500ms delay
  useEffect(() => {
    if (!isActive || !hasOverflow || isPaused || maxScroll === 0) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    // Don't start new animation if waiting - let the timeout handle restart
    if (isWaitingAtEnd) return;

    let startTimeout: NodeJS.Timeout | null = null;
    const scrollSpeed = 25; // rem per second

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastUpdateTimeRef.current) / 1000;
      lastUpdateTimeRef.current = currentTime;

      setScrollPosition((prev) => {
        let newPosition;

        if (isScrollingLeft) {
          newPosition = prev - scrollSpeed * deltaTime;
          if (newPosition <= 0) {
            setIsScrollingLeft(false);
            return 0;
          }
        } else {
          newPosition = prev + scrollSpeed * deltaTime;
          if (newPosition >= maxScroll) {
            setIsWaitingAtEnd(true);
            waitTimeoutRef.current = setTimeout(() => {
              setIsScrollingLeft(true);
              setIsWaitingAtEnd(false);
              waitTimeoutRef.current = null;
            }, 1000);
            return maxScroll;
          }
        }
        return newPosition;
      });

      // Continue animation if not waiting
      if (
        isActive &&
        hasOverflow &&
        !isPaused &&
        maxScroll > 0 &&
        !isWaitingAtEnd
      ) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    // For initial start or when switching from right to left, add delay
    const shouldDelay = !isScrollingLeft;
    const delay = shouldDelay ? 500 : 0;

    startTimeout = setTimeout(() => {
      lastUpdateTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (waitTimeoutRef.current) {
        clearTimeout(waitTimeoutRef.current);
        waitTimeoutRef.current = null;
      }
      if (startTimeout) {
        clearTimeout(startTimeout);
      }
    };
  }, [
    isActive,
    hasOverflow,
    isPaused,
    maxScroll,
    isWaitingAtEnd,
    isScrollingLeft,
  ]);

  // Pause/resume on hover
  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
    if (waitTimeoutRef.current) {
      clearTimeout(waitTimeoutRef.current);
      waitTimeoutRef.current = null;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
    if (isWaitingAtEnd) {
      waitTimeoutRef.current = setTimeout(() => {
        setIsScrollingLeft(true);
        setIsWaitingAtEnd(false);
        waitTimeoutRef.current = null;
      }, 1000);
    }
  }, [isWaitingAtEnd]);

  // Calculate transform for scrolling
  const scrollTransform = useMemo(() => {
    if (!isActive || !hasOverflow) return "translateX(0)";
    return `translateX(-${scrollPosition}rem)`;
  }, [isActive, hasOverflow, scrollPosition]);

  return (
    <div
      className={`cart__item ${isActive ? "active" : ""}`}
      style={style}
      onClick={onClick}
    >
      <div className="item__body">
        <div className="item__header">
          <span className="item__timestamp">
            {tab === SelectedTab.INVENTORIES
              ? item.createdAt
                ? formatDate(new Date(item.createdAt), true, getLocale(language))
                : ""
              : (item.date ? formatDate(new Date(item.date), false, getLocale(language)) : "") +
                " " +
                (item?.reservationFrom ? item.reservationFrom.slice(0, 5) : "")}
          </span>
          <span
            className={`item__status ${
              item.status ? item.status.toLowerCase() : ""
            }`}
          >
            {item.status
              ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
              : ""}
          </span>
        </div>

        <div className="item__content">
          <div
            className="content__images"
            ref={imagesContainerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="images__wrapper"
              ref={imagesWrapperRef}
              style={{
                transform: scrollTransform,
                transition: "none",
              }}
            >
              {tab === SelectedTab.INVENTORIES ? (
                (item.items || []).map((inventoryItem: InventoryItem) => (
                  <div className="image__container" key={inventoryItem.id}>
                    <img
                      onError={(e) => {
                        e.currentTarget.src = ErrImage;
                      }}
                      src={getUrl(inventoryItem.inventory?.image || "")}
                      alt="item"
                    />
                  </div>
                ))
              ) : (
                <div className="image__container" key={item.id}>
                  <img
                    onError={(e) => {
                      e.currentTarget.src = ErrImage;
                    }}
                    src={getUrl(item?.image || "")}
                    alt="item"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="content__detail__total">
            <span
              className="content__detail__total__price"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              {tab === SelectedTab.INVENTORIES ? (
                <>
                  <span className="content__detail__total__title" style={{marginRight: '1rem'}}>
                    {" "}
                    {t('total')}:
                  </span>
                  {" " + currency ? currency + "" : "$"}
                  <span>
                    {getWholeAndDecimal(item.totalAmount || 0).whole}
                    {getWholeAndDecimal(item.totalAmount || 0).decimal > 0
                      ? "." + getWholeAndDecimal(item.totalAmount || 0).decimal
                      : ""}
                  </span>
                </>
              ) : (
                <>
                  {currency ? currency : "$"}
                  {item.price}
                </>
              )}
            </span>
            <div className="content__detail__see_details">
              <span>{t('seeDetails')}:</span>
              <FaChevronRight />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCartListItem;
