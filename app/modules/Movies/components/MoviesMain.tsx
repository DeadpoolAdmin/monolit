import React, { useEffect, useState } from 'react'


import { useKeydown } from '@hotel-smarters/use-key-down-control'
import { useNavigate } from 'react-router-dom'
import { useResolution } from '@hotel-smarters/resolution-hook'
import { usePolyfillSearchParams } from '@hotel-smarters/polyfill-search-params'
import useAspectRatio from '@/shared/hooks/useAspectRatio'
import { MovieComponentProps } from '../types/movie.types'
import { useDispatch } from 'react-redux'
import MovieRows from '../types/movie.rows.interface'
import { setPrevRootControl, setRootControl } from '@/slices/RootControlSlice'
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL'
import { useSelector } from 'react-redux'
import { GridView } from 'smarters-ino-ui-tv'
import { setCurrentRow } from '@/slices/Movies/MovieCurrentRow'
import MoviesItem from './MoviesItem'

import 'smarters-ino-ui-tv/dist/main.css'
import ScrollView from '@/shared/components/ScrollView/ScrollView'

let transform_timeout: NodeJS.Timeout | null = null

export const gridStyles = {
  itemHeight: 45,
  itemWidth: 30,
  rowMargin: 14,
  elementMargin: 3
}

// const ScrollView = React.lazy(() => import('scrollview/ScrollView'));

const MoviesMain: React.FC<MovieComponentProps> = ({ movieData }) => {
  const [searchValue, setSearchValue] = useState('')

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const searchParams = usePolyfillSearchParams();

  const { getDeviceType } = useResolution();

  const deviceType = getDeviceType();

  const [filteredData, setFilteredData] = useState<MovieRows[]>([])

  const [activeIndex, setActiveIndex] = useState(0);

  const rootControl = useSelector((state : any) => state.rootControl.rootControl);

  useEffect(() => {
    // initially control movies__list
    dispatch(setRootControl(ROOT_CONTROL.MOVIES_LIST));
  }, []);

  const navigateToMovieDetail = (item: MovieRows) => {

    if(!item) return;

    localStorage.setItem('movie', JSON.stringify(item))

    const search = searchParams.toString();

    navigate(`${item.id}${search ? `?${search}` : ''}`, {
      replace: true
    })
  }


  const onUp = () => {
    dispatch(setPrevRootControl(rootControl))

    dispatch(setRootControl(ROOT_CONTROL.HEADER_BACK))
  }

  const control = {
    isActive: rootControl === ROOT_CONTROL.MOVIES_LIST,
    id: 'movies__list',
  }

  useKeydown(control)

  const onSearch = (e: Event) => {
    const event = e as CustomEvent;

    setSearchValue(event.detail)
  }


  useEffect(() => {
    window.addEventListener('search', onSearch)

    return () => {
      window.removeEventListener('search', onSearch)
    }
  }, [])

  useEffect(() => {
    if (movieData) {
      if (searchValue) {
        const filtered = movieData.rows.filter((item) => item?.name?.toLowerCase().includes(searchValue.toLowerCase()));
        setFilteredData(filtered);
      } else {
        setFilteredData(movieData.rows);
      }
    }
  }, [movieData, searchValue])



  return (
    <div className='movies__main' style={{
      left: deviceType === 'TV' ? '13.5rem' : '7rem',
      height: deviceType === 'TV' ? 'var(--screen-height)' : '95%',
    }}>
      {
        deviceType === 'TV' ? (
          <GridView
            id="movies-grid-vview"
            uniqueKey="grid-view-movies"
            scrollOffset={gridStyles.itemHeight}
            data={filteredData}
            isActive={rootControl === ROOT_CONTROL.MOVIES_LIST}
            rowItemsCount={5}
            rowCount={1}
            onIndexChange={(index) => {
              setActiveIndex(index)
            }}
            direction="ltr"
            onBack={() => {
              if (activeIndex === 0) {
                const search = searchParams.toString();
                navigate(`/menu${search ? `?${search}` : ''}`)
              }
              return true;
            }}
            itemWidth={gridStyles.itemWidth}
            itemHeight={gridStyles.itemHeight}
            rowGap={gridStyles.rowMargin}
            gap={gridStyles.elementMargin}
            bufferStart={6}
            bufferEnd={6}
            debounce={400}
            onUp={onUp}
            nativeControle={true}
            onChangeRow={(row: number) => {
              dispatch(setCurrentRow(row));
            }}
            initialActiveIndex={0}
            onOk={(item) => { navigateToMovieDetail(item) }}
            renderItem={({ item, isActive, style, key }) => (
              <MoviesItem
                id={item.id}
                item={item}
                key={key}
                style={style}
                isActive={isActive}

              />
            )}
          />
        )

          :
          <ScrollView
            style={{
              position: 'relative',
              left: '2rem'
            }}
            data={searchValue ? movieData.rows.filter((item) => item?.name?.toLowerCase().includes(searchValue.toLowerCase())) : movieData.rows}
            width={192}
            height={80}
            dimension={'vh'}
            type={'gird-movies'}
            listType={'grid'}
            
            renderItem={({ item, isActive, style, key }: {
              item: MovieRows;
              isActive: boolean;
              style: React.CSSProperties;
              key: React.Key;
            }) => (
              <MoviesItem
                id={item.id as number}
                item={item}
                key={key}
                style={{
                  ...style,
                  width: gridStyles.itemWidth + 'rem',
                  height: gridStyles.itemHeight + 'rem',
                  paddingBottom: '2rem',
                  position: 'relative',
                  left: '2rem',
                  marginTop: '5rem'
                }}
                isActive={isActive}
              />
            )}
          />
      }


    </div>
  )
}

export default MoviesMain