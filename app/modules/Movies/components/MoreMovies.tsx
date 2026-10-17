import { ListView } from 'smarters-ino-ui-tv'

import 'smarters-ino-ui-tv/dist/main.css'


import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useKeydown } from '@hotel-smarters/use-key-down-control';
import { useNavigate } from 'react-router-dom';
import { useResolution } from '@hotel-smarters/resolution-hook';
import { usePolyfillSearchParams } from '@hotel-smarters/polyfill-search-params';
import MovieData from '../types/movie.types';
import MovieRows from '../types/movie.rows.interface';
import { setRootControl } from '@/slices/RootControlSlice';
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL';
import MoviesItem from './MoviesItem';
import { useGetGenresMovies } from '../hooks/useGetGenresMovies';
import ScrollView from '@/shared/components/ScrollView/ScrollView';
import { useTranslate } from '@/shared/hooks/languages/useI18';

let transform_timeout: NodeJS.Timeout;

let timeout: NodeJS.Timeout;

// Memoized styles object to prevent recreation
const styles = {
    gap: 3,
    itemWidth: 25,
    itemHeight: 37
} as const

type PMoreMovies = {
    detailMainRef: React.MutableRefObject<HTMLDivElement | null>
    detailRef: React.MutableRefObject<HTMLDivElement | null>
    xtream?: MovieData[]
    m3u8?: any
}


// const ScrollView = React.lazy(() => import('scrollview/ScrollView'));

