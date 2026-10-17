import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPromotionData } from "@/slices/Promotion/PromotionDataSlice";
import { IPromotion } from "../types/promotion.interface";

export const usePromotionData = (data : IPromotion) => {
    const dispatch = useDispatch();

    const getPromotionData = useCallback(() => {
        dispatch(setPromotionData(data));
    }, [dispatch]);


   useEffect(() => {
        if (data) {
            getPromotionData();
        }
   }, [data])

}