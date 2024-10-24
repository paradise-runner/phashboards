import React from "react";
import { Code2, Github, Heart, Music } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const NoShowsView = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 animate-gradient-x rounded-xl">
      <div className="max-w-4xl mx-auto p-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Welcome to the{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500">
                phashboards
              </span>
            </CardTitle>{" "}
            <CardDescription>Your personal Phish dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              To get started, enter your Phish.net username above and click
              "Fetch Data". Don't have an account? Visit{" "}
              <a
                href="https://phish.net"
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Phish.net
              </a>{" "}
              to create one and start tracking your show attendance!
            </p>
            <p>
              This dashboard is completely free to use and open-source. We're
              passionate about the Phish community and data visualization!
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-6 w-6" />
                Technologies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>React and Next.js</li>
                <li>TypeScript</li>
                <li>Tailwind CSS and shadcn/ui</li>
                <li>Recharts</li>
                <li>Phish.net API</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="h-6 w-6" />
                Open Source
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm">
                This project is open-source and available on GitHub. We welcome
                contributions, feedback, and feature requests!
              </p>
              <a
                href="https://github.com/paradise-runner/phashboards"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="w-full">
                  View on GitHub
                </Button>
              </a>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-6 w-6" />
                Tapehendge
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm">
                Listen to Phish shows from your personal collection on
                Tapehendge, a free service for Phish fans.
              </p>
            <a
                href="https://hec.works/tapehendge"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="w-full">
                  Listen on Tapehendge
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NoShowsView;
