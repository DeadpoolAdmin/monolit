import { useKeydown } from "@hotel-smarters/use-key-down-control";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { ListView } from "smarters-ino-ui-tv";
import "smarters-ino-ui-tv/dist/main.css";
import { useResolution } from "@hotel-smarters/resolution-hook";
import { Button } from '@/shared/components/Button/Button';
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { setPrevRootControl, setRootControl } from "@/slices/RootControlSlice";
import { AnyItem } from "../types/order.interface";
import OrderListItem from "../components/OrderListItem";
import { formatDate } from "@/shared/functions/orderDate";
import ConfirmPopup from "../components/ConfirmPopup";
import ScrollView from "@/shared/components/ScrollView/ScrollView";
import { useLazyGetOrderByIdQuery, useLazyGetReservationByIdQuery } from "@/services/PMS/servicesApi";
import QueryWrapper from "@/shared/components/QueryWrapper";
import { useTranslate } from "@/shared/hooks/languages/useI18";
import { getLocale } from "@/shared/functions/getLocale";

const Order = () => {
  const rootControl = useSelector(
    (state: any) => state.rootControl.rootControl
  );

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [activeIndex, setActiveIndex] = useState(0);

  const [popup, setPopup] = useState<boolean>(false);

  const { getDeviceType } = useResolution();

  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');


  const [order, setOrder] = useState<any>({ items: [] });

  const [getOrderById, { isLoading: isOrderLoading, data: orderData }] = useLazyGetOrderByIdQuery();

  const [getReservationById, { isLoading: isReservationLoading, data: reservationData }] = useLazyGetReservationByIdQuery();


  const { t, language } = useTranslate();

  const deviceType = getDeviceType();

  const onGetOrderById = async () => {
    if(type === 'order' || !type){
      try {
        const response = await getOrderById(id as string).unwrap();
        if(response) {
          setOrder({
            ...response,
            type: !response.type ? "" : response.type 
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    else if(type === 'reservation'){

      try {
        const response = await getReservationById(id as string).unwrap();
        
        if(response) {
          setOrder({
            ...response,
            items: response.service,
            type: !response.type ? "" : response.type 
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
   
  }

  useEffect(() => {
    onGetOrderById();
  }, [id, type]);
  
  const controls = {
    isActive: rootControl === ROOT_CONTROL.ORDER_CART_ITEM,
    id: "order-control-id",
    back: () => {
      if (popup) {
        setPopup(false);
        return;
      }

      localStorage.removeItem("order");
      navigate(-1);
    },
    up: () => {
      dispatch(setPrevRootControl(rootControl));
      dispatch(setRootControl(ROOT_CONTROL.HEADER_BACK));
    },
  };

  useKeydown(controls);


  const onOk = () => {
    dispatch(setRootControl(ROOT_CONTROL.ORDER_POPUP));
    setPopup(true);
  };

  const onBack = () => {
    navigate('/menu/myorders');
    dispatch(setRootControl(ROOT_CONTROL.ORDER_CART_ITEM));
  };

  useEffect(() => {
    dispatch(setRootControl(ROOT_CONTROL.ORDER_CART_ITEM));
  }, [dispatch]);


  return (
    <QueryWrapper isLoading={isOrderLoading || isReservationLoading} isEmpty={!orderData && !reservationData && !order.items?.length}>
      
      <div className="order__cart">
        <div className="order__cart__header">
          <div className="header__timestamp">
            <span>
              {order.type === "reservation"
                ? (order.date
                    ? new Date(order.date).toLocaleDateString(getLocale(language))
                    : "") +
                  " " +
                  (order.reservationFrom
                    ? order.reservationFrom.slice(0, 5)
                    : "")
                : order.createdAt
                ? formatDate(new Date(order.createdAt), true, getLocale(language))
                : ""}
            </span>
          </div>

          <div className="header__status">
            <span className={order.status ? order.status.toLowerCase() : ''}>
              {order.status
                ? order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()
                : ""}
            </span>
          </div>
        </div>

        <div className="order__cart_list order__cart_item_list" style={{
          height: deviceType === 'TV' ? '65rem' : '40%',
        }}>
          {
            type === 'reservation' ? (
              <OrderListItem
                type={type}
                style={{}}
                item={order as any}
                isActive={
                  deviceType === "TV" &&
                  rootControl === ROOT_CONTROL.ORDER_CART_ITEM
                }
              />
            ) : deviceType === "TV" ? (
              <ListView
                data={order.items}
                id="cart_item"
                uniqueKey="cart_item"
                listType="vertical"
                nativeControle={true}
                itemsCount={6}
                itemsTotal={order?.items?.length}
                buffer={5}
                itemWidth={142}
                itemHeight={23}
                gap={5.5}
                isActive={rootControl === ROOT_CONTROL.ORDER_CART_ITEM}
                initialActiveIndex={0}
                onBackScrollIndex={null}
                startScrollIndex={0}
                direction="ltr"
                onDown={() =>
                  order.status === "pending" &&
                  dispatch(setRootControl(ROOT_CONTROL.ORDER_POPUP_CANCEL))
                }
                rowGap={5.5}
                onUp={() => {
                  dispatch(setPrevRootControl(rootControl));

                  dispatch(setRootControl(ROOT_CONTROL.HEADER_BACK));
                }}
                activeIndex={activeIndex}
                onIndexChange={(index) => {
                  setActiveIndex(index);
                }}
                onLeft={() => {}}
                onRight={() => {}}
                renderItem={({ item, style, isActive, key }) => (
                  <OrderListItem
                    type={type || 'order'}
                    item={item}
                    style={style}
                    isActive={isActive}
                    key={key}
                  />
                )}
              />
            ) : 
            <ScrollView
                data={order.items}
                width={142}
                dimension={'vh'}
                listType={'grid'}
                type={'gird-movies'}
                renderItem={({ item, style, isActive, key }) => (
                    <OrderListItem type={type || 'order'} item={item as unknown as AnyItem} style={{ ...style, width: '142rem', height: '25rem', margin: '4rem 0 !important' }} isActive={isActive} key={key} />
                )}
            />
          }
        </div>

        {order.status === "pending" && (
          <div className="order__cancel__button">
            <Button
              className="secondary"
              ok={onOk}
              minWidth="23"
              maxWidth="35"
              back={onBack}
              up={() => dispatch(setRootControl(ROOT_CONTROL.ORDER_CART_ITEM))}
              isActive={rootControl === ROOT_CONTROL.ORDER_POPUP_CANCEL}
              style={{
                border: ".2rem solid transparent",
                borderColor:
                  rootControl === ROOT_CONTROL.ORDER_POPUP_CANCEL
                    ? "var(--active-color, var(--initial-active-color))"
                    : "transparent",
              }}
            >
              <span className="button-text">{t('cancel')}</span>
            </Button>
          </div>
        )}
      </div>

      {popup && <ConfirmPopup setPopup={setPopup} />}
    </QueryWrapper>
  );
};

export default Order;
