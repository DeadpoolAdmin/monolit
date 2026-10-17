import {
  useLazyGetMusicsQuery,
  useLazyGetRadioQuery,
} from "@/services/Media/Backend/MediaApi";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { PMusicItem } from "../types/music.types";
import { useLocation, useParams } from "react-router-dom";
import MusicList from "../components/MusicList";
import QueryWrapper from "@/shared/components/QueryWrapper";
import MusicTitle from "../components/MusicTitle";
import MusicPlayerControls from "../components/MusicPlayerControls";
import { useDispatch } from "react-redux";
import { setRootControl } from "@/slices/RootControlSlice";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { setPlaylist, setGlobalPlayerVisible } from "@/slices/Music/musicSlice";

const Musics = React.memo(() => {
  const [getMusics] = useLazyGetMusicsQuery();
  const [getRadios] = useLazyGetRadioQuery();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PMusicItem[] | null>(null);
  const [musicIndex, setMusicIndex] = useState<number>(0);

  const location = useLocation();
  const { id } = useParams();
  const dispatch = useDispatch();

  // Memoize the music data to prevent unnecessary re-renders
  const musicData = useMemo(() => {
    return data as PMusicItem[] | null;
  }, [data]);

  // Memoize the setMusicIndex callback to prevent re-creation
  const handleSetMusicIndex = useCallback((index: number) => {
    setMusicIndex(index);
  }, []);

  // Memoize the fetch functions to prevent re-creation on every render
  const onGetMusics = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const res = await getMusics(id).unwrap();
      if (res) {
        setData(res);
      }
    } catch (error) {
      console.error("Failed to fetch musics:", error);
    } finally {
      setLoading(false);
    }
  }, [getMusics, id]);

  const onGetRadio = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const res = await getRadios(id).unwrap();
      if (res) {
        setData(res);
      }
    } catch (error) {
      console.error("Failed to fetch radios:", error);
    } finally {
      setLoading(false);
    }
  }, [getRadios, id]);

  // Memoize the path check to prevent unnecessary re-calculations
  const isMusic = useMemo(() => {
    return location.pathname.includes("music");
  }, [location.pathname]);

  // Effect to fetch data based on path
  useEffect(() => {
    if (isMusic) {
      onGetMusics();
    } else {
      onGetRadio();
    }
  }, [isMusic, onGetMusics, onGetRadio]);

  // Effect to set root control and playlist when data changes
  useEffect(() => {
    if (data) {
      dispatch(setRootControl(ROOT_CONTROL.MUSIC_PLAYER_CONTROLS));
      dispatch(setPlaylist(data));
      dispatch(setGlobalPlayerVisible(true));
    }
  }, [data, dispatch]);

  return (
    <QueryWrapper
      isLoading={loading}
      isEmpty={!loading && (!musicData || musicData.length === 0)}
    >
      <div className="musics">
        <MusicList 
          musicIndex={musicIndex} 
          setMusicIndex={handleSetMusicIndex} 
          musics={musicData!} 
        />
        <MusicTitle 
          musicIndex={musicIndex} 
          musics={musicData!} 
        />
        {/* <MusicPlayer /> */}
        <MusicPlayerControls 
          musicIndex={musicIndex} 
          setMusicIndex={handleSetMusicIndex} 
          musics={musicData!} 
        />
      </div>
    </QueryWrapper>
  );
});

export default Musics;
