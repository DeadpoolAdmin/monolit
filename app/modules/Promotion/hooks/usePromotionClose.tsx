import { setRootControl } from "@/slices/RootControlSlice";
import { useCallback } from "react"
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux"

export const usePromotionClose = () => {

    const dispatch = useDispatch();

    const prevRootControl = useSelector((state: any) => state.rootControl.prevRootControl);

    const closePromotion = useCallback(() => {
        const promotionElement = document.querySelector('.promotion');
        promotionElement?.classList.add('hide');
        dispatch(setRootControl(prevRootControl));
    }, [dispatch, prevRootControl])

    return { closePromotion }
}