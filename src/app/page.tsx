"use client";

import React, { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  Laptop,
  Music,
  BarChart,
  Home,
  Palette,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import SongStatistics from "./SongStatistics";
import ShowStatistics from "./ShowStatistics";
import RunStatistics from "./RunStatistics";
import NoShowsView from "./NoShowsView";
import GradientHomeIcon from "./GradientHomeIcon";
import UserProfileCard from "./cards/UserProfileCard";
import { PALETTES } from "./Utils";
import { useSearchParams } from 'next/navigation';
import JamCard from "./components/JamCard";

import type { Show, ApiResponse, Song, SetlistApiResponse, TapeHendgeSong, Jam, TapeHendgeShow } from "./interfaces";
import { useRouter } from "next/navigation";
import type { EnhancedJamSong } from "./interfaces";

const API_KEY = process.env.NEXT_PUBLIC_PHISH_NET_API_KEY;

const ThemeToggle = () => {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Laptop className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface PaletteSelectorProps {
  selectedPalette: string;
  onPaletteChange: (palette: string) => void;
}

const PaletteSelector: React.FC<PaletteSelectorProps> = ({
  selectedPalette,
  onPaletteChange,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Select color palette</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.keys(PALETTES).map((palette) => (
          <DropdownMenuItem
            key={palette}
            onClick={() => onPaletteChange(palette)}
          >
            <div className="flex items-center">
              <div
                className="w-4 h-4 mr-2 rounded"
                style={{ backgroundColor: PALETTES[palette][0] }}
              />
              <span className="capitalize">{palette}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Dashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialUsername = searchParams.get("username") || "";

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

      let jams: Jam[] = [];

      // Query PhishNet API for JamCharts for years of attendance
      for (const year of yearsAttended) {
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
      const jamsFromAttendedShows = jams.filter(jam => sortedShows.some(show => show.showid.toString() === jam.showid));

      // Query TapeHendge API for all shows
      const tapeHendgeResponse = await fetch(
        "https://hec.works/api/shows"
      );
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
    if (initialUsername) {
      fetchUserShows();
    }
  }, [initialUsername]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="bg-card shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
              phashboards
            </h1>
            <Button variant="ghost" size="icon" onClick={handleHomeClick}>
              <GradientHomeIcon className="h-5 w-5" />
              <span className="sr-only">Home</span>
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <PaletteSelector
              selectedPalette={selectedPalette}
              onPaletteChange={handlePaletteChange}
            />
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
            Your Phish Experience
          </h2>
          <p className="text-xl text-muted-foreground">
            Dive into your personal Phish dashboard
          </p>
        </div>

        {shows.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <UserProfileCard username={username} shows={shows}/>
            <JamCard jamSongs={jamSongs} loading={loading} />
          </div>
        ) : (
        <div className="mb-12 max-w-md mx-auto">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Enter your phish.net username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={fetchUserShows} disabled={loading}>
              {loading ? "Loading..." : "Fetch Data"}
            </Button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
        )}

        {shows.length > 0 ? (
          <div className="space-y-16">
            <section className="bg-card rounded-lg shadow-xl p-6 dark:outline outline-offset-1 outline-purple-400">
              <h2 className="text-3xl font-semibold mb-6 flex items-center">
                <BarChart className="mr-2" /> Show Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ShowStatistics
                  shows={shows}
                  selectedPalette={selectedPalette}
                />
              </div>
            </section>
            <Separator className="my-8" />
            <section className="bg-card rounded-lg shadow-xl p-6 dark:outline outline-offset-1 outline-blue-400">
              <h2 className="text-3xl font-semibold mb-6 flex items-center">
                <Music className="mr-2" /> Song Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SongStatistics
                  songs={songs}
                  shows={showsWithSongs}
                  loadingSongs={loadingSongs}
                  selectedPalette={selectedPalette}
                />
              </div>
            </section>
            <Separator className="my-8" />
            <section className="bg-card rounded-lg shadow-xl p-6 dark:outline outline-offset-1 outline-purple-400">
              <h2 className="text-3xl font-semibold mb-6 flex items-center">
                <Music className="mr-2" /> Run Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      <footer className="bg-card mt-16 py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 phashboards. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;

