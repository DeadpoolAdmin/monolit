import React, { useCallback, useMemo, useState } from 'react'
import { ListView } from 'smarters-ino-ui-tv'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useKeydown } from '@hotel-smarters/use-key-down-control'
import { useResolution } from '@hotel-smarters/resolution-hook';
import { usePolyfillSearchParams } from '@hotel-smarters/polyfill-search-params'
import { IEpisodes } from '../types/seasons.interface'
import useAspectRatio from '@/shared/hooks/useAspectRatio'
import { setRootControl } from '@/slices/RootControlSlice'
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL'
import EpisodeItem from './EpisodeItem'
import ScrollView from '@/shared/components/ScrollView/ScrollView'

type Episodes = {
    episodes: IEpisodes[]
}

// const ScrollView = React.lazy(() => import('scrollview/ScrollView'));

const Episodes: React.FC<Episodes> = React.memo(({ episodes }) => {
    const dispatch = useDispatch();

    const { getDimensions } = useAspectRatio(75);
    const { getDimensions: getDimensionsHeight } = useAspectRatio(62);


    const { getDeviceType } = useResolution();

    const rootControl = useSelector((state: any) => state.rootControl.rootControl)

    const deviceType = getDeviceType();

    const navigate = useNavigate();

    const searchParams = usePolyfillSearchParams();

    const [activeIndex, setActiveIndex] = useState(0);

    // Memoized navigation function to prevent recreation on every render
    const navigatePlayer = useCallback((item: IEpisodes) => {
        if (item.url) {
            localStorage.setItem('movie__link', item.url)

            // dispatch(setCurrentControl('video-player'))

            const search = searchParams.toString();
            navigate(`player${search ? `?${search}` : ''}`)
        }
    }, [navigate])

    // Memoized controls object to prevent recreation
    const controls = useMemo(() => ({
        isActive: rootControl === ROOT_CONTROL.MOVIE_EPISODES,
        id: 'unique-id-episodes',
        up: () => {
            dispatch(setRootControl(ROOT_CONTROL.MOVIES_SEASONS))
        }
    }), [rootControl, dispatch])

    useKeydown(controls)

    // Memoized dimensions to fix Rules of Hooks violation
    const itemWidth = useMemo(() => getDimensions().width, [getDimensions]);
    const itemHeight = useMemo(() => getDimensionsHeight().height, [getDimensions]);

    return (
        episodes &&
        <div className='episodes' style={{
            height: deviceType === 'TABLET' ? '60vh' : undefined
        }}>
            {
                deviceType === 'TV' ?

                    <ListView
                        id='api__episodes'
                        uniqueKey='episodes'
                        data={episodes}
                        itemsTotal={episodes.length}
                        itemsCount={10}
                        listType='horizontal'
                        isActive={rootControl === 'episodes'}
                        buffer={10}
                        gap={4}
                        onOk={(item) => navigatePlayer(item)}
                        initialActiveIndex={0}
                        startScrollIndex={1}
                        onIndexChange={(index) => setActiveIndex(index)}
                        itemWidth={itemWidth}
                        itemHeight={itemHeight}
                        nativeControle={true}
                        onBack={() => {
                            if (activeIndex === 0) {
                                const search = searchParams.toString();
                                navigate(`/menu/vod${search ? `?${search}` : ''}`)
                            }
                            return true;
                        }}
                        renderItem={({ index, style, isActive, item, key }) => (
                            <EpisodeItem index={index} key={key.toString()} style={style} isActive={isActive} item={item} />
                        )}

                    />

                    :

                    <ScrollView
                        data={episodes}
                        height={40}
                        width={itemWidth}
                        dimension={'rem'}
                        type={'list-movies'}
                        listType={'horizontal-list'}
                        renderItem={({ style, item, isActive, key }) => (
                            <EpisodeItem
                                index={key as number}
                                item={item}
                                key={key as string}
                                style={{
                                    ...style,
                                    width: getDimensions().width + 'rem',
                                    height: getDimensionsHeight().height + 'rem',
                                    margin: '0 1rem'
                                }}
                                isActive={isActive}
                            />
                        )}
                    />
            }


        </div>
    )
})

export default Episodes