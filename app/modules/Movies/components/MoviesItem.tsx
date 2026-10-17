import React, { useCallback, useMemo } from 'react'

import { useDispatch } from 'react-redux'

import error_movie from '@/assets/movie_error.png'
import { useNavigate } from 'react-router-dom'
import { useGenerateUrl } from '@hotel-smarters/generatefileurl'
import { usePolyfillSearchParams } from '@hotel-smarters/polyfill-search-params'
import MovieRows from '../types/movie.rows.interface'
import { setRootControl } from '@/slices/RootControlSlice'
import { setMovieDetail } from '@/slices/Movies/MovieDetailSlice'
import ResizeImage from '@/shared/components/ResizeImage/ResizeImage'

type PMovieItem = {
  id: number
  style: React.CSSProperties
  isActive: boolean
  item: MovieRows
}

const MoviesItem: React.FC<PMovieItem> = React.memo(({ style, isActive, item, id }) => {
  const dispatch = useDispatch();
  const elementRef = React.useRef<HTMLDivElement>(null);


  const { getUrl } = useGenerateUrl(process.env.REACT_APP_API_HOST as string);


  const navigate = useNavigate();

  const searchParams = usePolyfillSearchParams();

  // Memoized navigation function to prevent recreation
  const navigateToMovieDetail = useCallback(() => {

    if(!item) return;

    const search = searchParams.toString();
    navigate(`/menu/vod/${item.id}${search ? `?${search}` : ''}`)

    localStorage.setItem('movie', JSON.stringify(item))

    dispatch(setRootControl('play_movies_or_buy'));

    dispatch(setMovieDetail(item));
  }, [navigate, item, dispatch]);


  const movieTitle = useMemo(() =>
    item.title?.en?.substring(0, 25) || item.name?.substring(0, 25),
    [item.title?.en, item.name]
  );

  return (
    item ? 
    <div onClick={navigateToMovieDetail} ref={elementRef} key={id} style={style} className={isActive ? 'movie__item active' : 'movie__item'}>
        <ResizeImage successCb={() => { }} placeholder={error_movie}  format="png" quality={0.5} aspectRatio={true} src={window.VOD_SOURCE === 'xtream' || window.VOD_SOURCE === 'm3u8' ? item.poster : getUrl(item.poster ? item.poster : '')} />    
        <p style={{ fontSize: '2.5rem' }} className='movie__name'>{movieTitle}</p>
    </div>
    :
    <></>
  )
})

export default MoviesItem