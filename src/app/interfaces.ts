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
    body: {
      data: ShowSetlist[];
    };
    headers: {
      'content-type': string;
    };
    status: number;
    statusText: string;
  }

  export interface ShowWithSongs {
    showdate: string;
    songs: string[];
  }
  
  export interface ShowSetlist {
    artist_name: string;
    artist_slug: string;
    artistid: string;
    city: string;
    country: string;
    exclude: string;
    footnote: string;
    gap: string;
    is_original: string;
    isjam: string;
    isjamchart: string;
    isreprise: string;
    jamchart_description: string;
    meta: string;
    nickname: string;
    permalink: string;
    position: string;
    reviews: string;
    set: string;
    setlistnotes: string;
    showdate: string;
    showid: string;
    showyear: string;
    slug: string;
    song: string;
    songid: string;
    soundcheck: string;
    state: string;
    tourid: string;
    tourname: string;
    tourwhen: string;
    tracktime: string | null;
    trans_mark: string;
    transition: string;
    uniqueid: string;
    venue: string;
    venueid: string;
  }