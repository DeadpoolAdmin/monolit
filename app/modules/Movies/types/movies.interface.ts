export interface IMovies {
    rows: {
        id? : number,
        added? : string,
        stream_id : number,
        name : string,
        category_id? : number,
        type? : string
        poster : string
    }
}

export interface XtreamMovies {
    id? : number,
    added? : string,
    stream_id? : number,
    name : string,
    category_id? : number,
    type? : string,
    stream_icon? : string,
    plot?: string,
    youtube_trailer?: string,
    cast?: string,
    poster? : string,
    backdrop? : string,
    overview? : string,
    container_extension? : string,
    url? : string
}


export interface XtreamCategories {
    category_id : number | string,
    category_name : string,
    parent_id : number
    movies : XtreamMovies[];
}

export interface XtreamSeries {
    name: string
    poster: string
    director: string
    backdrop: string | string[]
    id: string | number
    type: 'series'
    category_id: string | number
    episode_run_time: number | string,
    overview: string,
    youtube_trailer: string,
    cast: string,
    stream_id: number | string,
    container_extension: string,
}

