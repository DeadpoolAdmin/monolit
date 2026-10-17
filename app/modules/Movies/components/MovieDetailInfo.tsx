import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import MovieRows from '../types/movie.rows.interface';

const MovieDetailInfo = () => {
    const [movie, setMovie] = useState<MovieRows | null>(null)

    const { id } = useParams();

    const movieDetail = JSON.parse(localStorage.getItem('movie') as string)


    useEffect(() => {
        if (id) {
            setMovie(movieDetail)

        }
    }, [id])



    return (
        <div className="movie__detail__info">
            <div className="movie__detail__info__title">
                <h1>{movie?.name}</h1>
            </div>

            {
                movie?.overview && (
                    <div className="movie__detail__info__content">
                        <span>{movie?.overview}</span>
                    </div>
                )
            }

        </div>
    )
}

export default MovieDetailInfo