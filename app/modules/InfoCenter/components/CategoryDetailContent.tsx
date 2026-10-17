import { useText } from '@/shared/hooks/useGetText';
import React, { memo, useMemo } from 'react'

interface CategoryDetailContentProps {
    description: string;
    title: string;
}

const CategoryDetailContent = memo(({ description, title }: CategoryDetailContentProps) => {
    const language = useMemo(() => localStorage.getItem('language') || 'en', []);

    const { getText } = useText();

    // Memoize the processed text to prevent unnecessary recalculations
    const processedTitle = useMemo(() => getText(title, language), [getText, title, language]);
    const processedDescription = useMemo(() => getText(description, language), [getText, description, language]);

    return (
        <div className='detail__content'>
            <div className="content__title">
                <span>{processedTitle}</span>
            </div>

            <div className="content__description">
                <span>{processedDescription}</span>
            </div>
        </div>
    )
});

CategoryDetailContent.displayName = 'CategoryDetailContent';

export default CategoryDetailContent