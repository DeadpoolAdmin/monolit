import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useGenerateUrl } from '@hotel-smarters/generatefileurl'
import { useResolution } from '@hotel-smarters/resolution-hook';

import defaultBackground from '@assets/backdrop.jpeg'
import { useSelector } from 'react-redux';
import MovieData from '../types/movie.types';
import { useDispatch } from 'react-redux';
import { setRootControl } from '@/slices/RootControlSlice';
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL';
import MovieDetailInfo from '../components/MovieDetailInfo';
import MovieDetailButtons from '../components/MovieDetailButtons';
import SeriesInfo from '../components/SeriesInfo';
import MoreMovies from '../components/MoreMovies';

const MovieDetail = React.memo(() => {
    // Safely parse movie data from localStorage
    const getMovieFromStorage = () => {
        try {
            const movieData = localStorage.getItem('movie')
            return movieData ? JSON.parse(movieData) : null
        } catch (error) {
            console.error('Error parsing movie data from localStorage:', error)
            return null
        }
    }

    const movie = getMovieFromStorage()

    // Early return if movie is null to prevent null access errors
    // if (!movie) {
    //     return (
    //         <React.Suspense>
    //             <Empty />
    //         </React.Suspense>
    //     )
    // }

    // redux selectors

    const xtream_data = useSelector((state: any) => state.xtreamSlice.combined_data_movies)
    const m3u8_combined = useSelector((state: any) => state.m3u8Slice.m3u8_combined)

    const [isApiSeasonExits, setIsApiSeasonExits] = useState<boolean>(false)

    const { id } = useParams();


    const { getDeviceType } = useResolution()

    const deviceType = getDeviceType()


    const { getUrl } = useGenerateUrl(process.env.REACT_APP_API_HOST as string);

    //custom useStates
    const [xtreamMovie, setXtreamMovie] = useState<MovieData[]>([])
    const [player, setPlayer] = useState<boolean>(false)
    const [m3u8Movie, setM3u8Movie] = useState<MovieData[]>([])

    //ref functionality
    const detailRef = useRef<HTMLDivElement | null>(null)
    const mainMovieDetailRef = useRef<HTMLDivElement | null>(null)

    // set background
    const [background, setBackground] = useState<string>('')

    //redux dispatch
    const dispatch = useDispatch();

    //permission movie function - memoized
    const perimssionMovie = useCallback(async () => {
    }, [])


    // get xtream related movies with specific category - memoized
    const getXtreamMoreMovies = useCallback(() => {
        if (xtream_data && movie?.category_id) {
            const categories = xtream_data.filter((category: any) => {
                return category.category_id == movie.category_id
            })

            if (categories && categories.length) {
                setXtreamMovie(categories[0].movies)
            }
        }
    }, [xtream_data, movie?.category_id])

    // get m3u8 related movies - memoized
    const getM3MoreMovies = useCallback(() => {
        if (m3u8_combined && movie?.category) {
            const categories = m3u8_combined.filter((category: any) => {
                return category.category_name === movie.category
            })

            if (categories && categories.length) {
                setM3u8Movie(categories[0].movies)
            }
        }
    }, [m3u8_combined, movie?.category])


    useEffect(() => {
        if (window.VOD_SOURCE === 'xtream') {
            if (!movie) {
                dispatch(setRootControl(ROOT_CONTROL.MOVIES_LIST))

                return
            }
            return
        }
    }, [movie])


    useEffect(() => {
        // dispatch(setMovieMainBlock(mainMovieDetailRef.current))
    }, [])


    useEffect(() => {
        if (window.VOD_SOURCE === 'xtream') {
            getXtreamMoreMovies();

            return
        }

        if (window.VOD_SOURCE === 'm3u8') {
            getM3MoreMovies();
        }

    }, [xtream_data, m3u8_combined])


    useEffect(() => {
        window.addEventListener('headerdowncontrol', (e: Event) => {
            const event = e as CustomEvent;

            if (event.detail.control === 'play_movies_or_buy') {
                dispatch(setRootControl('play_movies_or_buy'))
            }
        })
    }, [])


    // Memoized background image calculation
    const backgroundImage = useMemo(() => {
        if (!id) return '';

        if (window.VOD_SOURCE !== 'api') {
            return movie?.backdrop || defaultBackground;
        } else {
            return getUrl(movie?.backdrop);
        }
    }, [id, movie?.backdrop, getUrl]);

    useEffect(() => {
        setBackground(backgroundImage);
    }, [backgroundImage])

    // Memoized main div style
    const mainDivStyle = useMemo(() => ({
        height: deviceType !== 'TV' ? '90vh' : 'auto',
    }), [deviceType])

    useEffect(() => {
        dispatch(setRootControl(ROOT_CONTROL.MOVIES_PLAY))
    }, [])


    useEffect(() => {
        if (window.VOD_SOURCE !== 'xtream' && window.VOD_SOURCE !== 'm3u8') {
            if (movie?.type === 'series') {
                if (movie.seasons && movie.seasons.length) {
                    if (movie.seasons[0].episodes.length) {
                        setIsApiSeasonExits(true)
                    }
                    else {
                        setIsApiSeasonExits(false)
                    }
                }
                else {
                    setIsApiSeasonExits(false)
                }
            }

        }
        else {
            setIsApiSeasonExits(true)
        }


    }, [])


    useEffect(() => {
        return () => {
            localStorage.removeItem('first_epiosde');
        }
    }, [])

    return (
        movie && background &&
        <div className='movie__detail' style={{ backgroundImage: `url(${background})` }} ref={detailRef} >
            <div className="movie__detail__shadow"></div>

            <div className="movie__detail__main" ref={mainMovieDetailRef}
                style={mainDivStyle}
            >
                <MovieDetailInfo />

                <MovieDetailButtons player={player} setPlayer={setPlayer} onPermite={perimssionMovie} detailRef={detailRef} />

                {
                    movie?.type === 'series' ?
                        (isApiSeasonExits ?

                            <SeriesInfo /> : <></>)

                        :
                        <MoreMovies m3u8={m3u8Movie} xtream={xtreamMovie} detailMainRef={mainMovieDetailRef} detailRef={detailRef} />
                }


            </div>
        </div>
    )
})

export default MovieDetail