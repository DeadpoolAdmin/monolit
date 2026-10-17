import { useEffect, useRef } from "react";

export const useOnHideNotify = () => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);


    const hideNotify = (e: Event) => {
        const event = e as CustomEvent;
        const promotionElement = document.querySelector('.promotion');


        if (promotionElement) {
            promotionElement.classList.add('hide');

            window.dispatchEvent(new CustomEvent('promotionUp'))

            window.dispatchEvent(new CustomEvent('promotionClosed'));
            
            (window as any).__isPromotionActive = false;

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                event.detail();
            }, 200);
        }
    }

    useEffect(() => {
        window.addEventListener('hideNotify', hideNotify);
        return () => {
            window.removeEventListener('hideNotify', hideNotify);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        }
    }, [])
}