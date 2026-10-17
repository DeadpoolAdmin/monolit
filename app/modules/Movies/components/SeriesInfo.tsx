import React, { useEffect, useState, useCallback } from 'react'
import { useSelector } from 'react-redux';
import { IEpisodes, ISeasons } from '../types/seasons.interface';
import { makeMovieLink } from '../functions/makeMovieLink';
import Seasons from './Seasons';
import Episodes from './Episodes';
import { useGetSeriesInfo } from '../hooks/useGetSeriesInfo';
import { useGetXtreamSeriesInfo } from '../hooks/useGetXtreamSeriesInfo';
import { useDispatch } from 'react-redux';
import { changeEpisodes, changeSeriesInfo } from '@/slices/Movies/MovieDetailSlice';


function makeSeriesLink() {
    const url = window.PLAYLIST_URL.split('/').slice(0, 3).join('/');

    return url;
}


const SeriesInfo = React.memo(() => {
    const movie = JSON.parse(localStorage.getItem('movie') as string)
    const selectedSeason = useSelector((state: any) => state.movieDetailSlice.selectedSeason)

    //rtk mutation
    const { onGetSeriesInfo } = useGetSeriesInfo();
    const { onGetXtreamSeriesInfo } = useGetXtreamSeriesInfo();

    // useState seriesInfo
    const [seasonsInfo, setSeasonsInfo] = useState<ISeasons[]>()
    const [episodes, setEpisodes] = useState<IEpisodes[]>()

    const dispatch = useDispatch();

    // get series info from our server 
    const getSeriesInfo = async () => {
        try {
            if (window.VOD_SOURCE !== 'xtream' && window.VOD_SOURCE !== 'm3u8') {
                const data = await onGetSeriesInfo(movie.id);

                if (data) {
                    const seasonData = data.seasons.map((d: ISeasons) => {
                        return {
                            _id: d._id,
                            title: d.title,
                            series: d.series,
                            seasonNumber: d.seasonNumber,
                            episodes: d.episodes.map((episode) => {
                                return {
                                    _id: episode._id,
                                    image: episode.image,
                                    season: episode.season,
                                    title: episode.title,
                                    description: episode.description,
                                    url: episode.url
                                }
                            }),
                        }
                    })

                    setSeasonsInfo(seasonData)
                    dispatch(changeSeriesInfo(seasonData))
                }
            }
            else {
                const data = await onGetXtreamSeriesInfo(movie.id);

                if (data) {
                    const episodes = data.episodes;

                    const seasonData = Object.keys(episodes).map((seasonNumber) => {
                        const seasonEpisodes = episodes[seasonNumber];
                    
                        return {
                            _id: seasonNumber,
                            title: {
                                en: `Season ${seasonNumber}`
                            },
                            series: '', // Fixed: Must be a string to satisfy ISeasons type
                            seasonNumber: parseInt(seasonNumber),
                            episodes: seasonEpisodes.map((episode: {
                                id: string,
                                episode_num: string,
                                title: string,
                                container_extension: string,
                                info: {
                                    plot: string,
                                    movie_image: string,
                                    releasedate: string,
                                    rating: number | string,
                                    season: string,
                                    cover_big: string
                                },
                                season: number,
                                added: string,
                                direct_source: string
                            }) => ({
                                _id: episode.id,
                                image: episode.info.movie_image || episode.info.cover_big || '',
                                season: seasonNumber,
                                title: {
                                    en: episode.title
                                },
                                description: {
                                    en: episode.info.plot || ''
                                },
                                url: makeMovieLink(
                                    makeSeriesLink(),
                                    'movie',
                                    localStorage.getItem('username') as string,
                                    localStorage.getItem('password') as string,
                                    parseInt(episode.id),
                                    episode.container_extension
                                )
                            }))
                        };
                    });
                    

                    setSeasonsInfo(seasonData)
                    dispatch(changeSeriesInfo(seasonData))
                }
            }
        }
        catch (e) {
            console.log(e)
        }
    }


    // get episodes from our server from seriesInfo - memoized to prevent recreation
    const getEpisodes = useCallback(() => {
        if (seasonsInfo && selectedSeason) {
            const season = seasonsInfo.find((season: ISeasons) => season._id === selectedSeason);

            const episodeData = season?.episodes.map((episode: IEpisodes) => {
                return {
                    _id: episode._id,
                    description: {
                        en: episode.description.en,
                    },
                    image: episode.image,
                    season: episode.season,
                    title: {
                        en: episode.title.en,
                    },
                    url: episode.url
                }
            })
            setEpisodes(episodeData)

            dispatch(changeEpisodes(episodeData))
        }
    }, [seasonsInfo, selectedSeason])


    useEffect(() => {
        getSeriesInfo();
    }, [])

    useEffect(() => {
        if (seasonsInfo && selectedSeason) {
            getEpisodes();

            const firstUrl = seasonsInfo?.[0]?.episodes?.[0]?.url as string | undefined;
            if (firstUrl && typeof firstUrl === 'string') {
                localStorage.setItem('first_epiosde', firstUrl);
            } else {
                localStorage.removeItem('first_epiosde');
            }
        }
        else {            
            localStorage.removeItem('first_epiosde');
        }
    }, [seasonsInfo, selectedSeason])

    return (
        seasonsInfo &&
        <div className='series__info'>
            {
                seasonsInfo && <Seasons seasons={seasonsInfo} />
            }

            {
                episodes && <Episodes episodes={episodes} />
            }

        </div>
    )
})

export default SeriesInfo