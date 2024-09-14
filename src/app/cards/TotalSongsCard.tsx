import React, { useMemo } from 'react';
import { Music } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Song } from '../interfaces';

interface TotalSongsCardProps {
  songs: Song[];
}

const TotalSongsCard: React.FC<TotalSongsCardProps> = ({ songs }) => {
  const totalUniqueSongs = useMemo(() => songs.length, [songs]);

  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Music className="h-6 w-6" />
          Total Unique Songs Seen
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center p-0">
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500">
          <p className="text-8xl font-bold text-background bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 drop-shadow-[0_1.2px_1.2px_hsl(var(--foreground))]">
            {totalUniqueSongs}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TotalSongsCard;