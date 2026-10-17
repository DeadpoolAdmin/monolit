import { useDispatch } from "react-redux";
import { useLazyGetBrandingQuery } from "../../services/Settings/SettingsApi";
import { setBranding } from "@/slices/BrandingSlice";


export const useGetBranding = () => {
    const [ getBranding, { isError, isLoading } ] = useLazyGetBrandingQuery();

    const dispatch = useDispatch();

    const getBrandingData = async () => {
        try {
            const result = await getBranding(undefined);

            if ('data' in result) {
                dispatch(setBranding(result.data));
                return result.data;
            }
        } catch (error) {
            console.error(error);
        }
    }

    return { getBrandingData, isError, isLoading };
}