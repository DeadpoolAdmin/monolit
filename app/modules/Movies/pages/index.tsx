import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { usePolyfillSearchParams } from "@hotel-smarters/polyfill-search-params";
import { XtreamCategories, XtreamMovies } from "../types/movies.interface";
import { useDispatch } from "react-redux";
import MovieData from "../types/movie.types";
import {
  useLazyGetXtreamMovieCategoriesQuery,
  useLazyGetXtreamMoviesQuery,
  useLazyGetXtreamSeriesCategoriesQuery,
  useLazyGetXtreamSeriesQuery,
} from "@/services/Media/PlaylistApi/PlaylistApi";
import {
  useLazyGetM3MoviesQuery,
  useLazyGetM3SeriesQuery,
  useLazyGetMoviesQuery,
  useLazyGetSeriesQuery,
} from "@/services/Media/Backend/MediaApi";

import movie_error from "@/assets/movie_error.png";
import ApiMovieRows from "../types/movie.api.interface";
import { setM3u8Combined, setM3u8Movies } from "@/slices/Movies/M3u8Slice";
import { setRootControl } from "@/slices/RootControlSlice";
import {
  addXtreamMovies,
  setXtreamCombinedDataMovies,
} from "@/slices/Movies/XtreamSlice";
import MovieRows from "../types/movie.rows.interface";
import { setMovieDetail } from "@/slices/Movies/MovieDetailSlice";
import QueryWrapper from "@/shared/components/QueryWrapper";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import MoviesMain from "../components/MoviesMain";
import Empty from "@/shared/components/Empty";

