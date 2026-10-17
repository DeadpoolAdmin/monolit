import { createSlice } from "@reduxjs/toolkit";

const movieDetailSlice = createSlice({
    name : 'movie_detail',
    initialState : {
        movie : null,
        permission : null,
        favorites: null,
        selectedSeason : null,
        movieMainBlock : null,
        rootMovie : null,
        isSeasonsOpen : false,
        seriesInfo: null,
        episodes: null,
    },
    reducers : {
        setMovieDetail : (state, action) => {
            state.movie = action.payload
        },
        setPermissionMovie : (state, action) => {
            state.permission = action.payload
        },
        setFavoriteMovie : (state, action) => {
            state.favorites = action.payload
        },
        changeSelectedSeason : (state, action) => {
            state.selectedSeason = action.payload
        },
        setMovieMainBlock : (state, action) => {
            state.movieMainBlock = action.payload
        },
        setRootMovie : (state, action) => {
            state.rootMovie = action.payload
        },
        setIsSeasonsOpen : (state, action) => {
            state.isSeasonsOpen = action.payload
        },
        changeSeriesInfo : (state, action) => {
            state.seriesInfo = action.payload
        },
        changeEpisodes : (state, action) => {
            state.episodes = action.payload
        }
    }
})

export const { setMovieDetail, setPermissionMovie, setFavoriteMovie, changeSelectedSeason, setMovieMainBlock, setRootMovie, setIsSeasonsOpen, changeSeriesInfo, changeEpisodes } = movieDetailSlice.actions;
export default movieDetailSlice.reducer;