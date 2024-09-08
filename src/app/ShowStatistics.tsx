import React, { useMemo, useState } from "react";
import { TrendingUp, Music, Map} from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { Show } from "./interfaces";
import { getEvenlyDistributedColorGenerator } from "./Utils";

interface ShowStatisticsProps {
    shows: Show[];
    selectedPalette: string;
  }

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const ShowCard: React.FC<{ show: Show }> = ({ show }) => (
  <div className="bg-card p-4 rounded-lg shadow-md border border-border">
    <div className="flex items-start justify-between">
      <div>
        <h3 className="font-semibold text-lg text-primary">{show.venue}</h3>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <Map className="h-4 w-4 mr-1" />
          <span>
            {show.city}, {show.state}
          </span>
        </div>
        <div className="text-sm mt-1">{formatDate(show.showdate)}</div>
      </div>
    </div>
    {show.tour_name && (
      <div className="mt-2 text-sm font-medium text-accent-foreground">
        Tour: {show.tour_name}
      </div>
    )}
  </div>
);

const ShowStatistics: React.FC<ShowStatisticsProps> = ({ shows, selectedPalette }) => {
    const chartConfig = {
      shows: {
        label: "Shows",
        color: "hsl(var(--chart-1))",
      },
    };
  
    const showsByYear = useMemo(() => {
      const countByYear = shows.reduce((acc, show) => {
        const year = new Date(show.showdate).getFullYear();
        acc[year] = (acc[year] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);
  
      const data = Object.entries(countByYear)
        .map(([year, count]) => ({ year, shows: count }))
        .sort((a, b) => parseInt(a.year) - parseInt(b.year));
  
      const getColor = getEvenlyDistributedColorGenerator(data.length, selectedPalette);
      return data.map((item) => ({ ...item, fill: getColor() }));
    }, [shows, selectedPalette]);
  
    const showsByVenue = useMemo(() => {
      const countByVenue = shows.reduce((acc, show) => {
        acc[show.venue] = (acc[show.venue] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
  
      const data = Object.entries(countByVenue)
        .map(([venue, count]) => ({ venue, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
  
      const getColor = getEvenlyDistributedColorGenerator(data.length, selectedPalette);
      return data.map((item) => ({ ...item, fill: getColor() }));
    }, [shows, selectedPalette]);
  
    const showsByTour = useMemo(() => {
      const countByTour = shows.reduce((acc, show) => {
        if (show.tour_name) {
          acc[show.tour_name] = (acc[show.tour_name] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);
  
      const data = Object.entries(countByTour)
        .map(([tour, count]) => ({ tour, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
  
      const getColor = getEvenlyDistributedColorGenerator(data.length, selectedPalette);
      return data.map((item) => ({ ...item, fill: getColor() }));
    }, [shows, selectedPalette]);
  
    const stateShowData = useMemo(() => {
      const showsByYearAndState: Record<number, Record<string, number>> = {};
      const states = new Set<string>();
  
      shows.forEach((show) => {
        const year = new Date(show.showdate).getFullYear();
        if (!showsByYearAndState[year]) {
          showsByYearAndState[year] = {};
        }
        if (!showsByYearAndState[year][show.state]) {
          showsByYearAndState[year][show.state] = 0;
        }
        showsByYearAndState[year][show.state]++;
        states.add(show.state);
      });
  
      const years = Object.keys(showsByYearAndState)
        .map(Number)
        .sort((a, b) => a - b);
  
      const statesArray = Array.from(states);
      const getColor = getEvenlyDistributedColorGenerator(statesArray.length, selectedPalette);
      const stateColors = statesArray.reduce((acc, state) => {
        acc[state] = getColor();
        return acc;
      }, {} as Record<string, string>);
  
      return {
        data: years.map((year) => {
          const yearData: Record<string, number> = { year };
          statesArray.forEach((state) => {
            yearData[state] = showsByYearAndState[year][state] || 0;
          });
          return yearData;
        }),
        stateColors,
      };
    }, [shows, selectedPalette]);


  const totalShows = shows.length;
  const recentYears = showsByYear.slice(-5);
  const trend =
    recentYears.length > 1
      ? ((recentYears[recentYears.length - 1].shows -
          recentYears[recentYears.length - 2].shows) /
          recentYears[recentYears.length - 2].shows) *
        100
      : 0;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Shows by Year</CardTitle>
          <CardDescription>
            {`${showsByYear[0].year} - ${
              showsByYear[showsByYear.length - 1].year
            }`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={showsByYear}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="year"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="shows" fill="#8884d8" radius={8}>
                  {showsByYear.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            {trend > 0 ? "Trending up" : "Trending down"} by{" "}
            {Math.abs(trend).toFixed(1)}% compared to last year
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing total shows attended per year
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top 5 Venues</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={showsByVenue} layout="vertical">
              <CartesianGrid horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} />
              <YAxis
                dataKey="venue"
                type="category"
                width={150}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip />
              <Bar dataKey="count" radius={8}>
                {showsByVenue.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top 5 Tours</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={showsByTour}
                dataKey="count"
                nameKey="tour"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {showsByTour.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="flex flex-col overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Music className="h-6 w-6" />
            Total Shows Seen
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center p-0">
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-green-500">
            <p className="text-9xl font-bold text-background bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 drop-shadow-[0_1.2px_1.2px_hsl(var(--foreground))]">
              {totalShows}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Map className="h-6 w-6" />
            States Visited
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-4xl font-bold">
            {new Set(shows.map((show) => show.state)).size}
          </p>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            {Math.round(
              (new Set(shows.map((show) => show.state)).size / 50) * 100
            )}
            % of US states
          </div>
          <div className="leading-none text-muted-foreground">
            Unique states where shows were attended
          </div>
        </CardFooter>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-6 w-6" />
            Shows per State Over Time
          </CardTitle>
          <CardDescription>
            Number of shows attended in each state by year
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stateShowData.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.keys(stateShowData.stateColors).map((state) => (
                  <Line
                    key={state}
                    type="monotone"
                    dataKey={state}
                    stroke={stateShowData.stateColors[state]}
                    activeDot={{ r: 8 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="font-medium leading-none">
            Total States Visited:{" "}
            {Object.keys(stateShowData.stateColors).length}
          </div>
          <div className="leading-none text-muted-foreground">
            Shows per state over the years
          </div>
        </CardFooter>
      </Card>
      <Card className="flex flex-col h-[400px] col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-6 w-6" />
            Recent Shows
          </CardTitle>
          <CardDescription>Your most recent Phish experiences</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow overflow-auto">
          <ul className="space-y-4">
            {shows.slice(0, 10).map((show) => (
              <ShowCard key={show.showid} show={show} />
            ))}
          </ul>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Showing 10 most recent shows
          </span>
          {shows.length > 10 && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  View All Shows
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>All Attended Shows</DialogTitle>
                  <DialogDescription>
                    A complete list of your Phish show experiences
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {shows.map((show) => (
                    <ShowCard key={show.showid} show={show} />
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardFooter>
      </Card>
    </>
  );
};

export default ShowStatistics;