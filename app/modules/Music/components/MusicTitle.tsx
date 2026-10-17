import React, { useMemo } from 'react'
import { PMusicItem } from '../types/music.types'

interface MusicTitleProps {
    musicIndex: number;
    musics: PMusicItem[];
}

const MusicTitle = React.memo<MusicTitleProps>(({ musicIndex, musics }) => {
    // Memoize the current music to prevent unnecessary re-renders
    const currentMusic = useMemo(() => {
        return musics[musicIndex] || { title: '', authorName: '' };
    }, [musics, musicIndex]);

    // Memoize the title and author to prevent re-computation
    const { title, authorName } = useMemo(() => ({
        title: currentMusic.title,
        authorName: currentMusic.authorName
    }), [currentMusic]);

    return (
        <div className='music__title'>
            <div className="track__name">
                <span>{title}</span>
            </div>
            <div className="author__name">
                <span>{authorName}</span>
            </div>
        </div>
    )
}, (prevProps, nextProps) => {
    // Custom comparison function for better memoization
    return (
        prevProps.musicIndex === nextProps.musicIndex &&
        prevProps.musics === nextProps.musics &&
        prevProps.musics[prevProps.musicIndex]?.title === nextProps.musics[nextProps.musicIndex]?.title &&
        prevProps.musics[prevProps.musicIndex]?.authorName === nextProps.musics[nextProps.musicIndex]?.authorName
    );
});

export default MusicTitle