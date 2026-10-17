export const isXtream = false

function extractBaseURL(text : string) {
    var regex = /https?:\/\/[^\/]+/;
    var result = regex.exec(text);
    return result ? result[0] : null;
}


export const makeMovieLink = (url : string, type : string = 'movie', username : string, password : string,stream_id : number, extension : string) => {
    return `${extractBaseURL(url)}/${type}/${username}/${password}/${stream_id}.${extension}`
}