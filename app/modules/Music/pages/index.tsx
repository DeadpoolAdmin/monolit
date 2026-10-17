import { useLazyGetGenresQuery } from "@/services/Media/Backend/MediaApi";
import QueryWrapper from "@/shared/components/QueryWrapper";
import React, { useEffect, useMemo, useState } from "react";
import CategoriesContent from "../components/CategoriesContent";
import { useDispatch } from "react-redux";
import { setRootControl } from "@/slices/RootControlSlice";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import Genres from "../types/genres.interface";
import { useLocation } from "react-router-dom";

const MusicCategories = React.memo(() => {
  const [getMusicCategories] = useLazyGetGenresQuery();

  const [loading, setLoading] = useState(false);

  const [musicGenres, setMusicGenres] = useState<any[]>([]);

  const dispatch = useDispatch();

  const location = useLocation();

  const isMusic = useMemo(() => {
    return location.pathname.includes("music");
  }, [location.pathname]);


  const onGetMusicGenres = async () => {
    setLoading(true);

    try {
      const res = await getMusicCategories({}).unwrap();

      if (res) {
        const genres = res
          .filter((genre: Genres) => isMusic ? genre.type === "music" : genre.type === "radio")
          .map((genre: Genres) => ({
            _id: genre._id,
            name: genre.name,
            type: genre.type,
            orgId: genre.orgId,
            image: genre.image,
          }));
        setMusicGenres(genres);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    onGetMusicGenres();
  }, []);

  useEffect(() => {
    dispatch(setRootControl(ROOT_CONTROL.MUSIC_CATEGORIES));
  }, []);

  return (
    <QueryWrapper
      isLoading={loading}
      isEmpty={!musicGenres || musicGenres.length === 0}
    >
      <div className="categories">
        <CategoriesContent all={musicGenres} />
      </div>
    </QueryWrapper>
  );
});

export default MusicCategories;
