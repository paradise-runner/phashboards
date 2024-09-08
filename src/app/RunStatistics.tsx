import React, { useMemo } from "react";
import { Calendar, MapPin, TrendingUp, BarChart3, PieChart } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsePieChart,
  Pie,
  Cell,
} from "recharts";
import { Show, ShowWithSongs } from "./interfaces";
import { getEvenlyDistributedColorGenerator } from "./Utils";

interface RunStatisticsProps {
    shows: Show[];
    showsWithSongs: ShowWithSongs[];
    selectedPalette: string;
  }

interface Run {
  venue: string;
  startDate: string;
  endDate: string;
  shows: Show[];
}

const RunStatistics: React.FC<RunStatisticsProps> = ({
  shows,
  showsWithSongs,
  selectedPalette,
}) => {
  const runs = useMemo(() => {
    const sortedShows = [...shows].sort((a, b) =>
      a.showdate.localeCompare(b.showdate)
    );
    const runs: Run[] = [];
    let currentRun: Run | null = null;

    sortedShows.forEach((show) => {
      if (
        !currentRun ||
        currentRun.venue !== show.venue ||
        Date.parse(show.showdate) - Date.parse(currentRun.endDate) >
          2 * 86400000
      ) {
        if (currentRun) {
          runs.push(currentRun);
        }
        currentRun = {
          venue: show.venue,
          startDate: show.showdate,
          endDate: show.showdate,
          shows: [show],
        };
      } else {
        currentRun.endDate = show.showdate;
        currentRun.shows.push(show);
      }
    });

    if (currentRun) {
      runs.push(currentRun);
    }

    return runs;
  }, [shows]);



  const runStatistics = useMemo(() => {
    const totalRuns = runs.length;
    const totalShowsInRuns = runs.reduce(
      (total, run) => total + run.shows.length,
      0
    );
    const averageShowsPerRun = totalShowsInRuns / totalRuns;
    const longestRun = runs.reduce((longest, current) =>
      current.shows.length > longest.shows.length ? current : longest
    );

    const runLengthDistribution = runs.reduce((dist, run) => {
      const length = run.shows.length;
      dist[length] = (dist[length] || 0) + 1;
      return dist;
    }, {} as Record<number, number>);

    const mostCommonRunLength = Object.entries(runLengthDistribution).reduce(
      (max, [length, count]) =>
        count > max.count ? { length: Number(length), count } : max,
      { length: 0, count: 0 }
    );

    return {
      totalRuns,
      totalShowsInRuns,
      averageShowsPerRun,
      longestRun,
      runLengthDistribution,
      mostCommonRunLength,
    };
  }, [runs]);

  const venueRunCounts = useMemo(() => {
    const counts = runs.reduce((acc, run) => {
      acc[run.venue] = (acc[run.venue] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .map(([venue, count]) => ({ venue, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [runs]);

  const songRunPercentages = useMemo(() => {
    const songCounts: { [key: string]: number } = {};
    const totalRuns = runs.length;

    runs.forEach((run) => {
      const runSongs = new Set<string>();
      run.shows.forEach((show) => {
        const matchingShow = showsWithSongs.find(
          (s) => s.showdate === show.showdate
        );
        if (matchingShow) {
          matchingShow.songs.forEach((song) => runSongs.add(song));
        }
      });
      runSongs.forEach((song) => {
        songCounts[song] = (songCounts[song] || 0) + 1;
      });
    });

    return Object.entries(songCounts)
      .map(([song, count]) => ({
        song,
        percentage: Math.round((count / totalRuns) * 100),
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 10);
  }, [runs, showsWithSongs]);

  const chartData = useMemo(() => {
    const songAppearances: { [key: string]: number } = {};
    let totalRuns = 0;

    return runs.map((run) => {
      totalRuns++;
      const year = new Date(run.startDate).getFullYear();
      const runSongs = new Set<string>();

      run.shows.forEach((show) => {
        const matchingShow = showsWithSongs.find(
          (s) => s.showdate === show.showdate
        );
        if (matchingShow) {
          matchingShow.songs.forEach((song) => runSongs.add(song));
        }
      });

      runSongs.forEach((song) => {
        if (songRunPercentages.some((s) => s.song === song)) {
          songAppearances[song] = (songAppearances[song] || 0) + 1;
        }
      });

      const yearData: { [key: string]: number } = { year };
      songRunPercentages.forEach(({ song }) => {
        yearData[song] = songAppearances[song]
          ? Math.round((songAppearances[song] / totalRuns) * 100)
          : 0;
      });

      return yearData;
    });
  }, [runs, showsWithSongs, songRunPercentages]);

  const runLengthDistributionData = useMemo(() => {
    return Object.entries(runStatistics.runLengthDistribution)
      .map(([length, count]) => ({ length: Number(length), count }))
      .sort((a, b) => a.length - b.length);
  }, [runStatistics.runLengthDistribution]);

  const getRunLengthColor = getEvenlyDistributedColorGenerator(runLengthDistributionData.length, selectedPalette)

  const getVenueColor = getEvenlyDistributedColorGenerator(venueRunCounts.length, selectedPalette)

  const getSongColor = getEvenlyDistributedColorGenerator(songRunPercentages.length, selectedPalette)

  const getColor = getEvenlyDistributedColorGenerator(songRunPercentages.length, selectedPalette)

  const formatYAxis = (tickItem: number) => {
    return `${tickItem}%`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-2 border border-border rounded shadow-md">
          <p className="font-bold">{`Year: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}%`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Run Breakdown
          </CardTitle>
          <CardDescription>
            Analysis of multi-day runs at the same venue (including 1-day gaps)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>Total Runs: {runStatistics.totalRuns}</p>
            <p>Total Shows in Runs: {runStatistics.totalShowsInRuns}</p>
            <p>
              Average Shows per Run:{" "}
              {runStatistics.averageShowsPerRun.toFixed(2)}
            </p>
            <p>
              Longest Run: {runStatistics.longestRun.shows.length} shows at{" "}
              {runStatistics.longestRun.venue}
            </p>
            <p>
              Most Common Run Length: {runStatistics.mostCommonRunLength.length}{" "}
              show(s) ({runStatistics.mostCommonRunLength.count} occurrences)
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Run Length Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={runLengthDistributionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="length" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" radius={8}>
                {runLengthDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getRunLengthColor()} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            Top Venues by Number of Runs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={venueRunCounts}
              layout="vertical"
              margin={{ left: 100 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="venue" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="count" radius={8}>
                {venueRunCounts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getVenueColor()} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Top Songs in Runs Over Time</CardTitle>
          <CardDescription>Cumulative percentage of runs featuring top songs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis domain={[0, 100]} tickFormatter={formatYAxis} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {songRunPercentages.map(({ song }, index) => (
                  <Line
                    key={song}
                    type="monotone"
                    dataKey={song}
                    stroke={getColor()}
                    activeDot={{ r: 8 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="font-medium leading-none">
            Showing top {songRunPercentages.length} songs in runs
          </div>
          <div className="leading-none text-muted-foreground">
            Cumulative percentage of runs featuring each song over time
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default RunStatistics;