const MoreMovies: React.FC<PMoreMovies> = React.memo(({ detailMainRef, detailRef, xtream, m3u8 }) => {
    const movie = JSON.parse(localStorage.getItem('movie') as string)

    // localStorage
    const storageMovie = useSelector((state: any) => state.movieDetailSlice.movie)

    const { t } = useTranslate();

    // react states
    const [movies, setMovies] = useState<MovieRows[] | MovieData[] | null>(null)
    const [activeIndex, setActiveIndex] = useState(0);

    const { getDeviceType } = useResolution();

    const deviceType = getDeviceType();

    const navigate = useNavigate();

    const searchParams = usePolyfillSearchParams();

    // redux selectors
    const info = useSelector((state: any) => state.xtreamSlice.info);

    //redux dispatch
    const dispatch = useDispatch();

    const rootControl = useSelector((state : any) => state.rootControl.rootControl)

    //refs
    const moreMoviesRef = useRef<HTMLDivElement | null>(null);

    // rtk mutation to get related movies
    const { onGetGenresMovies } = useGetGenresMovies();

    // function to get related movies - memoized to prevent recreation
    const getRelatedMovies = useCallback(async () => {
        try {
            const genreIds = movie.vod_geners.map((genre: { genre_id: number }) => genre.genre_id);


            const data = await onGetGenresMovies(genreIds.join(','));

            if (data && data.length) {
                const movies = data.map((item: any) => {
                    return {
                        id: item._id,
                        name: item.title.en,
                        type: "movies",
                        poster: item.poster,
                        overview: item.description.en,
                        backdrop: item.backdrop,
                        price: item.price,
                        url: item.url,
                        vod_geners: item.genres?.map((vod: any) => {
                            return {
                                genre_id: vod._id,
                                name: vod.name
                            }
                        })
                    }
                })
                setMovies(movies)
            }
        }
        catch (e) {
            console.log(e)
        }
    }, [movie.vod_geners, onGetGenresMovies])

    // controls

    const control = {
        isActive: rootControl === ROOT_CONTROL.MOVIES_MORE,
        id: 'unique-id-more-movies-list',
        up: () => {

            if (storageMovie && storageMovie.tv_show_seasons && storageMovie.tv_show_seasons.length) {
                dispatch(setRootControl(ROOT_CONTROL.MOVIE_EPISODES))
                return
            }


            if (detailRef && detailRef.current) {
                if (info && info.episodes && moreMoviesRef && moreMoviesRef.current && movie?.type === 'series') {
                    detailRef.current.scrollTop -= moreMoviesRef.current.clientHeight;
                    dispatch(setRootControl(ROOT_CONTROL.MOVIE_EPISODES))
                    return
                }


                dispatch(setRootControl(ROOT_CONTROL.MOVIES_PLAY))
                if (detailMainRef && detailMainRef.current) {
                    detailMainRef.current.style.transform = 'translateY(0rem)'
                }
            }
        },

        right: () => {
            window.transforming = true;
            window.dispatchEvent(new Event("transformstart"));
        },
        left: () => {
            window.transforming = true;
            window.dispatchEvent(new Event("transformstart"));
        },
    }

    const back = {
        isActive: window.Android && deviceType !== 'TV',
        id: 'unique-id-back-more-movies-list',
        back: () => {
            const search = searchParams.toString();
            navigate(`/menu/vod${search ? `?${search}` : ''}`)
            dispatch(setRootControl(ROOT_CONTROL.MOVIES_LIST))
        }
    }

    useKeydown(control)
    useKeydown(back)


    // navigate to movie detail - memoized to prevent recreation
    const navigateToMovieDetail = useCallback((item: MovieRows) => {

        if(!item) return;

        const search = searchParams.toString();
        navigate(`/menu/vod/${item.id}${search ? `?${search}` : ''}`)

        clearTimeout(timeout as NodeJS.Timeout)

        localStorage.setItem('movie', JSON.stringify(item))

        timeout = setTimeout(() => {
            if (detailMainRef && detailMainRef.current) {
                detailMainRef.current.style.transform = 'translateY(0rem)'
                dispatch(setRootControl(ROOT_CONTROL.MOVIES_PLAY))
            }
        }, 500)

    }, [navigate, detailMainRef])


    // Memoized keyboard event handler
    const transformingEnd = useCallback((e: KeyboardEvent) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            if (transform_timeout) {
                clearTimeout(transform_timeout)
            }

            transform_timeout = setTimeout(() => {
                window.transforming = false;
                window.dispatchEvent(new Event("transformend"));
            }, 300);
        }
    }, [])

    useEffect(() => {
        document.addEventListener('keyup', transformingEnd)

        return () => {
            document.removeEventListener('keyup', transformingEnd)
        }
    }, [])


    useEffect(() => {
        if (window.VOD_SOURCE === 'xtream') {
            if (xtream && xtream.length) {
                setMovies(xtream)
            }

            return
        }

        if (window.VOD_SOURCE === 'm3u8') {
            if (m3u8 && m3u8.length) {
                setMovies(m3u8)
            }
        }
    }, [xtream, m3u8]);


    useEffect(() => {
        if (window.VOD_SOURCE !== 'xtream' && window.VOD_SOURCE !== 'm3u8') {
            getRelatedMovies()
        }
    }, [])


    useEffect(() => {
        window.addEventListener('movie-tapped', (e: Event) => {
            const event = e as CustomEvent;
            navigateToMovieDetail(event.detail);
        });

        return () => {
            window.addEventListener('movie-tapped', (e: Event) => {
                const event = e as CustomEvent

                navigateToMovieDetail(event.detail)
            })
        }
    }, [])


    // Memoized filtered movies to prevent recalculation
    const moreMovies = useMemo(() =>
        movies?.filter((m: any) => (m.id || m._id) !== movie.id),
        [movies, movie.id]
    );

    return (
        moreMovies && moreMovies.length ? (
            <div className="movie__detail__more" ref={moreMoviesRef}>
                <span>{t('moreMovies')}</span>
                {
                    deviceType === 'TV' ? (
                        <ListView
                            id="more_movies_list"
                            data={moreMovies}
                            uniqueKey="example-list"
                            itemsTotal={moreMovies.length}
                            itemsCount={5}
                            listType="horizontal"
                            gap={styles.gap}
                            itemWidth={styles.itemWidth}
                            itemHeight={styles.itemHeight}
                            onOk={(item) => navigateToMovieDetail(item)}
                            isActive={rootControl === ROOT_CONTROL.MOVIES_MORE}
                            startScrollIndex={3}
                            debounce={200}
                            onIndexChange={(index) => setActiveIndex(index)}
                            buffer={4}
                            nativeControle={true}
                            onBack={() => {
                                if (activeIndex === 0) {
                                    const search = searchParams.toString();
                                    navigate(`/menu/vod${search ? `?${search}` : ''}`)
                                }
                            }}
                            renderItem={({ index, style, isActive, item }) => (
                                <MoviesItem
                                    id={item.id as number}
                                    item={item}
                                    key={index}
                                    style={style}
                                    isActive={isActive}
                                />
                            )}
                        />
                    )
                    :
                    (
                        <ScrollView
                            data={moreMovies}
                            width={172}
                            height={57}
                            dimension="rem"
                            type={'list-movies'}
                            listType={'horizontal-list'}
                            renderItem={({ key, style, isActive, item }) => (
                                <MoviesItem
                                    id={(item as MovieRows).id as number}
                                    item={item as MovieRows}
                                    key={key}
                                    style={{
                                        ...style,
                                        width: '30rem',
                                        height: '45rem',
                                        position: 'relative',
                                        left: '0rem',
                                        top: '-4rem',
                                        margin: 0,
                                    }}
                                    isActive={isActive}
                                />
                            )}
                        />
                    )
                }
            </div>
        ) : <></>
    );
})

export default MoreMovies