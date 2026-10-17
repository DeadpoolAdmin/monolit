import React from 'react'

import not_found from '@/assets/smarters.png'
import { useGenerateUrl } from '@hotel-smarters/generatefileurl'
import { useNavigate } from 'react-router-dom'
import { usePolyfillSearchParams } from '@hotel-smarters/polyfill-search-params'
import { PCategoriesItem } from '../types/categories.props'
import { useText } from '@/shared/hooks/useGetText'

const CategoriesAllItem: React.FC<PCategoriesItem> = React.memo(({ style, isActive, item, index }) => {


    const { getUrl } = useGenerateUrl(process.env.REACT_APP_API_HOST as string);

    const navigate = useNavigate();
    const searchParams = usePolyfillSearchParams();
    const language = localStorage.getItem('lang') || 'en';

    const { getText } = useText();

    const goTo = () => {
        const search = searchParams.toString();
        navigate(`${item._id}${search ? `?${search}` : ''}`);
        localStorage.setItem('category', JSON.stringify(item))    
    }

    return (
        item &&
        <div onClick={goTo} className={`lists__item ${isActive ? 'active' : ''}`} style={style} key={index}>
            <div className="lists__image">
                <img onError={
                    (e) => {
                        const target = e.target as HTMLImageElement

                        target.src = not_found
                    }
                } src={getUrl(item.image)} alt="" />
            </div>

            <div className="layer" style={{
                background: `${isActive ? 'rgba(0, 0, 0, 0.5)' : 'transparent'}`,
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                zIndex: 1,
                transition: '0.1s ease',
                borderRadius: '1.4rem'
            }}></div>

            <div className="lists__name" style={{
                zIndex: 1
            }}>
                <span> {item?.name && getText(item.name, language)}</span>
            </div>

        </div>
    )
})

export default CategoriesAllItem