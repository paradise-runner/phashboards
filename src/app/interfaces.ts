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