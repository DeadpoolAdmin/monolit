import React, { useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { usePolyfillSearchParams } from "@hotel-smarters/polyfill-search-params";

import { Button } from '@/shared/components/Button/Button';
import { useText } from "@/shared/hooks/useGetText";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { setPrevRootControl, setRootControl } from "@/slices/RootControlSlice";
import ButtonLoader from "@/shared/components/ButtonLoader/ButtonLoader";
import { useResolution } from "@hotel-smarters/resolution-hook";
import { useTranslate } from "@/shared/hooks/languages/useI18";


export enum PURCHASE_TYPE {
  RESERVABLE = "reservable",
  REQUESTABLE = "requestable",
}

type PServiceInfoContent = {
  description: string;
  name: string;
  price: number;
  onOk: VoidFunction;
  isService: boolean;
  isProduct: boolean;
  isLoading: boolean;
  purchaseType?: string;
  isAddingReservation: boolean;
};

const ServiceInfoContent = React.memo<PServiceInfoContent>(
  ({ description, name, price, onOk, isService, isProduct, isLoading, purchaseType, isAddingReservation }) => {
    const basket = useSelector((state: any) => state.basket?.items);
  
    const dispatch = useDispatch();
    const { getText } = useText();

    const deviceInfoData = JSON.parse(
      localStorage.getItem("deviceInfo")! || "{}"
    );

    const { t } = useTranslate();

    const currency = deviceInfoData.organization?.currency?.symbol
      ? deviceInfoData.organization?.currency.symbol
      : "$";

    const language = useMemo(() => localStorage.getItem("lang") as string, []);

    const deviceType = useResolution().getDeviceType();

    const priceInfo = useMemo(() => {
      const [whole, decimal] = (price || 0).toString().split(".");
      return { whole, decimal };
    }, [price]);

    const searchParams = usePolyfillSearchParams();
    const type = useMemo(() => searchParams.get("type"), [searchParams]);

    const isRoomService = useMemo(() => type === "services", [type]);

    const displayName = useMemo(
      () => getText(name, language),
      [getText, name, language]
    );
    const displayDescription = useMemo(
      () => getText(description, language),
      [getText, description, language]
    );

    const contentRef = React.useRef<HTMLDivElement>(null);
    const [isButtonLoading, setIsButtonLoading] = React.useState<boolean>(false);

    const navigate = useNavigate();

    const rootControl = useSelector((state: any) => state.rootControl.rootControl);

    const handleLoading = useCallback((e: Event) => {
      const { detail } = e as CustomEvent;

      if (!contentRef.current) return;

      if (detail.loading || isLoading) {
        setIsButtonLoading(true);
      } else {
        setIsButtonLoading(false);
      }
    }, [isLoading]);


    useEffect(() => {
      window.addEventListener("onloading", handleLoading);

      return () => {
        window.removeEventListener("onloading", handleLoading);
      };
    }, [handleLoading]);

    useEffect(() => {
      dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES_CART_ADD));
    }, []);

    const onUp = useCallback(() => {
        dispatch(setPrevRootControl(rootControl))
        dispatch(setRootControl(ROOT_CONTROL.HEADER_BACK))
    }, [dispatch]);

    const handleOk = useCallback(() => {
      if (!isButtonLoading && !isLoading) {
        onOk();
      }
    }, [onOk, isButtonLoading, isLoading]);

    const handleRight = useCallback(() => {
      if (basket.length && !isLoading) {
        dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES_CART_ITEM));
      }
    }, [basket.length, dispatch]);

    const onBack = useCallback(() => {
      if (window.fromPromotion) {
        navigate("/menu");
        return;
      }
      navigate(-1)
    }, [navigate]);

    return (
      <div
        className="info__content"
        ref={contentRef}
        style={{
          width: isService || isRoomService ? "133rem" : "79rem",
        }}
      >
        <div className="content__top">
          <div className="top__title">
            <span>{displayName}</span>
          </div>

          <div className="top__price_purchase">
            <div className="price">
              {currency + priceInfo.whole}

              {priceInfo.decimal && <sup>{"." + priceInfo.decimal}</sup>}

              {isService && <span className="price__purchase">/hr.</span>}
            </div>
            <Button
              up={onUp}
              right={handleRight}
              ok={handleOk}
              back={onBack}
              minWidth="22"
              maxWidth="30"
              style={{
                fontSize: "2.5rem",
                border: ".2rem solid transparent",
                borderColor:
                  rootControl === ROOT_CONTROL.HOTEL_SERVICES_CART_ADD && deviceType !== "TABLET" 
                    ? "var(--active-color)"
                    : "transparent",
              }}
              isActive={rootControl === ROOT_CONTROL.HOTEL_SERVICES_CART_ADD}
            >
              {isButtonLoading || isAddingReservation ? (
                <ButtonLoader />
              ) : (
                <span className="button-text">
                  {isRoomService ? t("order") : isProduct ? t("add") : isService && purchaseType === PURCHASE_TYPE.RESERVABLE ? t("reserve") : t("requestAService")}
                </span>
              )}
            </Button>
          </div>

          <div className="top__border"></div>

          <div className="top__description">{displayDescription}</div>
        </div>
      </div>
    );
  }
);

ServiceInfoContent.displayName = "ServiceInfoContent";

export default ServiceInfoContent;
