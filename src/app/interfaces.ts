export interface Show {
    showid: number;
    showdate: string;
    venue: string;
    city: string;
    state: string;
    country: string;
    tour_name: string;
    songs: string[];
    artist_name: string;
  }
  
  export interface ApiResponse {
    data: Show[];
  }
  
  export interface Song {
    song: string;
    count: number;
  }
  
  export interface SetlistApiResponse {
    data: {
      songid: string;
      song: string;
    }[];
  }
  
  export interface ShowWithSongs {
    showdate: string;
    songs: string[];
  }

  export interface Jam {
    showid: number;
    showdate: string;
    permalink: string;
    showyear: string;
    uniqueid: string;
    meta: string;
    reviews: string;
    exclude: string;
    setlistnotes: string;
    soundcheck: string;
    songid: string;
    position: string;
    transition: string;
    footnote: string;
    set: string;
    isjam: string;
    isreprise: string;
    isjamchart: string;
    jamchart_description: string;
    tracktime: string;
    gap: string;
    tourid: string;
    tourname: string;
    tourwhen: string;
    song: string;
    nickname: string;
    slug: string;
    is_original: string;
    venueid: string;
    venue: string;
    city: string;
    state: string;
    country: string;
    trans_mark: string;
    artistid: string;
    artist_slug: string;
    artist_name: string;
  }

  export interface TapeHendgeShow {
    id: number;
    date: string;
    venue: string;
    city: string;
    state: string;
    coverArt: string;
    favorited: boolean;
  }

  export interface TapeHendgeSong {
    showId: number;
    trackLength: string;
    title: string;
    set: string;
    intraSetOrder: string;
    filePath: string;
  }

  export interface AudioPlayerState {
    currentTrack: TapeHendgeSong | null;
    isPlaying: boolean;
  }

  export interface EnhancedJamSong extends TapeHendgeSong {
    showDate: string;
    venue: string;
    city: string;
    state: string;
    jamchartDescription?: string;
  }
