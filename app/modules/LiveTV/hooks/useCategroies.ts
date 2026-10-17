import { useLazyGetCategoriesQuery } from "@/services/Media/Backend/MediaApi";
import { IChannels, IXtreamChannels } from "../types/channels.interface";
import { useLazyGetXtreamChannelsCategoriesQuery } from "@/services/Media/PlaylistApi/PlaylistApi";
import { useCallback, useEffect, useState } from "react";
import ICategories from "../types/categories.interface";

export const useCategories = (channels: IChannels[] | IXtreamChannels[]) => {
    const [getCategories, { isLoading: isCategoriesLoading }] = useLazyGetCategoriesQuery();
    const [getXtreamCategories, { isLoading: isXtreamCategoriesLoading }] = useLazyGetXtreamChannelsCategoriesQuery();

    const [categories, setCategories] = useState<ICategories[]>([]);
    const [sourceReady, setSourceReady] = useState(false);
    const [categoriesFetched, setCategoriesFetched] = useState(false);

    const getApiCategories = useCallback(async () => {
        try {
            const response = await getCategories().unwrap();

            if (response) {
                const transformedCategories = response.map((category: ICategories) => ({
                    _id: category._id,
                    number: category.number,
                    name: category.title,
                    category_id: category.category_id
                }));

                setCategories(transformedCategories)


                return transformedCategories;
            }
            null

        }
        catch (e) {
            console.log(e)
        }
    }, [getCategories, setCategories])


    const onGetXtreamCategories = useCallback(async () => {
        try {
            const response = await getXtreamCategories().unwrap();

            const newCategories = response.map((category: ICategories) => ({
                _id: category.category_id,
                name: category.category_name,
                category_id: category.category_id,
                channels: channels.filter((channel: IChannels | IXtreamChannels) => channel.category_id === category.category_id)

            }));



            setCategories(newCategories)
        }
        catch (e) {
            console.log(e)
        }
    }, [getXtreamCategories, setCategories, channels])

    const fetchCategories = useCallback(async () => {
        try {
            if (window.LIVETV_SOURCE === 'xtream' || window.LIVETV_SOURCE === 'm3u8') {
                await onGetXtreamCategories();
            } else if (window.LIVETV_SOURCE === 'api') {
                await getApiCategories();
            }
            setCategoriesFetched(true);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategoriesFetched(true); // Mark as fetched even on error to prevent infinite loading
        }
    }, [onGetXtreamCategories, getApiCategories, channels]);

    const isLoading = !categoriesFetched || (window.LIVETV_SOURCE === 'xtream' || window.LIVETV_SOURCE === 'm3u8' ? isXtreamCategoriesLoading : isCategoriesLoading);

    // Check for LIVETV_SOURCE availability
    useEffect(() => {
        const checkSource = () => {
            if (window.LIVETV_SOURCE) {
                setSourceReady(true);
                return true;
            }
            return false;
        };

        // Check immediately
        if (checkSource()) return;

        // If not available, check periodically
        const interval = setInterval(() => {
            if (checkSource()) {
                clearInterval(interval);
            }
        }, 50);

        // Cleanup after 5 seconds
        const timeout = setTimeout(() => {
            clearInterval(interval);
            console.warn('window.LIVETV_SOURCE not set after 5 seconds for categories, defaulting to backend');
            setSourceReady(true);
        }, 5000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, []);

    // Fetch categories when source is ready
    useEffect(() => {
        if (sourceReady) {
            fetchCategories();
        }
    }, [sourceReady]);

    return {
        categories,
        isCategoriesLoading,
        isXtreamCategoriesLoading,
        fetchCategories,
        isLoading,
        categoriesFetched,
        getApiCategories,
        onGetXtreamCategories
    }
}