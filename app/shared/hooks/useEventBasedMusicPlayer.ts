import { useEffect, useState, useCallback } from "react";
import GlobalAudioPlayer from "@/modules/Music/functions/globalAudioPlayer";

interface MusicTrack {
  id: string;
  name: string;
  artist?: string;
  url: string;
  file?: string;
}

interface PlayerState {
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  playlist: MusicTrack[];
  currentIndex: number;
  volume: number;
  duration: number;
  currentTime: number;
  isLoading: boolean;
}

export const useEventBasedMusicPlayer = () => {
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentTrack: null,
    playlist: [],
    currentIndex: 0,
    volume: 1,
    duration: 0,
    currentTime: 0,
    isLoading: false
  });

  const audioPlayer = GlobalAudioPlayer.getInstance();

  // Listen to player state changes
  useEffect(() => {
    const handleStateChange = (event: CustomEvent) => {
      setPlayerState(event.detail);
    };

    window.addEventListener('musicPlayerStateChange', handleStateChange as EventListener);

    // Get initial state
    setPlayerState(audioPlayer.getState());

    return () => {
      window.removeEventListener('musicPlayerStateChange', handleStateChange as EventListener);
    };
  }, [audioPlayer]);

  // Control functions using custom events
  const playTrack = useCallback((track: MusicTrack, playlist?: MusicTrack[], index?: number) => {
    window.dispatchEvent(new CustomEvent('globalMusicPlayTrack', {
      detail: { track, playlist, index }
    }));
  }, []);

  const play = useCallback(() => {
    window.dispatchEvent(new CustomEvent('globalMusicPlay'));
  }, []);

  const pause = useCallback(() => {
    window.dispatchEvent(new CustomEvent('globalMusicPause'));
  }, []);

  const stop = useCallback(() => {
    window.dispatchEvent(new CustomEvent('globalMusicStop'));
  }, []);

  const next = useCallback(() => {
    window.dispatchEvent(new CustomEvent('globalMusicNext'));
  }, []);

  const previous = useCallback(() => {
    window.dispatchEvent(new CustomEvent('globalMusicPrevious'));
  }, []);

  const setVolume = useCallback((volume: number) => {
    window.dispatchEvent(new CustomEvent('globalMusicSetVolume', {
      detail: { volume }
    }));
  }, []);

  const togglePlayPause = useCallback(() => {
    if (playerState.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [playerState.isPlaying, play, pause]);

  return {
    // State
    ...playerState,
    
    // Actions
    playTrack,
    play,
    pause,
    stop,
    next,
    previous,
    setVolume,
    togglePlayPause,
    
    // Direct access to audio player instance if needed
    audioPlayer
  };
};

// Utility functions for global control without hooks
export const GlobalMusicControls = {
  playTrack: (track: MusicTrack, playlist?: MusicTrack[], index?: number) => {
    window.dispatchEvent(new CustomEvent('globalMusicPlayTrack', {
      detail: { track, playlist, index }
    }));
  },
  
  play: () => window.dispatchEvent(new CustomEvent('globalMusicPlay')),
  pause: () => window.dispatchEvent(new CustomEvent('globalMusicPause')),
  stop: () => window.dispatchEvent(new CustomEvent('globalMusicStop')),
  next: () => window.dispatchEvent(new CustomEvent('globalMusicNext')),
  previous: () => window.dispatchEvent(new CustomEvent('globalMusicPrevious')),
  
  setVolume: (volume: number) => {
    window.dispatchEvent(new CustomEvent('globalMusicSetVolume', {
      detail: { volume }
    }));
  }
};


