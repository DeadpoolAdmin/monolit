import { useKeydown } from '@hotel-smarters/use-key-down-control'
import React, { useEffect, useMemo, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { ListView } from 'smarters-ino-ui-tv'

import not_found from '@assets/smarters.png'
import { PMusicItem } from '../types/music.types'
import useAspectRatio from '@/shared/hooks/useAspectRatio'
import { useGenerateUrl } from '@hotel-smarters/generatefileurl'
import { setPrevRootControl, setRootControl } from '@/slices/RootControlSlice'
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL'

interface MusicListProps {
    musics: PMusicItem[];
    musicIndex: number;
    setMusicIndex: (index: number) => void;
}

const MusicList: React.FC<MusicListProps> = React.memo(({ musics, musicIndex }) => {
    const { getDimensions } = useAspectRatio(40);
    const { getUrl } = useGenerateUrl(process.env.REACT_APP_API_HOST as string);
    const rootControl = useSelector((state: any) => state.rootControl.rootControl);
    const dispatch = useDispatch();

    // Memoize list styles to prevent recalculation on every render
    const listStyles = useMemo(() => {
        const dimensions = getDimensions();
        return {
            width: dimensions.width,
            height: dimensions.width,
            gap: 18
        };
    }, [getDimensions]);

    // Memoize the dispatch effect
    useEffect(() => {
        dispatch(setRootControl(ROOT_CONTROL.MUSIC_PLAYER));
    }, [dispatch]);

    // Memoize control handlers
    const handleDown = useCallback(() => {
        dispatch(setRootControl(ROOT_CONTROL.MUSIC_TRACK_FILL));
    }, [dispatch]);

    const handleUp = useCallback(() => {
        dispatch(setPrevRootControl(rootControl));
        dispatch(setRootControl(ROOT_CONTROL.MUSIC_CATEGORIES));
    }, [dispatch, rootControl]);

    const handleLeft = useCallback(() => {
        // Empty function - memoized to prevent re-creation
    }, []);

    // Memoize controls object
    const controls = useMemo(() => ({
        isActive: rootControl === ROOT_CONTROL.MUSIC_TRACKS,
        id: 'list-controls',
        down: handleDown,
        up: handleUp
    }), [rootControl, handleDown, handleUp]);

    useKeydown(controls);

    // Memoize image error handler
    const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const target = e.target as HTMLImageElement;
        target.src = not_found;
    }, []);

    // Memoize image styles
    const imageStyles = useMemo(() => ({
        width: '100%',
        height: '100%',
        objectFit: 'cover' as const,
        transition: '.3s ease'
    }), []);

    // Memoize render item function to prevent re-creation
    const renderItem = useCallback(({ style, item, isActive }: {
        style: React.CSSProperties;
        item: PMusicItem;
        isActive: boolean;
        index: number;
    }) => (
        <div className={`music__list__item ${isActive ? 'active' : ''}`} key={item._id} style={style}>
            <img 
                src={getUrl(item.image)}
                onError={handleImageError}
                style={imageStyles}
                alt={item.title || 'Music item'}
            />
        </div>
    ), [getUrl, handleImageError, imageStyles]);

    // Memoize ListView props to prevent unnecessary re-renders
    const listViewProps = useMemo(() => ({
        data: musics,
        id: "music-radio-list",
        uniqueKey: "music-radio-list",
        listType: 'horizontal' as const,
        debounce: 100,
        nativeControle: false,
        itemsCount: musics.length,
        itemsTotal: musics.length,
        gap: listStyles.gap,
        itemWidth: listStyles.width,
        itemHeight: listStyles.height,
        isActive: rootControl === ROOT_CONTROL.MUSIC_TRACKS,
        buffer: 10,
        rowGap: listStyles.gap,
        initialActiveIndex: musicIndex,
        onBackScrollIndex: null,
        startScrollIndex: 0,
        direction: "ltr" as const,
        onLeft: handleLeft,
        renderItem
    }), [
        musics, 
        listStyles.gap, 
        listStyles.width, 
        listStyles.height, 
        rootControl, 
        musicIndex, 
        handleLeft, 
        renderItem
    ]);

    return (
        <div className='music__list'>
            <ListView {...listViewProps} />
        </div>
    );
}, (prevProps, nextProps) => {
    // Custom comparison for better memoization
    return (
        prevProps.musicIndex === nextProps.musicIndex &&
        prevProps.musics === nextProps.musics &&
        prevProps.musics.length === nextProps.musics.length
    );
});

export default MusicList