"use client";

import React, { useState, useEffect, useRef } from "react";
import { Music, BarChart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SongStatistics from "./SongStatistics";
import ShowStatistics from "./ShowStatistics";
import RunStatistics from "./RunStatistics";
import NoShowsView from "./NoShowsView";
import UserProfileCard from "./cards/UserProfileCard";
import { useSearchParams } from 'next/navigation';
import JamCard from "./components/JamCard";
import Header from "./components/Header";
import Footer from "./components/Footer";

import type { Show, ApiResponse, Song, SetlistApiResponse, TapeHendgeSong, Jam, TapeHendgeShow } from "./interfaces";
import { useRouter } from "next/navigation";
import type { EnhancedJamSong } from "./interfaces";

const API_KEY = process.env.NEXT_PUBLIC_PHISH_NET_API_KEY;

const Dashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialUsername = searchParams.get("username") || "";
  const initialFetchPerformed = useRef(false);

  const [username, setUsername] = useState(initialUsername);
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loadingSongs, setLoadingSongs] = useState(false);
  const [showsWithSongs, setShowsWithSongs] = useState<
    { showdate: string; songs: string[] }[]
  >([]);
  const [selectedPalette, setSelectedPalette] = useState("default");
  const [jamSongs, setJamSongs] = useState<EnhancedJamSong[]>([]);

  const handlePaletteChange = (newPalette: string) => {
    console.log("Changing palette to:", newPalette);
    setSelectedPalette(newPalette);
  };

  const handleHomeClick = () => {
    setUsername("");
    setShows([]);
    setSongs([]);
    setShowsWithSongs([]);
    setError(null);
    router.push("/");
  };

  const fetchSetlists = async () => {
    setLoadingSongs(true);
    const songCounts: Record<string, number> = {};
    const showsWithSongsData: { showdate: string; songs: string[] }[] = [];

    for (const show of shows) {
      try {
        const response = await fetch(
          `https://api.phish.net/v5/setlists/showid/${show.showid}.json?apikey=${API_KEY}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch setlist for show ${show.showid}`);
        }
        const data: SetlistApiResponse = await response.json();
        const songs = data.data.map((song: { song: string }) => song.song);
        showsWithSongsData.push({ showdate: show.showdate, songs });
        songs.forEach((song: string) => {
          songCounts[song] = (songCounts[song] || 0) + 1;
        });
      } catch (error) {
        console.error(`Error fetching setlist for show ${show.showid}:`, error);
      }
    }

    const sortedSongs = Object.entries(songCounts)
      .map(([song, count]) => ({ song, count }))
      .sort((a, b) => b.count - a.count);

    setSongs(sortedSongs);
    setShowsWithSongs(showsWithSongsData);
    setLoadingSongs(false);
  };

  useEffect(() => {
    if (shows.length > 0) {
      fetchSetlists();
    }
  }, [shows]);

  const fetchUserShows = async () => {
    if (!username) {
      setError("Please enter a username");
      return;
    }
    setLoading(true);
    setError(null);
    router.push(`/?username=${username}`);
    try {
      const response = await fetch(
        `https://api.phish.net/v5/attendance/username/${username}.json?apikey=${API_KEY}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from Phish.net API");
      }
      const data: ApiResponse = await response.json();
      // filter out shows where the artist_name is not "Phish"
      data.data = data.data.filter(
        (show: Show) => show.artist_name === "Phish"
      );

      const sortedShows = data.data.sort(
        (a: Show, b: Show) =>
          new Date(b.showdate).getTime() - new Date(a.showdate).getTime()
      );
      setShows(sortedShows);

      // next step, is fetching relevant jam data from the api, then querying the tapehendge api for hosted song data, allowing us to present 
      // the user with their 'jam playlist', where they can stream all the certified jams from their attended shows
      // Steps:
      // 1. Query PhishNet API For JamCharts for years of attendance 
      // 2. Filter out jams that are not from the shows attended
      // 3. Query TapeHendge API for all shows
      // 4. Filter out shows that do not match the shows attended and shows with no jams
      // 5. For each show, query the TapeHendge API for the songs played in that show
      // 6. Filter out songs that are not in the jams list

      const yearsAttended = sortedShows.map((show) => new Date(show.showdate).getFullYear());

      // remove duplicates
      const uniqueYears = Array.from(new Set(yearsAttended));

      let jams: Jam[] = [];

      // Query PhishNet API for JamCharts for years of attendance
      for (const year of uniqueYears) {
        const response = await fetch(
          `https://api.phish.net/v5/jamcharts/showyear/${year}.json?apikey=${API_KEY}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch jamcharts for year ${year}`);
        }
        const jamData: { data: Jam[] } = await response.json();
        jams = [...jams, ...jamData.data];
      }

      // Filter out jams that are not from the shows attended
      const jamsFromAttendedShows = jams.filter(jam => sortedShows.some(show => show.showid === jam.showid));

      // Query TapeHendge API for all shows
      const tapeHendgeResponse = await fetch(
        "https://hec.works/api/shows"
      );

      console.log("TapeHendge API response:", tapeHendgeResponse);
      // example response
      // [{'id': 1783, 'date': '2023-12-31', 'venue': 'Madison Square Garden', 'city': 'New York', 'state': 'NY', 'coverArt': 'https://weekapaugh.us-southeast-1.linodeobjects.com/weekapaugh/shows/2023-12-31_-_Madison_Square_Garden_-_New_York,_NY/2023-12-31.png', 'favorited': True}, {'id': 1783, 'date': '2023-12-31', 'venue': 'Madison Square Garden', 'city': 'New York', 'state': 'NY', 'coverArt': 'https://weekapaugh.us-southeast-1.linodeobjects.com/weekapaugh/shows/2023-12-31_-_Madison_Square_Garden_-_New_York,_NY/2023-12-31.png', 'favorited': True}, {'id': 1782, 'date': '2023-12-30', 'venue': 'Madison Square Garden', 'city': 'New York', 'state': 'NY', 'coverArt': 'https://weekapaugh.us-southeast-1.linodeobjects.com/weekapaugh/shows/2023-12-30_-_Madison_Square_Garden_-_New_York,_NY/2023-12-30.png', 'favorited': False}]

      if (!tapeHendgeResponse.ok) {
        throw new Error("Failed to fetch data from TapeHendge API");
      }

      const tapeHendgeData: TapeHendgeShow[] = await tapeHendgeResponse.json();

      // Filter out shows that are not in jamsFromAttendedShows
      const filteredTapeHendgeShows = tapeHendgeData.filter((show) =>
        jamsFromAttendedShows.some((jam) => jam.showdate === show.date)
      );

      let tapeHendgeSongs: EnhancedJamSong[] = [];

      // For each show, query the TapeHendge API for the songs played in that show
      for (const show of filteredTapeHendgeShows) {
        const response = await fetch(
          `https://hec.works/api/songs/${show.id}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch songs for show ${show.id}`);
        }

        const songs: TapeHendgeSong[] = await response.json();

        // Filter out songs that are not in the jams list where the showDate matches the show date and the song title matches the jam title
        const filteredSongs = songs.filter((song) =>
          jamsFromAttendedShows.some(
            (jam) => jam.showdate === show.date && jam.song === song.title
          )
        );

        const enhancedJamSongs: EnhancedJamSong[] = filteredSongs.map((song) => {
          const matchingJam = jamsFromAttendedShows.find(
            (jam) => jam.showdate === show.date && jam.song === song.title
          );
          return {
            ...song,
            showDate: show.date,
            venue: show.venue,
            city: show.city,
            state: show.state,
            jamchartDescription: matchingJam?.jamchart_description
          };
        });

        tapeHendgeSongs = [...tapeHendgeSongs, ...enhancedJamSongs];
      }

      setJamSongs(tapeHendgeSongs);


    } catch (error) {
      console.error("Error fetching shows:", error);
      setError("An error occurred while fetching data. Please try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (initialUsername && !initialFetchPerformed.current) {
      initialFetchPerformed.current = true;
      fetchUserShows();
    }
  }, [initialUsername]);

  return (
    <div className="bg-background text-foreground flex flex-col min-h-screen">
      <Header 
        selectedPalette={selectedPalette}
        onPaletteChange={handlePaletteChange}
        onHomeClick={handleHomeClick}
      />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1">
        <div className="mb-8 sm:mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
            Your Phish Experience
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Dive into your personal Phish dashboard
          </p>
        </div>

        {shows.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <UserProfileCard username={username} shows={shows}/>
            <JamCard jamSongs={jamSongs} loading={loading} />
          </div>
        ) : (
        <div className="mb-8 sm:mb-12 max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 sm:space-x-2">
            <Input
              type="text"
              placeholder="Enter your phish.net username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-grow"
            />
            <Button 
              onClick={fetchUserShows} 
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? "Loading..." : "Fetch Data"}
            </Button>
          </div>
          {error && <p className="text-red-500 mt-2 text-center sm:text-left">{error}</p>}
        </div>
        )}

        {shows.length > 0 ? (
          <div className="space-y-10 sm:space-y-16">
            <section className="bg-card rounded-lg shadow-xl p-4 sm:p-6 dark:outline outline-offset-1 outline-purple-400">
              <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 flex items-center">
                <BarChart className="mr-2 h-5 w-5 sm:h-6 sm:w-6" /> Show Statistics
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <ShowStatistics
                  shows={shows}
                  selectedPalette={selectedPalette}
                />
              </div>
            </section>
            
            <Separator className="my-6 sm:my-8" />
            
            <section className="bg-card rounded-lg shadow-xl p-4 sm:p-6 dark:outline outline-offset-1 outline-blue-400">
              <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 flex items-center">
                <Music className="mr-2 h-5 w-5 sm:h-6 sm:w-6" /> Song Statistics
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <SongStatistics
                  songs={songs}
                  shows={showsWithSongs}
                  loadingSongs={loadingSongs}
                  selectedPalette={selectedPalette}
                />
              </div>
            </section>
            
            <Separator className="my-6 sm:my-8" />
            
            <section className="bg-card rounded-lg shadow-xl p-4 sm:p-6 dark:outline outline-offset-1 outline-purple-400">
              <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 flex items-center">
                <Music className="mr-2 h-5 w-5 sm:h-6 sm:w-6" /> Run Statistics
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <RunStatistics
                  shows={shows}
                  showsWithSongs={showsWithSongs}
                  selectedPalette={selectedPalette}
                />
              </div>
            </section>
          </div>
        ) : (
          <NoShowsView />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;

