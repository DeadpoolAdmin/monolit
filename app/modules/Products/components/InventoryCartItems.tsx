import { useResolution } from "@hotel-smarters/resolution-hook";
import { useKeydown } from "@hotel-smarters/use-key-down-control";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { ListView } from "smarters-ino-ui-tv";

import { CiCircleRemove } from "react-icons/ci";
import { setRootControl } from "@/slices/RootControlSlice";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { useText } from "@/shared/hooks/useGetText";
import { removeItem, setQuantity } from "@/slices/HotelServices/BasketSlice";
import ScrollView from "@/shared/components/ScrollView/ScrollView";

// const ScrollView = React.lazy(() => import('scrollview/ScrollView'))

const InventoryCartItems = ({
  isProduct,
  loading,
}: {
  isProduct: boolean;
  loading: boolean;
}) => {
  const basket = useSelector((state: any) => state.basket?.items);
  const rootControl = useSelector(
    (state: any) => state.rootControl?.rootControl
  );

  const cartTimeout = useRef<NodeJS.Timeout | null>(null);

  const [cartIndex, setCartIndex] = useState<number>(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const dispatch = useDispatch();

  const { getDeviceType } = useResolution();

  const deviceType = getDeviceType();

  const location = useLocation();
  const navigate = useNavigate();
  const { getText } = useText();

  const language = localStorage.getItem("lang") as string;

  const onUp = () => {
    dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES_CART_CLEAR));
  };

  const deviceInfoData = JSON.parse(
    localStorage.getItem("deviceInfo")! || "{}"
  );

  const currency = deviceInfoData.organization?.currency?.symbol
    ? deviceInfoData.organization?.currency.symbol
    : "$";

  const onRight = () => {
    if (cartIndex < 2) {
      if (isProduct) {
        setCartIndex(cartIndex + 1);

        return;
      }

      setCartIndex(1);

      return;
    }
  };

  const controls = {
    isActive: rootControl === "cart_item",
    id: "hotel-smarters-button",
    right: onRight,
    left: () => {
      if (cartIndex == 1) {
        setCartIndex(0);

        return;
      }

      if (cartIndex == 2) {
        setCartIndex(1);
        return;
      }

      if (cartIndex == 0) {
        if (location.pathname.includes("detail")) {
          dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES_CART_ADD));

          return;
        }

        dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES_INVENTORIES));
      }
    },
    down: () => {
      setCartIndex(0);
    },
    back: () => {
      if (activeIndex > 0) {
        setActiveIndex(0);
        return;
      }

      navigate(-1);
    },
  };

  const onOk = (item: any) => {
    if (cartIndex == 2) {
      if (isProduct) {
        addQuantity(item);
      } else {
        if (item.quantity == 1) {
          dispatch(removeItem(item.id));

          clearTimeout(cartTimeout.current as NodeJS.Timeout);
          cartTimeout.current = setTimeout(() => {
            if (basket.length == 1) {
              if (location.pathname.includes("detail")) {
                dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES_CART_ADD));

                return;
              }
              dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES_INVENTORIES));
            }
          }, 100);

          return;
        }
      }

      return;
    }
    if (cartIndex === 1) {
      minusQuantity(item);

      return;
    }
  };

  const addQuantity = (item: any) => {
    dispatch(setQuantity({ id: item.id, quantity: item.quantity + 1 }));
  };

  const minusQuantity = (item: any) => {
    if (item.quantity == 1) {
      dispatch(removeItem(item.id));

      clearTimeout(cartTimeout.current as NodeJS.Timeout);
      cartTimeout.current = setTimeout(() => {
        if (basket.length == 1) {
          if (location.pathname.includes("detail")) {
            dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES_CART_ADD));

            return;
          }
          dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES_INVENTORIES));
        }
      }, 100);

      return;
    } else {
      dispatch(setQuantity({ id: item.id, quantity: item.quantity - 1 }));
    }
  };

  useKeydown(controls);

  useEffect(() => {
    clearTimeout(cartTimeout.current as NodeJS.Timeout);
  }, []);

  return (
    <div className="cart__items">
      {deviceType === "TV" ? (
        <ListView
          id="cart"
          listType="vertical"
          itemsCount={10}
          itemsTotal={basket.length}
          isActive={rootControl === "cart_item"}
          data={basket}
          gap={2}
          buffer={4}
          onRight={onRight}
          onUp={onUp}
          onOk={(item) => onOk(item)}
          startScrollIndex={2}
          activeIndex={activeIndex}
          onIndexChange={(index) => setActiveIndex(index)}
          itemWidth={52}
          onDown={() => {
            setCartIndex(0);
            dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES_CART_PURCHASE));
          }}
          itemHeight={15}
          renderItem={({ item, style, isActive, key }) => (
            <div
              key={key}
              className={`cart__item ${loading ? "disabled" : ""} ${
                isActive ? "active" : ""
              }`}
              style={style}
            >
              <div className="item__text">
                <div className="item__name">
                  {getText(item.name, language).substring(0, 20)}
                </div>

                <div className="item__down_text">
                  <span className="price">
                    {currency + (item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="item__quantity">
                {isProduct ? (
                  <>
                    <div
                      onClick={() => minusQuantity(item)}
                      className={`minus ${
                        isActive && cartIndex === 1 ? "active" : ""
                      }`}
                    >
                      -
                    </div>

                    <span> {item.quantity} </span>
                    <div
                      onClick={() => addQuantity(item)}
                      className={`plus ${
                        isActive && cartIndex === 2 ? "active" : ""
                      }`}
                    >
                      +
                    </div>
                  </>
                ) : (
                  <CiCircleRemove
                    className={`plus ${
                      isActive && cartIndex === 1 ? "active" : ""
                    }`}
                    style={{
                      width: "6rem",
                      height: "6rem",
                    }}
                  />
                )}
              </div>
            </div>
          )}
        />
      ) : (
        <ScrollView
          dimension="vh"
          data={basket}
          width={50}
          style={{
            height: "95%",
            overflowY: "auto",
          }}
          listType={"vertical-list"}
          type={"vertical-list"}
          renderItem={({
            item,
            style,
            isActive,
            key,
          }: {
            item: { name: string; unitPrice: number; quantity: number };
            style: React.CSSProperties;
            isActive: boolean;
            key: React.Key;
          }) => (
            <div
              key={key}
              className={`cart__item  ${loading ? "disabled" : ""} ${
                isActive ? "active" : ""
              }`}
              style={{
                ...style,
                margin: "1rem 0",
              }}
            >
              <div
                className="item__text"
                style={{
                  marginLeft: "0",
                }}
              >
                <div className="item__name">
                  {getText(
                    (item as unknown as { name: string }).name,
                    language
                  ).substring(0, 15)}
                </div>

                <div className="item__down_text">
                  <span className="price">
                    {currency + (item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="item__quantity">
                <div
                  onClick={() => addQuantity(item)}
                  className={`plus ${
                    isActive && cartIndex === 1 ? "active" : ""
                  }`}
                >
                  +
                </div>
                <span> {item.quantity} </span>
                <div
                  onClick={() => minusQuantity(item)}
                  className={`minus ${
                    isActive && cartIndex === 2 ? "active" : ""
                  }`}
                >
                  -
                </div>
              </div>
            </div>
          )}
        />
      )}
    </div>
  );
};

export default InventoryCartItems;
