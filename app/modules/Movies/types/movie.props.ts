import MovieRows from "./movie.rows.interface";

type MovieData = {
    count? : number,
    currentPage? : number,
    isLastPage? : boolean,
    limit? : number,
    pageCount? : number,
    pages? : number[],
    rows : MovieRows[],
   
}


export type MovieComponentProps = {
    movieData: MovieData;
};

export default MovieData