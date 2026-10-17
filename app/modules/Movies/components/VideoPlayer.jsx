import React, {
  memo,
  forwardRef,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
} from "react";
import { useKeydown } from "@hotel-smarters/use-key-down-control";
import {
  addSecondsToTime,
  convertTime,
  totalTime,
} from "@shared/functions/convertTime";

import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setRootControl } from "@/slices/RootControlSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AppPlayer } from "@hotel-smarters/player";

import VideoControl from "./VideoControl.jsx";
import { Load } from "@/shared/components/Loading/Loader";

const PLAYER_STYLES = {
  position: "fixed",
  zIndex: 999,
  background: "black",
  height: "100vh",
  width: "100%",
};

let timeout = null;
let tizen_timeout = null;
let control_timeout = null;

const VideoPlayer = ({ url, mediaType }) => {
  const movie = JSON.parse(localStorage.getItem("movie"));

  const [playerType, setPlayerType] = useState("");
  const [playing, setPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(null);
  const [permiteOK, setPermiteOK] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const [load, setLoad] = useState(false);

  const params = useParams();

  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const currentTimeRef = useRef(null);
  const durationRef = useRef(null);
  const currentTime = useRef();
  const progressInnerRef = useRef(null);
  const step = useRef(0);
  const timeoutPlay = useRef(null);

  const dispatch = useDispatch();

  const rootMovie = useSelector((state) => state.movieDetailSlice.rootMovie);

  const season = useSelector((state) => state.xtreamSlice.season);

  const controlRef = useRef(null);

  const [loaded, setLoaded] = useState(false);

  const navigate = useNavigate();

  const location = useLocation();

  const [duration, setDuration] = useState(0);

  const [muted, setMuted] = useState(false);

  const seekTimeout = useRef(null);

  const rootControl = useSelector((state) => state.rootControl.rootControl);
  

  const videoPlayerRef = useRef(null);

  const closeControls = () => {
    control_timeout = setTimeout(() => {
      if (controlRef && controlRef.current) {
        controlRef.current.style.opacity = 0;

        clearTimeout(control_timeout);
      }
    }, 7000);
  };

  const openControls = () => {
    // Clear any existing timeout to prevent conflicts
    clearTimeout(control_timeout);

    if (controlRef && controlRef.current) {
      controlRef.current.style.opacity = 1;
    }

    // Set timeout to close controls after 5 seconds
    control_timeout = setTimeout(() => {
      if (controlRef && controlRef.current) {
        controlRef.current.style.opacity = 0;
      }
    }, 5000);
  };

  const continueWatching = (movie) => {
    const selectedSeason = season;
  };

  const onBuffer = () => {
    console.log("bufferr...");
    setIsBuffering(true);
  };

  const onBufferEnd = () => {
    setIsBuffering(false);

    setLoading(false);

    console.log("buffer end....");
  };

  const onPlay = () => {
    clearTimeout(control_timeout);
    closeControls();

    setPlaying(true);

    if ("tizen" in window) {
      if (
        ["READY", "PLAYING", "PAUSED"].indexOf(webapis.avplay.getState()) > -1
      ) {
        webapis.avplay.play();
      }

      return;
    }

    if (window.Android) {
      window.Android.play();
    }
  };

  const onPause = () => {
    const pause = () => {
      if (
        ["READY", "PLAYING", "PAUSED"].indexOf(webapis.avplay.getState()) > -1
      ) {
        webapis.avplay.pause();

        return;
      }

      if (window.Android) {
        window.Android.pause();
      }
    };

    setPlaying(false);
  };

  const onLoadData = () => {
    // if ('tizen' in window) {
    //     webapis.avplay.play()
    // }
    setPlaying(true);
  };

  const onLoadTracks = () => {
    setLoad(true);
  };

  const seekTo = (seconds) => {
    if (!seconds && seconds < 0) return;

    if (window.tizen) {
      if (
        ["IDLE", "READY", "PLAYING", "PAUSED"].indexOf(
          webapis.avplay.getState()
        ) > -1
      ) {
        webapis.avplay.seekTo(seconds * 1000, function () {
          // onSeek();
        });
      }

      return;
    }

    if (window.Android) {
      try {
        window.Android.seekTo(seconds);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const onProgress = (video) => {
    const videoDuration = videoRef?.current?.getInternalPlayer().duration;

    const position = video.playedSeconds / duration;

    currentTime.current = video.playedSeconds;

    if (progressRef && progressRef.current) {
      progressRef.current.style.width = `${position * 100}%`;
    }

    if (currentTimeRef && currentTimeRef.current) {
      currentTimeRef.current.textContent = currentTime.current;

      currentTimeRef.current.textContent = convertTime(
        Math.round(currentTime.current),
        video.duration,
        currentTime.current
      );
    }
  };

  const onReady = (video) => {
    // Check if video is actually loaded and ready
    if (videoRef.current) {
      setIsReady(true);
      setLoading(false);
      closeControls();
      onPlay();

      const v = videoRef?.current?.getInternalPlayer();

      if (durationRef.current) {
        durationRef.current.textContent = totalTime(Math.round(duration));
      }
    }
  };

  const onLoadedData = () => {
    // Additional check when video data is loaded
    setIsReady(true);
    setLoading(false);
    console.log("Video data loaded and ready to play");
  };

  const onEnded = () => {
    onPause();
    // if(window.Android) {
    //   window.Android.destroyPlayer();
    // }

    navigate(-1);

    dispatch(setRootControl("play_movies_or_buy"));
  };

  let startX = 0;
  let startTime = 0;
  let videoDuration = 0;
  let isSeeking = false;

  const touchStart = (e) => {
    // Clear any pending play timeout from previous touch
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }

    // Clear control timeout to keep controls visible during seeking
    if (control_timeout) {
      clearTimeout(control_timeout);
    }

    // Set seeking flag to prevent play/pause conflicts
    isSeeking = true;

    onPause();

    if (window.Android) {
      startTime = Math.round(window.Android.getCurrentTime());
      videoDuration = Math.round(window.Android.getVideoDuration());
    } else {
      const video = videoRef?.current?.getInternalPlayer();
      startTime = Math.round(video?.currentTime || 0);
      videoDuration = Math.round(video?.duration || 0);
    }

    // Show controls without setting close timeout
    if (controlRef && controlRef.current) {
      controlRef.current.style.opacity = 1;
    }

    startX = e.touches[0].clientX;
  };

  const touchMove = (e) => {
    // Clear any pending play timeout
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }

    // Ensure we're paused during seeking
    if (!isSeeking) {
      isSeeking = true;
      onPause();
    }

    const progressElem = progressRef.current;
    const innerThumb = progressInnerRef.current;
    if (!progressElem || !innerThumb || !videoDuration) return;

    const touchX = e.touches[0].clientX;
    const deltaX_px = touchX - startX;

    const progressWidth_px = progressElem.parentElement.offsetWidth;
    const deltaTime = (deltaX_px / progressWidth_px) * videoDuration;

    let newTime = startTime + deltaTime;
    newTime = Math.max(0, Math.min(videoDuration, newTime));

    // Set current time
    if (window.Android) {
      try {
        window.Android.seekTo(Math.floor(newTime));
      } catch (e) {
        console.log(e);
      }
    } else {
      const video = videoRef?.current?.getInternalPlayer();
      if (video) video.currentTime = newTime;
    }

    // Update UI
    const percentage = (newTime / videoDuration) * 100;
    progressElem.style.width = `${percentage}%`;
    innerThumb.style.transform = `translate(-50%, -50%)`;

    console.log("Seeking to:", newTime.toFixed(2), "s");
  };

  const touchEnd = () => {
    // Clear any existing timeout
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }

    // Keep controls open after seeking with proper timeout
    openControls();

    // Reset seeking flag and resume playback after a delay
    timeout = setTimeout(() => {
      isSeeking = false;
      onPlay();
      timeout = null;
    }, 300);
  };

  const onStep = (video) => {
    if (currentTime.current) {
      const position = currentTime.current / video.duration;
      currentTimeRef.current.textContent = currentTime.current;

      currentTimeRef.current.textContent = convertTime(
        Math.round(currentTime.current),
        video.duration,
        currentTime.current
      );

      if (progressRef.current) {
        progressRef.current.style.width = `${position * 100}%`;
      }
    }
  };

  const clearTimeoutPlay = () => {
    if (timeoutPlay.current) {
      clearTimeout(timeoutPlay.current);
      timeoutPlay.current = null;
    }
  };

  const setSeekTime = () => {
    if (seekTimeout.current) {
      clearTimeout(seekTimeout.current);
      seekTimeout.current = null;
    }

    seekTimeout.current = setTimeout(() => {
      try {
        videoRef.current.seekTo(currentTime.current);

        onPlay();

        openControls();

        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }, 1000);
  };

  const video = videoRef?.current?.getInternalPlayer();

  const controls = {
    isActive: rootControl === "video-player",
    id: "video-player-control",
    ok: () => {
      if (loading) return;

      if (playing) {
        onPause();
      } else {
        onPlay();
      }
    },
    right: () => {
      if (control_timeout.current) {
        clearTimeout(control_timeout.current);
        control_timeout.current = null;
      }

      if (seekTimeout.current) {
        clearTimeout(seekTimeout.current);
        seekTimeout.current = null;
      }

      setLoading(true);

      onPause();

      const newTime = Math.min(currentTime.current + 20, duration - 10);

      currentTime.current = newTime;

      const position = newTime / duration;
      progressRef.current.style.width = `${position * 100}%`;

      currentTimeRef.current.textContent = currentTime.current;
      currentTimeRef.current.textContent = convertTime(
        Math.round(currentTime.current),
        duration,
        currentTime.current
      );

      setSeekTime();

      openControls();
    },
    left: () => {
      if (control_timeout.current) {
        clearTimeout(control_timeout.current);
        control_timeout.current = null;
      }

      if (seekTimeout.current) {
        clearTimeout(seekTimeout.current);
        seekTimeout.current = null;
      }

      setLoading(true);

      onPause();

      const newTime = Math.max(currentTime.current - 20, 0);

      currentTime.current = newTime;

      const position = newTime / duration;
      progressRef.current.style.width = `${position * 100}%`;

      currentTimeRef.current.textContent = currentTime.current;
      currentTimeRef.current.textContent = convertTime(
        Math.round(currentTime.current),
        duration,
        currentTime.current
      );

      setSeekTime();

      openControls();
      setLoading(false);
    },
    up: () => {
      openControls();
    },
    down: () => {
      openControls();
    },
    back: () => {
      if (window.Android) {
        window.Android.destroyPlayer();
      }

      navigate(-1);
      dispatch(setRootControl("play_movies_or_buy"));
    },
  };

  useKeydown(controls);

  useEffect(() => {
    const thumb = progressInnerRef.current;
    if (!thumb) return;

    thumb.ontouchstart = touchStart;
    thumb.ontouchmove = touchMove;
    thumb.ontouchend = touchEnd;

    return () => {
      thumb.ontouchstart = null;
      thumb.ontouchmove = null;
      thumb.ontouchend = null;
    };
  }, []);

  useEffect(() => {
    if (rootControl !== "video-player") {
      dispatch(setRootControl("video-player"));
    }
  }, []);

  useEffect(() => {
    if (!isReady) {
      setLoading(true);

      return;
    }
    setLoading(false);

    const item = JSON.parse(localStorage.getItem("coninue_watching"));

    const seriesItem = JSON.parse(
      localStorage.getItem("continue_watching_series")
    );
    const played_episode_id = localStorage.getItem("played_episode_id");

    const v = videoRef?.current?.getInternalPlayer();

    if (item && item.movies.length && movie?.type === "movie") {
      const foundMovie = item?.movies.find((child) => child.id === movie.id);

      if (foundMovie) {
        if ("tizen" in window) {
          let playedSeconds = Math.round(
            webapis.avplay.getCurrentTime() / 1000
          );

          playedSeconds = foundMovie.stopedTime;

          if (isReady) {
            try {
              seekTo(playedSeconds);
            } catch (e) {
              console.log(e);
            }
          }

          return;
        }

        // v.currentTime = foundMovie.stopedTime

        if (window.Android) {
          let playedSeconds = Math.round(window.Android.getCurrentTime());

          playedSeconds = foundMovie.stopedTime;

          if (isReady) {
            try {
              seekTo(playedSeconds);
            } catch (e) {
              console.log(e);
            }
          }

          return;
        }
        v.currentTime = foundMovie.stopedTime;
      }
    }

    if (
      movie?.type === "series" &&
      seriesItem &&
      seriesItem.series.length &&
      played_episode_id
    ) {
      const foundSeries = seriesItem?.series.filter(
        (child) => child.id === played_episode_id
      );

      if (foundSeries) {
        const maxStopedTime = Math.max(
          ...foundSeries.map((child) => child.stopedTime)
        );

        if ("tizen" in window) {
          let playedSeconds = Math.round(
            webapis.avplay.getCurrentTime() / 1000
          );

          playedSeconds = maxStopedTime;

          if (isReady) {
            try {
              seekTo(playedSeconds);
            } catch (e) {
              console.log(e);
            }
          }

          return;
        }

        if (window.Android) {
          let playedSeconds = Math.round(window.Android.getCurrentTime());

          if (maxStopedTime) {
            playedSeconds = maxStopedTime.stopedTime;
          }

          if (isReady) {
            try {
              seekTo(playedSeconds);
            } catch (e) {
              console.log(e);
            }
          }

          return;
        }
        v.currentTime = maxStopedTime;
      }
    }
  }, [isReady]);

  useEffect(() => {
    console.log(rootControl);
  }, [rootControl]);

  useEffect(() => {
    if (!playing) {
      openControls();
    }
  }, [playing]);

  useEffect(() => {
    const video_player = document.querySelector(".video__player");
    const menu_header = document.querySelector(".menu__header");

    if (window.Android && menu_header) {
      menu_header.style.display = "black";
      video_player.style.background = "transparent";
      menu_header.style.display = "none";
    }

    return () => {
      if (window.Android && menu_header) {
        menu_header.style.display = "flex";
        video_player.style.background = "black";
      }
    };
  }, [rootControl]);

  // useEffect(() => {
  //   if (window.Android) {
  //     const androidPlayerSettings = Storege.getAndroidPlayerSettings();

  //     var { channelPlayer, vodPlayer } = androidPlayerSettings;

  //     if (mediaType === "live" || mediaType === "epg") {
  //       setPlayerType(channelPlayer || "EXO");

  //       return;
  //     }

  //     setPlayerType(vodPlayer || "EXO");
  //   } else {
  //     setPlayerType("");
  //   }
  // }, []);

  function isWebOS() {
    return /webos/i.test(navigator.userAgent.toLocaleLowerCase());
  }

  useEffect(() => {
    if (window.Android || window.tizen || isWebOS()) {
      setMuted(false);
      return;
    }
    setMuted(true);
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(control_timeout);
      clearTimeout(timeout);
      clearTimeout(tizen_timeout);
    };
  }, [rootControl]);

  const onError = () => {
    setLoading(false);

    if (window.Android) {
      window.Android.destroyPlayer();
    }

    navigate(-1);

    dispatch(setRootControl("play_movies_or_buy"));
  };

  const onDuration = (duration) => {
    if (durationRef.current) {
      durationRef.current.textContent = totalTime(Math.round(duration));
    }

    setDuration(duration);
  };

  useEffect(() => {
    if (window.Android && playing) {
      setLoading(false);
    }
  }, [playing]);


  useEffect(() => {
     if(window.Android) {
      videoPlayerRef.current.style.background = "transparent";
      document.body.style.background = "transparent";
     }
  }, [])

  const handleVideoClick = () => {
    if (loading) return;
    
    // Clear any existing control timeout to prevent immediate closing
    if (control_timeout) {
      clearTimeout(control_timeout);
    }
    
    // Show controls and keep them visible
    if (controlRef && controlRef.current) {
      controlRef.current.style.opacity = 1;
    }
    
    // Set timeout to close controls after 5 seconds
    control_timeout = setTimeout(() => {
      if (controlRef && controlRef.current) {
        controlRef.current.style.opacity = 0;
      }
    }, 5000);
  };

  return (
    <div
      className="video__player"
      ref={videoPlayerRef}
      onClick={handleVideoClick}
      style={{
        width: "192rem",
        height: "var(--screen-height)",
        top: 0,
        position: "fixed",
        zIndex: 1000,
        left: 0,
        background: "transparent",
      }}
    >
      <AppPlayer
        url={url}
        mediaType={mediaType}
        onPlay={onPlay}
        onPause={onPause}
        onError={onError}
        onEnded={onEnded}
        onProgress={onProgress}
        ref={videoRef}
        playing={playing}
        onBufferEnd={onBufferEnd}
        onDuration={onDuration}
        onBuffer={onBuffer}
        onReady={onReady}
        onLoadedData={onLoadedData}
        loop={false}
        muted={muted}
      />

      <VideoControl
        durationRef={durationRef}
        progressRef={progressRef}
        controlRef={controlRef}
        currentTimeRef={currentTimeRef}
        progressInnerRef={progressInnerRef}
        playing={playing}
        onPlay={onPlay}
        onPause={onPause}
      />

      {loading && (
        <div
          className="load__block"
          style={{
            position: "absolute",
            left: "50%",
            top: "30%",
            zIndex: 9999999,
          }}
        >
          <Load />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
