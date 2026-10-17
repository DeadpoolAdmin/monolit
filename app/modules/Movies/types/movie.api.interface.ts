interface ApiMovieRows {
    _id : string
    title : {
        en : string,
        fr: string,
    }
    backdrop : string
    description: {
        en : string,
        fr: string,
    }
    genres: string[]
    price : number
    url : string
    poster : string,
    seasons?: any[]
}

export default ApiMovieRows