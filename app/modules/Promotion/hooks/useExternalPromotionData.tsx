import { useCallback, useEffect, useState } from "react";

export const useExternalPromotionData = () => {
    const [promotionData, setPromotionData] = useState<any>(null);

    const onPromotionData = useCallback((e: Event) => {
        const event = e as CustomEvent;
        const data = event.detail;

        setPromotionData(data);
    }, []);

    useEffect(() => {
        window.addEventListener('sendData', onPromotionData);

        return () => {
            window.removeEventListener('sendData', onPromotionData);
        };
    }, [onPromotionData]);

    return { promotionData };
};