import { useText } from '@/shared/hooks/useGetText';
import React from 'react'
import { useSelector } from 'react-redux';

const ContentButtomText = () => {
    const promotion = useSelector((state: any) => state?.promotionData?.data);

    const { getText } = useText();

    const language = localStorage.getItem('lang') || 'en';

    return (
        <div className='content__buttom_text'>
            <div className="notification__title">
                {
                    promotion?.promotionTitle && typeof promotion?.promotionTitle === 'string' 
                         ? promotion?.promotionTitle?.substring(0, 30) 
                         : (promotion?.promotionTitle ? getText(promotion?.promotionTitle, language)?.substring(0, 30) : 'Notification Title')
                }
            </div>
            <div className="notification__text">
                <span>
                    {promotion?.content && typeof promotion?.content === 'string' 
                        ? promotion?.content?.substring(0, 100) 
                        : (promotion?.content ? getText(promotion?.content, language)?.substring(0, 100) : 'Notification Content')
                    }
                </span>
            </div>
        </div>
    )
}

export default ContentButtomText