function shuffleArray(array: XtreamMovies[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
}

const Movies: React.FC = () => {
  // redux dispatch
  const dispatch = useDispatch();

  // state -> setState()
  const [movies, setMovies] = useState<MovieData | null>();
  const [combinedData, setCombinedData] = useState<XtreamCategories[] | null>(
    null
  );


  // rtk queries (xtream)
  const [
    getXtreamMovies,
    { data: movieData, isLoading: movieLoading},
  ] = useLazyGetXtreamMoviesQuery();
  const [
    getXtreamSeries,
    { data: seriesData, isLoading: seriesLoading },
  ] = useLazyGetXtreamSeriesQuery();

  // rtk queries to get movies and series from api
  const [
    getMovies,
    { data: apiMovieData, isLoading: apiMovieLoading, isError: apiMovieError },
  ] = useLazyGetMoviesQuery();
  const [
    getSeries,
    {
      data: apiSeriesData,
      isLoading: apiSeriesLoading,
      isError: apiSeriesError,
    },
  ] = useLazyGetSeriesQuery();

  // rtk queries (xtream)
  const [
    getXtreamSeriesCategories,
    {
      data: xtreamSeriesCategoryData,
      isLoading: xtreamSeriesCategoryLoading,
      isError: xtreamSeriesCategoryError,
    },
  ] = useLazyGetXtreamSeriesCategoriesQuery();
  const [
    getXtreamMovieCategories,
    {
      data: xtreamMovieCategoryData,
      isLoading: xtreamMovieCategoryLoading,
      isError: xtreamMovieCategoryError,
    },
  ] = useLazyGetXtreamMovieCategoriesQuery();

  //rtk queries(m3u8)
  const [
    getM3Movies,
    { data: m3MoviesData, isLoading: m3MoviesLoading },
  ] = useLazyGetM3MoviesQuery();
  const [
    getM3Series,
    { data: m3SeriesData, isLoading: m3SeriesLoading },
  ] = useLazyGetM3SeriesQuery();

  const navigate = useNavigate();

  // Trigger queries based on VOD_SOURCE
  useEffect(() => {
    try {
      if (!window.VOD_SOURCE) return;

      if (window.VOD_SOURCE === "xtream") {
        getXtreamMovies(undefined);
        getXtreamSeries(undefined);
        getXtreamMovieCategories(undefined);
        getXtreamSeriesCategories(undefined);
      } else if (window.VOD_SOURCE === "api") {
        getMovies(undefined);
        getSeries(undefined);
      } else if (window.VOD_SOURCE === "m3u8") {
        getXtreamMovies(undefined);
        getXtreamSeries(undefined);
        getM3Movies(undefined);
        getM3Series(undefined);
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  const searchParams = usePolyfillSearchParams();

  // function to get xtreamMovies with rtk query for caching
  function processXtreamMovies() {
    try {
      const movies = {
        rows:
          movieData && movieData.length
            ? movieData.map((item: any) => {
                return {
                  name: item.name,
                  poster: item.stream_icon,
                  backdrop: item.stream_icon,
                  id: item.stream_id,
                  type: item.stream_type,
                  category_id: item.category_id,
                  overview: item.overview,
                  container_extension: item.container_extension,
                  url: item.url,
                };
              })
            : [],
      };

      const series =
        seriesData && seriesData.length
          ? seriesData.map((serie: any) => {
              return {
                name: serie.name,
                poster: serie.cover,
                director: serie.director,
                backdrop:
                  serie.backdrop_path && serie.backdrop_path.length
                    ? serie.backdrop_path.join("")
                    : null,
                id: serie.series_id,
                type: "series",
                category_id: serie.category_id,
                episode_run_time: serie.episode_run_time,
                overview: serie.plot,
                youtube_trailer: serie.youtube_trailer,
                cast: serie.cast,
                stream_id: serie.series_id,
                container_extension: serie.container_extension,
                url: "",
              };
            })
          : [];

      const combinedMedia = movies.rows.concat(series);

      shuffleArray(combinedMedia);

      setMovies({
        rows: combinedMedia.map((item: XtreamMovies) => {
          return {
            id: item.id,
            name: item.name,
            poster: item.poster !== "" ? item.poster : movie_error,
            backdrop: item.backdrop,
            type: item.type,
            category_id: item.category_id,
            plot: item.plot,
            youtube_trailer: item.youtube_trailer,
            cast: item.cast,
            stream_id: item.id,
            overview: item.overview,
            container_extension: item.container_extension,
          };
        }),
      });
    } catch (e) {
      console.log(e);
    }
  }

  // function to get m3u8 movies
  function processM3Movies(movieData: any, serieData: any) {
    const movies = {
      rows: movieData.data.map((item: any) => {
        return {
          id: item.id,
          name: item.name,
          poster: item.logo,
          backdrop: item.logo,
          type: "movie",
          container_extension: item.container_extension,
          url: item.url,
          group: item.group,
        };
      }),
    };

    const series = {
      rows: serieData.data.map((item: any) => {
        return {
          id: item.id,
          name: item.name,
          poster: item.logo,
          backdrop: item.logo,
          type: "series",
          container_extension: item.container_extension,
          url: item.url,
          group: item.group,
        };
      }),
    };

    const combinedMedia = movies.rows.concat(series);

    shuffleArray(combinedMedia);

    setMovies({
      rows: combinedMedia.map((item: any) => {
        return {
          id: item.id,
          name: item.name,
          poster: item.poster !== "" ? item.poster : movie_error,
          backdrop: item.backdrop,
          type: item.type,
          category: item.group,
          url: item.url,
        };
      }),
    });
  }

  //function to get moviesList from API
  function getCombinedMoviesList() {
    if (!apiMovieError && !apiSeriesError) {

      const movies =
        apiMovieData && apiMovieData.length
          ? apiMovieData.map((item: ApiMovieRows) => {
              return {
                id: item._id,
                name: item.title.en,
                type: "movies",
                poster: item.poster,
                overview: item.description.en,
                backdrop: item.backdrop,
                price: item.price,
                url: item.url,
                vod_geners: item.genres?.map((vod: any) => {
                  return {
                    genre_id: vod._id,
                    name: vod.name,
                  };
                }),
              };
            })
          : [];

      const series =
        apiSeriesData && apiSeriesData.length
          ? apiSeriesData.map((item: any) => {
              return {
                id: item._id,
                name: item.title.en,
                poster: item.poster,
                type: "series",
                backdrop: item.backdrop,
                genre: item.genres,
                seasons: item.seasons,
                overview: item.description.en,
              };
            })
          : [];

      const combinedMedia = movies.concat(series);

      shuffleArray(combinedMedia);

      setMovies({
        rows: combinedMedia,
      });

      localStorage.setItem("movies_series", JSON.stringify(combinedMedia));
    }
  }

  // function to get m3u8 movies
  function m3u8CombinedDataMovies() {
    if (m3MoviesData.error || m3SeriesData.error) {
      return;
    }

    const moviesCategories = m3MoviesData.groups;
    const seriesCategories = m3SeriesData.groups;

    const combinedCategories = moviesCategories.concat(seriesCategories);

    const newCombinedData = combinedCategories.map(
      (category: any, i: number) => {
        return {
          category_id: i,
          category_name: category,
          parent_id: i,
          movies: movies
            ? (movies.rows.filter(
                (row: any) => row.category === category
              ) as XtreamMovies[])
            : [],
        };
      }
    );

    dispatch(setM3u8Combined(newCombinedData));
  }

  //function to get Xtream movies categories
  function xtreamCombinedDataMovies(
    moviesCategories: XtreamCategories[],
    seriesCategories: XtreamCategories[]
  ) {
    if (xtreamMovieCategoryError || xtreamSeriesCategoryError) {
      return;
    }

    try {
      const combinedCategories = moviesCategories.concat(seriesCategories);

      const newCombinedData = combinedCategories.map(
        (category: XtreamCategories) => {
          return {
            ...category,
            category_id: category.category_id,
            category_name: category.category_name,
            parent_id: category.parent_id,
            movies: movies
              ? (movies.rows.filter(
                  (row: any) => row.category_id === category.category_id
                ) as XtreamMovies[])
              : [],
          };
        }
      );

      setCombinedData(newCombinedData);
    } catch (e) {}
  }

  useEffect(() => {
    const fromAPI = window.VOD_SOURCE === "api";

    if (fromAPI) {
      if (apiMovieData) {
        getCombinedMoviesList();
      }
    }
  }, [apiMovieData, apiSeriesData]);

  // useEffects
  useEffect(() => {
    if (window.VOD_SOURCE === "xtream") {
      processXtreamMovies();
      return;
    }

    if ((localStorage.getItem("isM3u8") as string) === "true") {
      return;
    }
  }, [movieData]);

  useEffect(() => {
    if (movies) {
      dispatch(addXtreamMovies(movies.rows));
      dispatch(setM3u8Movies(movies.rows));
    }
  }, [movies]);

  useEffect(() => {
    if (m3MoviesData && m3SeriesData) {
      processM3Movies(m3MoviesData, m3SeriesData);
    }
  }, [m3MoviesData, m3SeriesData]);

  useEffect(() => {
    if (window.VOD_SOURCE === "xtream") {
      if (combinedData) {
        dispatch(setXtreamCombinedDataMovies(combinedData));
      }
    }
  }, [combinedData, window.VOD_SOURCE]);

  useEffect(() => {
    if (window.VOD_SOURCE === "xtream") {
      if (xtreamSeriesCategoryData && xtreamMovieCategoryData && movies) {
        xtreamCombinedDataMovies(
          xtreamMovieCategoryData,
          xtreamSeriesCategoryData
        );
      }

      return;
    }

    if (window.VOD_SOURCE === "m3u8") {
      if (
        m3MoviesData &&
        !m3MoviesData.error &&
        m3SeriesData &&
        !m3SeriesData.error &&
        movies
      ) {
        m3u8CombinedDataMovies();
      }
    }
  }, [
    xtreamSeriesCategoryData,
    xtreamMovieCategoryData,
    movies,
    window.VOD_SOURCE,
    m3MoviesData,
    m3SeriesData,
  ]);

  const navigateToMovieDetail = (item: MovieRows) => {

    if(!item) return;

    const search = searchParams.toString();
    navigate(`/menu/vod/${item.id}${search ? `?${search}` : ""}`);

    dispatch(setMovieDetail(item));
  };

  useEffect(() => {
    window.addEventListener("movie-tapped", (e: Event) => {
      const event = e as CustomEvent;
      navigateToMovieDetail(event.detail);

      localStorage.setItem("movie", JSON.stringify(event.detail));
    });

    return () => {
      window.addEventListener("movie-tapped", (e: Event) => {
        const event = e as CustomEvent;

        navigateToMovieDetail(event.detail);
      });
    };
  }, []);


  if(!window.VOD_SOURCE) {
    return <Empty />;
  }

  return (
    <QueryWrapper
      isLoading={seriesLoading || movieLoading || apiMovieLoading || apiSeriesLoading || xtreamMovieCategoryLoading || xtreamSeriesCategoryLoading || m3MoviesLoading || m3SeriesLoading}
      isEmpty={!movies}
    >
      <div className="movies">
        <div className="movies__container">
          <MoviesMain movieData={movies!} />
        </div>
      </div>
    </QueryWrapper>
  );
};

export default Movies;
