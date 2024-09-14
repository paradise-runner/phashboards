import React, { useMemo, useState } from 'react';
import { List } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Song, ShowWithSongs } from './interfaces';
import { getEvenlyDistributedColorGenerator } from './Utils';
import TotalSongsCard from './cards/TotalSongsCard'

interface SongStatisticsProps {
  songs: Song[];
  shows: ShowWithSongs[];
  loadingSongs: boolean;
  selectedPalette: string;
}

const SongFrequencyGraph: React.FC<{ shows: ShowWithSongs[]; topSongs: string[]; selectedPalette: string  }> = ({ shows, topSongs, selectedPalette }) => {
  const data = useMemo(() => {
    const songFrequencies: { [key: string]: { [key: string]: number } } = {};
    
    shows.forEach(show => {
      const year = new Date(show.showdate).getFullYear().toString();
      if (!songFrequencies[year]) {
        songFrequencies[year] = topSongs.reduce((acc, song) => ({ ...acc, [song]: 0 }), {});
      }

      
      show.songs.forEach(song => {
        if (topSongs.includes(song)) {
          songFrequencies[year][song]++;
        }
      });
    });

    return Object.entries(songFrequencies)
      .map(([year, frequencies]) => ({
        year,
        ...frequencies
      }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));
  }, [shows, topSongs]);

  const getColor = useMemo(() => getEvenlyDistributedColorGenerator(topSongs.length, selectedPalette), [topSongs, selectedPalette]);

  const songColors = useMemo(() => 
    topSongs.reduce((acc, song) => {
      acc[song] = getColor();
      return acc;
    }, {} as Record<string, string>),
  [topSongs, getColor]);

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Song Frequency Over Time</CardTitle>
        <CardDescription>How often you've seen top songs each year</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            {topSongs.map((song) => (
              <Line
                key={song}
                type="monotone"
                dataKey={song}
                stroke={songColors[song]}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const SongStatistics: React.FC<SongStatisticsProps> = ({ songs, shows, loadingSongs, selectedPalette }) => {
  const topSongs = useMemo(() => songs.slice(0, 10).map(song => song.song), [songs]);
  const getColor = useMemo(() => getEvenlyDistributedColorGenerator(topSongs.length, selectedPalette), [topSongs, selectedPalette]);

  return (
    <>
      <TotalSongsCard songs={songs} />
      <Card className="flex flex-col h-[400px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="h-6 w-6" />
            Most Seen Songs
          </CardTitle>
          <CardDescription>
            Your most frequently experienced Phish songs
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow overflow-auto">
          {loadingSongs ? (
            <p>Loading songs...</p>
          ) : (
            <ul className="space-y-2">
              {songs.slice(0, 20).map((song, index) => (
                <li
                  key={song.song}
                  className="flex justify-between items-center p-2 rounded"
                  style={{ backgroundColor: getColor() }}
                >
                  <span>{song.song}</span>
                  <span className="font-bold">{song.count}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
        <CardFooter className="justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Showing top 20 songs
          </span>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                View All Songs
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>All Songs Seen</DialogTitle>
                <DialogDescription>
                  A complete list of Phish songs you've experienced
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-2 py-4">
                {songs.map((song, index) => (
                  <div
                    key={song.song}
                    className="flex justify-between items-center p-2 rounded"
                    style={{ backgroundColor: getColor() }}
                  >
                    <span>{song.song}</span>
                    <span className="font-bold">{song.count}</span>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
      
      <SongFrequencyGraph shows={shows} topSongs={topSongs} selectedPalette={selectedPalette} />
    </>
  );
};

export default SongStatistics;