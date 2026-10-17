import React from 'react'
import VideoPlayer from '../components/VideoPlayer'

const MovieVideoPlayer = () => {
    return (
        <VideoPlayer
            url={localStorage.getItem('movie__link') as string}
            mediaType={'movie'}
        />
    )
}

export default MovieVideoPlayer