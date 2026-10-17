import { ISeasons } from "./seasons.interface"

interface MovieRows {
    backdrop? : string
    createdAt? : string
    id? : number
    _id? : number
    name? : string
    title? : Record<string, string>
    organization_id? : number
    overview? : string
    poster? : string
    price? : number
    runtime? : number
    tmdb_id? : number | string
    seasons? : ISeasons[]
    type? : string
    container_extension? : string
    updatedAt? : string
    url? : string
    year? : string
    vod_geners?: [{id : number, genre_id : number, vod_id : number, createdAt : string, updatedAt : string}]
}


export default MovieRows