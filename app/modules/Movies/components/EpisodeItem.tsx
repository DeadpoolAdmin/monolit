import React, { useEffect } from 'react'

import movie_error from '@assets/movie_error.png'
import { useNavigate } from 'react-router-dom'
import { useGenerateUrl } from '@hotel-smarters/generatefileurl'
import { usePolyfillSearchParams } from '@hotel-smarters/polyfill-search-params'
import { IEpisodes } from '../types/seasons.interface'

type PEpisodeItem = {
    item: IEpisodes,
    isActive: boolean,
    style: React.CSSProperties,
    index: number
}

const EpisodeItem: React.FC<PEpisodeItem> = ({ item, isActive, style, index }) => {
    const imageRef = React.useRef<HTMLImageElement>(null);
    const imageBlockRef = React.useRef<HTMLDivElement>(null);

    const { getUrl } = useGenerateUrl(process.env.REACT_APP_API_HOST as string);

    const navigate = useNavigate();

    const searchParams = usePolyfillSearchParams();

    const navigatePlayer = () => {
        if (item.url) {
            localStorage.setItem('movie__link', item.url)

            const search = searchParams.toString();
            navigate(`player${search ? `?${search}` : ''}`)

            // dispatch(setCurrentControl('video-player'))

        }
    }

    useEffect(() => {
        if (imageRef.current && imageBlockRef.current) {

            if (imageRef.current.src === '') {
                imageRef.current.src = movie_error
                imageRef.current.className = 'error__image'
                imageBlockRef.current.className = 'error__imageBlock'
            }

            imageRef.current.onerror = (e: any) => {
                e.target.src = movie_error
                e.target.className = 'error__image'

                if (imageBlockRef.current) {
                    imageBlockRef.current.className = 'error__imageBlock'
                }

            }
        }

    }, [imageRef, imageBlockRef])

    return (
        <div style={style} onClick={navigatePlayer} className={`episode__item ${isActive ? 'active' : ''}`} key={index}>
            {
                <div className={`item__image`} ref={imageBlockRef}>
                    <img
                        className={imageRef.current?.src === movie_error ? 'error__image' : 'img'}
                        ref={imageRef}
                        src={window.VOD_SOURCE === 'xtream' || window.VOD_SOURCE === 'm3u8' ? item.image : getUrl(item.image)}
                        alt=""
                    />
                </div>
            }


            <div className="item__text">
                <div className="text__title">
                    <span>
                        {item.title?.en}
                    </span>

                </div>
                <div className="text__description">
                    <span>
                        {item.description.en}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default EpisodeItem