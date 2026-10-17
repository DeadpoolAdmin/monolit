export interface ISeasons {
    _id : string
    seasonNumber: number
    series : string
    title : {
        en : string,
    },
    episodes : IEpisodes[],
}


export interface IEpisodes {
    _id : string
    description : {
        en : string,
    }
    image : string
    season : string
    title : {
        en : string,
    }
    url : string
}