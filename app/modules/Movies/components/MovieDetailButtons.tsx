import React, { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux';


import { FaPlay } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { usePolyfillSearchParams } from '@hotel-smarters/polyfill-search-params';

import { Button } from '@/shared/components/Button/Button'
import { setRootControl } from '@/slices/RootControlSlice';
import MovieRows from '../types/movie.rows.interface';
import { makeMovieLink } from '../functions/makeMovieLink';
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL';
import { useTranslate } from '@/shared/hooks/languages/useI18';

type PMovieDetail = {
    detailRef: React.MutableRefObject<HTMLDivElement | null>,
    onPermite: VoidFunction,
    player: boolean,
    setPlayer: React.Dispatch<React.SetStateAction<boolean>>
}



const MovieDetailButtons: React.FC<PMovieDetail> = ({ setPlayer }) => {
    const dispatch = useDispatch();

    const rootControl = useSelector((state : any) => state.rootControl.rootControl)

    const movieDetail = JSON.parse(localStorage.getItem('movie') as string)

    const navigate = useNavigate();

    const searchParams = usePolyfillSearchParams();

    const { t } = useTranslate();

    const seriesInfo = useSelector((state: any) => state.movieDetailSlice.seriesInfo)

    const onDown = () => {
        const movie__detail__main = document.querySelector('.movie__detail__main') as HTMLDivElement
        const movie__detail__more = document.querySelector('.movie__detail__more') as HTMLDivElement


        if ((movieDetail.type === 'movies' || movieDetail.type === 'movie') && !movie__detail__more) {
            return;
        }

        if (movieDetail.type === 'series') {
            if (!movieDetail) {
                return
            }

            if(!seriesInfo || !seriesInfo.length) {
                return
            }


            if (seriesInfo && seriesInfo.length) {
                if (!seriesInfo[0].episodes || !seriesInfo[0].episodes.length) {
                    return
                }
            }

            movie__detail__main.style.transform = 'translateY(-45rem)'

            dispatch(setRootControl(ROOT_CONTROL.MOVIES_SEASONS));

            return
        }

        movie__detail__main.style.transform = 'translateY(-45rem)'

        dispatch(setRootControl(ROOT_CONTROL.MOVIES_MORE))
    }

    const onOk = (detail: MovieRows) => {
        const normalizeUrl = (u: string | null | undefined) => {
            if (!u) return '';
            let url = u;
            try {
                const parsed = JSON.parse(u);
                if (typeof parsed === 'string') url = parsed;
            } catch { }
            if (/^https?:\/\//i.test(url)) return url;
            const path = url.replace(/^\/?filesystem\//, '');
            if (url.startsWith('filesystem/') || url.startsWith('/filesystem/')) {
                return `${process.env.REACT_APP_API_HOST}/filesystem/${path}`;
            }
            return url;
        }

        if (detail.url) {
            localStorage.setItem('movie__link', normalizeUrl(detail.url))

            setPlayer(true)

            const search = searchParams.toString();
            navigate(`player${search ? `?${search}` : ''}`)

            return
        }

        if (window.VOD_SOURCE === 'xtream') {
            if (detail && detail.id) {
                if (detail.type !== 'series' && detail.container_extension) {
                    const url = window.PLAYLIST_URL.split('/').slice(0, 3).join('/');

                    const movieLink = makeMovieLink(url, 'movie', localStorage.getItem('username') as string, localStorage.getItem('password') as string, detail.id, detail.container_extension)

                    localStorage.setItem('movie__link', movieLink)

                    const search = searchParams.toString();
                    navigate(`player${search ? `?${search}` : ''}`)

                    setPlayer(true)
                }
                else {
                    const raw = localStorage.getItem('first_epiosde');
                    let firstEpisodeUrl: string | null = null;
                    if (raw && raw !== 'undefined' && raw !== 'null') {
                        try {
                            const parsed = JSON.parse(raw);
                            firstEpisodeUrl = typeof parsed === 'string' ? parsed : raw;
                        } catch {
                            firstEpisodeUrl = raw;
                        }
                    }

                    if (firstEpisodeUrl) {
                        localStorage.setItem('movie__link', normalizeUrl(firstEpisodeUrl))

                        const search = searchParams.toString();
                        navigate(`player${search ? `?${search}` : ''}`)

                        setPlayer(true)
                    }


                }
            }

            return
        }

        if (window.VOD_SOURCE !== 'xtream' && window.VOD_SOURCE !== 'm3u8') {
            const raw = localStorage.getItem('first_epiosde');
            let firstEpisodeUrl: string | null = null;
            if (raw && raw !== 'undefined' && raw !== 'null') {
                try {
                    const parsed = JSON.parse(raw);
                    firstEpisodeUrl = typeof parsed === 'string' ? parsed : raw;
                } catch {
                    firstEpisodeUrl = raw;
                }
            }
            if (firstEpisodeUrl) {
                const link = normalizeUrl(firstEpisodeUrl)
                localStorage.setItem('movie__link', link)
                const search = searchParams.toString();
                navigate(`player${search ? `?${search}` : ''}`)
            }
            return
        }


    }


    const isActive = useMemo(() => {
        return rootControl === ROOT_CONTROL.MOVIES_PLAY
    }, [rootControl])

    return (
        <div className='movie__detail__buttons' style={{ display: 'flex', margin: '2rem 0' }}>
            {
                <Button
                    isActive={isActive}
                    ok={() => onOk(movieDetail)}
                    minWidth='38'
                    maxWidth='41'
                    down={onDown}
                    back={() => {
                        const search = searchParams.toString();
                        navigate(`/menu/vod${search ? `?${search}` : ''}`)

                        return true;
                    }}
                    style={{
                        borderRadius: '5.7rem',
                        padding: '2.5rem 8rem',
                        fontWeight: 800,
                        transition: '.2s ease',
                        border: '.2rem solid transparent',
                        borderColor: isActive ? 'var(--active-color, var(--initial-active-color))' : 'transparent',
                    }}
                >
                    <div className="button__content button-text" style={{
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <FaPlay />
                        <span style={{
                            marginLeft: '1rem', fontFamily: 'var(--heading-font-family, var(--initial-heading-font-family))',
                        }}>{t('play')}</span>
                    </div>

                </Button>
            }
        </div >
    )
}

export default MovieDetailButtons