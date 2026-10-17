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

class GlobalAudioPlayer {
  private static instance: GlobalAudioPlayer | null = null;
  private audio: HTMLAudioElement;
  private playlist: MusicTrack[];
  private currentIndex: number;
  private state: PlayerState;

  private constructor(playlist: MusicTrack[] = []) {
    this.playlist = playlist;
    this.currentIndex = 0;
    this.audio = new Audio();
    this.audio.loop = false;
    
    // Initialize state
    this.state = {
      isPlaying: false,
      currentTrack: null,
      playlist: [],
      currentIndex: 0,
      volume: 1,
      duration: 0,
      currentTime: 0,
      isLoading: false
    };

    // Set up event listeners
    this.setupEventListeners();
    this.setupGlobalEventListeners();
  }

  getPlaylist() {
    return this.playlist;
  }

  getIsPlaying() {
    return !this.audio.paused;
  }

  // Setup audio event listeners
  private setupEventListeners() {
    this.audio.addEventListener('loadstart', () => {
      this.updateState({ isLoading: true });
    });

    this.audio.addEventListener('canplay', () => {
      this.updateState({ isLoading: false });
    });

    this.audio.addEventListener('play', () => {
      this.updateState({ isPlaying: true });
    });

    this.audio.addEventListener('pause', () => {
      this.updateState({ isPlaying: false });
    });

    this.audio.addEventListener('timeupdate', () => {
      this.updateState({ currentTime: this.audio.currentTime });
    });

    this.audio.addEventListener('durationchange', () => {
      this.updateState({ duration: this.audio.duration || 0 });
    });

    this.audio.addEventListener('ended', () => {
      this.next();
    });

    this.audio.addEventListener('volumechange', () => {
      this.updateState({ volume: this.audio.volume });
    });
  }

  // Setup global event listeners for external control
  private setupGlobalEventListeners() {
    window.addEventListener('globalMusicPlay', () => this.play());
    window.addEventListener('globalMusicPause', () => this.pause());
    window.addEventListener('globalMusicStop', () => this.stop());
    window.addEventListener('globalMusicNext', () => this.next());
    window.addEventListener('globalMusicPrevious', () => this.previous());
    
    // Custom event for playing specific track
    window.addEventListener('globalMusicPlayTrack', (event: any) => {
      const { track, playlist, index } = event.detail;
      this.playTrack(track, playlist, index);
    });

    // Custom event for setting volume
    window.addEventListener('globalMusicSetVolume', (event: any) => {
      this.setVolume(event.detail.volume);
    });
  }

  // Update state and dispatch custom event
  private updateState(newState: Partial<PlayerState>) {
    this.state = { ...this.state, ...newState };
    
    // Dispatch state change event
    window.dispatchEvent(new CustomEvent('musicPlayerStateChange', {
      detail: this.state
    }));
  }

  // Get current state
  getState(): PlayerState {
    return { ...this.state };
  }

  // Singleton
  static getInstance(playlist: MusicTrack[] = []): GlobalAudioPlayer {
    if (!this.instance) {
      this.instance = new GlobalAudioPlayer(playlist);
    }
    return this.instance;
  }

  // Play a specific track with optional playlist
  async playTrack(track: MusicTrack, playlist?: MusicTrack[], index?: number): Promise<void> {
    if (playlist) {
      this.playlist = playlist;
      this.updateState({ playlist });
    }
    
    if (index !== undefined) {
      this.currentIndex = index;
    } else {
      // Find track in current playlist
      const trackIndex = this.playlist.findIndex(t => t.id === track.id);
      this.currentIndex = trackIndex >= 0 ? trackIndex : 0;
    }

    this.updateState({ 
      currentTrack: track, 
      currentIndex: this.currentIndex 
    });

    await this.loadTrack(track);
    await this.play();
  }

  // Load a track
  private async loadTrack(track: MusicTrack): Promise<void> {
    this.updateState({ isLoading: true });
    
    const url = track.url || track.file || '';

    this.audio.src = url;
    this.audio.load();

    return new Promise((resolve) => {
      const onCanPlay = () => {
        this.audio.removeEventListener('canplay', onCanPlay);
        this.updateState({ isLoading: false });
        resolve();
      };
      this.audio.addEventListener('canplay', onCanPlay);

      // Fallback timeout in case canplay doesn't fire
      setTimeout(() => {
        if (this.state.isLoading) {
          this.audio.removeEventListener('canplay', onCanPlay);
          this.updateState({ isLoading: false });
          resolve();
        }
      }, 3000);
    });
  }

  // Play current track
  async play(): Promise<void> {
    if (!this.audio.src && this.playlist.length > 0) {
      await this.loadTrack(this.playlist[this.currentIndex]);
    }

    if (this.state.isLoading) {
      await this.loadTrack(this.playlist[this.currentIndex]);
    }

    try {
      await this.audio.play();
    } catch (error) {
      // Handle the "play() request was interrupted" error gracefully
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Play request was interrupted by a new load request - this is expected behavior');
        return;
      }
      throw error;
    }
  }

  // Pause playback
  pause() {
    this.audio.pause();
  }


  // Next track
  async next() {
    if (this.playlist.length === 0) return;
    const wasPlaying = !this.audio.paused;
    this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
    const nextTrack = this.playlist[this.currentIndex];
    
    this.updateState({ 
      currentTrack: nextTrack, 
      currentIndex: this.currentIndex 
    });
    
    await this.loadTrack(nextTrack);
    if (wasPlaying) {
      this.play();
    }
  }

  // Previous track
  async previous() {
    if (this.playlist.length === 0) return;
    const wasPlaying = !this.audio.paused;
    this.currentIndex =
      (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
    const prevTrack = this.playlist[this.currentIndex];
    
    this.updateState({ 
      currentTrack: prevTrack, 
      currentIndex: this.currentIndex 
    });
    
    await this.loadTrack(prevTrack);
    if (wasPlaying) {
      this.play();
    }
  }

  // Set volume (0.0 - 1.0)
  setVolume(volume: number) {
    const clampedVolume = Math.min(Math.max(volume, 0), 1);
    this.audio.volume = clampedVolume;
    this.updateState({ volume: clampedVolume });
  }

  // Get current track index
  getCurrentIndex() {
    return this.currentIndex;
  }

  // Get current track
  getCurrentTrack(): MusicTrack | null {
    return this.state.currentTrack;
  }

  // Add a track to playlist
  addTrack(track: MusicTrack) {
    this.playlist.push(track);
    this.updateState({ playlist: [...this.playlist] });
  }

  // Replace playlist
  async setPlaylist(list: MusicTrack[]) {
    this.playlist = list;
    this.currentIndex = 0;
    this.updateState({ 
      playlist: [...list], 
      currentIndex: 0,
      currentTrack: list[0] || null 
    });
    
    if (list.length > 0) {
      await this.loadTrack(list[0]);
    }
  }

  // Seek to specific time
  seekTo(time: number) {
    if (this.audio.duration && time >= 0 && time <= this.audio.duration) {
      this.audio.currentTime = time;
      this.updateState({ currentTime: time });
    }
  }

  // Stop playback and reset
  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.updateState({ 
      isPlaying: false, 
      currentTime: 0 
    });
  }

  // Destroy instance (cleanup)
  static destroy() {
    if (this.instance) {
      this.instance.audio.pause();
      this.instance.audio.src = '';
      this.instance = null;
    }
  }
}

export default GlobalAudioPlayer;
