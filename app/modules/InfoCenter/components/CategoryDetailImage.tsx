import { useGenerateUrl } from '@hotel-smarters/generatefileurl';
import React, { memo, useCallback, useMemo } from 'react'

import smarters_image from '@/assets/smarters.png'

interface CategoryDetailImageProps {
    image: string;
}

const CategoryDetailImage = memo(({ image }: CategoryDetailImageProps) => {
    const { getUrl } = useGenerateUrl(process.env.REACT_APP_API_HOST as string);

    // Memoize the image URL to prevent unnecessary recalculations
    const imageUrl = useMemo(() => getUrl(image), [getUrl, image]);

    // Memoize the error handler to prevent unnecessary re-renders
    const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const target = e.target as HTMLImageElement;
        target.src = smarters_image;
    }, []);

    return (
        <div className='detail__image'>
            <img 
                src={imageUrl} 
                onError={handleImageError} 
                alt='category' 
            />
        </div>
    )
});

CategoryDetailImage.displayName = 'CategoryDetailImage';

export default CategoryDetailImage