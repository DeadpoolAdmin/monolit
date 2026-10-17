import { useKeydown } from "@hotel-smarters/use-key-down-control";
import { useCallback, useEffect, useState } from "react"
import { usePromotionClose } from "./usePromotionClose";
import { useSelector } from "react-redux";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";

export const useActivePromotion = () => {
    const [index, setIndex] = useState<number>(1);

    const promotion = useSelector((state: any) => state?.promotionData?.data);

    const rootControl = useSelector((state: any) => state.rootControl.rootControl);

    const { closePromotion } = usePromotionClose();

    const handleNext = useCallback(() => {
        if (promotion?.type !== 'custom' && promotion?.remoteId) {
            setIndex((prevIndex) => prevIndex + 1);
        }
    }, [setIndex, promotion]);

    const handlePrev = useCallback(() => {
        if (promotion?.type !== 'custom' && promotion?.remoteId) {
            setIndex((prevIndex) => (prevIndex - 1));
        }
    }, [setIndex, promotion]);

    useEffect(() => {
        if (promotion) {
            if (promotion.type === 'custom' || !promotion?.remoteId) {
                setIndex(2);
            }
        }
    }, [promotion])

    const onDetails = () => {
        if (promotion) {
            const promotionElement = document.querySelector('.promotion');

            if (promotionElement && !promotionElement.classList.contains('hide')) {
                switch (promotion.type) {
                    case 'service':
                        window.dispatchEvent(new CustomEvent('onPromotionService', { detail: promotion.remoteId }));
                        localStorage.setItem('serviceId', promotion.remoteId);
                        closePromotion();
                        break;
                    case 'product':
                        window.dispatchEvent(new CustomEvent('onPromotionProduct', { detail: promotion.remoteId }));
                        localStorage.setItem('serviceId', promotion.remoteId);
                        closePromotion();
                        break;
                }
            }
        }
    }


    const controls = {
        isActive: rootControl === ROOT_CONTROL.PROMOTION,
        id: 'promotion',
        right: () => {
            if (index === 2) {
                return;
            }
            handleNext();
        },
        left: () => {
            if (index === 1 || promotion?.type === 'custom') {
                return;
            }
            handlePrev();
        },
        ok: () => {
            if (index == 1) {

                onDetails();


                return;
            }
            else if (index == 2) {
                const promotionElement = document.querySelector('.promotion');

                if (promotionElement && !promotionElement.classList.contains('hide')) {
                    (window as any).__isPromotionActive = false;
                    window.dispatchEvent(new CustomEvent('promotionClosed'));

                    closePromotion();
                }
            }
        },
        back: () => { }
    }

    useKeydown(controls);

    return {
        index,
        isActive: rootControl === ROOT_CONTROL.PROMOTION,
        onDetails
    }
}