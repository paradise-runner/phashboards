import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Play, Pause, Music2, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EnhancedJamSong } from '../interfaces';
import { cn } from "@/lib/utils";

interface JamCardProps {
  jamSongs: EnhancedJamSong[];
  loading?: boolean;
}

const JamCard: React.FC<JamCardProps> = ({ jamSongs, loading = false }) => {
  const [audioState, setAudioState] = useState<{
    currentTrack: EnhancedJamSong | null;
    isPlaying: boolean;
    audio?: HTMLAudioElement;
  }>({
    currentTrack: null,
    isPlaying: false,
  });

  const handlePlayPause = (song: EnhancedJamSong) => {
    if (audioState.currentTrack?.filePath === song.filePath) {
      if (audioState.isPlaying) {
        audioState.audio?.pause();
        setAudioState(prev => ({ ...prev, isPlaying: false }));
      } else {
        audioState.audio?.play();
        setAudioState(prev => ({ ...prev, isPlaying: true }));
      }
    } else {
      audioState.audio?.pause();
      const newAudio = new Audio(song.filePath);
      newAudio.play();
      setAudioState({
        currentTrack: song,
        isPlaying: true,
        audio: newAudio,
      });
    }
  };

  if (loading) {
    return (
      <Card className="bg-card shadow-xl dark:outline outline-offset-1 outline-blue-400">
        <CardHeader>
          <CardTitle>Your Jams</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-10 w-20" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (jamSongs.length === 0) {
    return (
      <Card className="bg-card shadow-xl dark:outline outline-offset-1 outline-blue-400">
        <CardHeader>
          <CardTitle>Your Jams</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Music2 className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">No Certified Jams Found</p>
          <p className="text-sm text-muted-foreground">
            You haven't attended any shows with certified jams yet. Keep exploring!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card shadow-xl dark:outline outline-offset-1 outline-blue-400">
      <CardHeader>
        <CardTitle>Your Jams</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-2xl font-bold">{jamSongs.length}</p>
              <p className="text-sm text-muted-foreground">Certified Jams</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">View All</Button>
              </DialogTrigger>
              <DialogContent className="max-w-[800px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Your Certified Jams</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                  {jamSongs.map((song) => (
                    <Card 
                      key={`${song.showId}-${song.title}`}
                      className={cn(
                        "relative overflow-hidden transition-all duration-300",
                        "bg-card shadow-md",
                        "hover:shadow-lg",
                        "border border-blue-400/20"
                      )}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{song.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {song.showDate} - {song.venue}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {song.city}, {song.state}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Set {song.set} - Song {song.intraSetOrder}
                            </p>
                            {song.jamchartDescription && (
                              <p className="text-sm italic mt-1 line-clamp-2 text-muted-foreground">
                                {song.jamchartDescription}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="shrink-0"
                              onClick={() => handlePlayPause(song)}
                            >
                              {audioState.currentTrack?.filePath === song.filePath && audioState.isPlaying ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="shrink-0"
                              onClick={() => window.open(`https://hec.works/tapehendge?concert_id=${song.showId}`, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Recent Highlights:</p>
            {jamSongs.slice(0, 2).map((song) => (
              <div 
                key={`${song.showId}-${song.title}-preview`}
                className="p-2 rounded-md bg-muted/50 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{song.title}</p>
                  <p className="text-sm text-muted-foreground">{song.showDate}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => handlePlayPause(song)}
                  >
                    {audioState.currentTrack?.filePath === song.filePath && audioState.isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => window.open(`https://hec.works/tapehendge?concert_id=${song.showId}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JamCard;