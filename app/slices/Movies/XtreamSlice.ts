import { XtreamMovies } from "@/modules/Movies/types/movies.interface";
import { createSlice } from "@reduxjs/toolkit";


const XtreamSlice = createSlice({
    name : 'xtream',
    initialState : {
        categories : null,
        combined_data_movies : null,
        combinded_data_series : null,
        series_categories: null,
        xtream_favorites : [] as XtreamMovies[],
        xtream_movies : null,
        info : null,
        season : 1
    },
    reducers : {
        setXtreamCategories : (state, action) => {
            state.categories = action.payload
        },
        addXtreamMovies : (state, action) => {
            state.xtream_movies = action.payload
        },
        setXtreamCombinedDataMovies : (state, action) => {
            state.combined_data_movies = action.payload
        },
        setXtreamFavorites : (state, action) => {
            state.xtream_favorites.push(action.payload)
        },
        setInfo : (state, action) => {
            state.info = action.payload
        },
        setSeason: (state, action) => {
            state.season = action.payload
        }
    }
})


export const { 
    setXtreamCategories, 
    setXtreamCombinedDataMovies, 
    setXtreamFavorites, 
    addXtreamMovies,
    setInfo ,
    setSeason
} = XtreamSlice.actions;
export default XtreamSlice.reducer;