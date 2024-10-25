import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Show } from "../interfaces";
import { User, Ticket, MapPin, CalendarRange, Calendar } from "lucide-react";

interface UserProfileCardProps {
  username: string;
  shows: Show[];
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ username, shows }) => {
  const totalShows = shows.length;
  
  const sortedShows = shows.sort((a, b) => {
    if (a.showdate < b.showdate) {
      return -1;
    }
    if (a.showdate > b.showdate) {
      return 1;
    }
    return 0;
    });
  
  const firstShow = sortedShows[0]?.showdate;
  const lastShow = sortedShows[sortedShows.length - 1]?.showdate;
  
  const uniqueVenues = new Set(shows.map(show => show.venue)).size;

  const formatDate = (dateStr: string) => {
    console.log(dateStr);
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    });
  };

  return (
    <Card className="bg-card shadow-xl dark:outline outline-offset-1 outline-blue-400">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold flex items-center">
          <User className="mr-2 h-6 w-6" />
          {username}'s Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Ticket className="h-4 w-4" />
              Total Shows
            </p>
            <p className="text-2xl font-bold">{totalShows}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Unique Venues
            </p>
            <p className="text-2xl font-bold">{uniqueVenues}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <CalendarRange className="h-4 w-4" />
              First Show
            </p>
            <p className="text-lg font-semibold">{firstShow ? formatDate(firstShow) : 'N/A'}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Latest Show
            </p>
            <p className="text-lg font-semibold">{lastShow ? formatDate(lastShow) : 'N/A'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
