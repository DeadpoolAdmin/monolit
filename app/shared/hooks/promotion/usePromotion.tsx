import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSocketConnect from "../socket/useSocketConnect";
import { usePromotionView } from "./usePromotionView";
import { usePromotionClick } from "./usePromotionClick";
import { useDispatch, useSelector } from "react-redux";
import { setPrevRootControl, setRootControl } from "@/slices/RootControlSlice";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";

export const usePromotion = () => {
    useSocketConnect();

    const navigate = useNavigate();
    const notifyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const closeNotifyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [notify, setNotify] = useState(false);
    const [promotionData, setPromotionData] = useState<any>(null);

    const { handleChangeViewCount } = usePromotionView();
    const { handleChangeClickCount } = usePromotionClick()

    const dispatch = useDispatch();

    const rootControl = useSelector((state: any) => state.rootControl.rootControl);
    const prevRootControl = useSelector((state: any) => state.rootControl.prevRootControl);

    const onPromotionService = useCallback((e: Event) => {
        const { detail } = e as CustomEvent;

        navigate('/menu/services/categories/' + detail);

        localStorage.setItem('departmentUnitId', detail)

        window.fromPromotion = {
            fromPromotion: true,
            promotionId: promotionData?._id
        };

        handleChangeClickCount(promotionData?._id);
    }, [navigate, handleChangeClickCount])

    const onPromotionProduct = useCallback(() => {
        navigate(`/menu/products/categories/${promotionData?.remoteId}/detail`);

        localStorage.setItem('serviceId', promotionData?.remoteId);

        window.fromPromotion = {
            fromPromotion: true,
            promotionId: promotionData?._id
        };

        handleChangeClickCount(promotionData?._id);

    }, [navigate, promotionData])

    useEffect(() => {
        window.addEventListener('onPromotionService', onPromotionService);
        window.addEventListener('onPromotionProduct', onPromotionProduct);

        return () => {
            window.removeEventListener('onPromotionService', onPromotionService);
            window.removeEventListener('onPromotionProduct', onPromotionProduct);
        }
    }, [promotionData])

    useEffect(() => {
        const handleShowNotification = (e: Event) => {
            // Don't open promotion if toast is active
            if ((window as any).__isToastOrderActive) {
                return;
            }
            
            // Close keyboard/search if open before showing promotion
            const isKeyboardOrSearchOpen = rootControl === ROOT_CONTROL.CHAT_KEYBOARD_OPEN ||
                                          rootControl === ROOT_CONTROL.LIVETV_SEARCH ||
                                          rootControl === ROOT_CONTROL.HEADER_SEARCH;
            
            if (isKeyboardOrSearchOpen) {
                window.dispatchEvent(new CustomEvent('closeKeyboard'));
            }
            
            // Determine which control to save as prevRootControl
            // If keyboard/search is open, use the prevRootControl (the actual content control before keyboard)
            // If we're on header back control, skip it (it's a navigation element)
            // Otherwise use the current rootControl
            const isHeaderBackControl = rootControl === ROOT_CONTROL.HEADER_BACK;
            
            let controlToSave = rootControl;
            if (isKeyboardOrSearchOpen && prevRootControl) {
                // Use the control that was active before the keyboard/search opened
                controlToSave = prevRootControl;
            } else if (isHeaderBackControl) {
                // Don't save header back control, keep the existing prevRootControl
                controlToSave = prevRootControl || rootControl;
            }
            
            if(rootControl !== ROOT_CONTROL.PROMOTION) {
                dispatch(setPrevRootControl(controlToSave))
            }
            dispatch(setRootControl(ROOT_CONTROL.PROMOTION))
            
            const { detail } = e as CustomEvent;

            setPromotionData(detail.data);

            handleChangeViewCount(detail.data._id);

            // Clear any existing timeouts to ensure clean state
            clearTimeout(notifyTimeoutRef.current as NodeJS.Timeout);
            clearTimeout(closeNotifyTimeoutRef.current as NodeJS.Timeout);


            // Force close any existing notification first
            setNotify(false);

            // Open the promotion immediately after a small delay
            setTimeout(() => {
                setNotify(true);
            }, 100);
        };

        window.addEventListener('showNotification', handleShowNotification);

        return () => {
            window.removeEventListener('showNotification', handleShowNotification);
        }
    }, [rootControl, prevRootControl])

    useEffect(() => {
        return () => {
            clearTimeout(notifyTimeoutRef.current as NodeJS.Timeout);
            clearTimeout(closeNotifyTimeoutRef.current as NodeJS.Timeout);
        }
    }, [])


    return { notify, promotionData }
}