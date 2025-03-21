import React from "react";
import { Github, Heart, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer: React.FC = () => {
  return (
    <footer className="bg-card py-8 border-t border-border mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
              phashboards
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Visualize your Phish concert experiences
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex space-x-4 mb-2">
              <Button variant="ghost" size="icon" asChild>
                <a href="https://github.com/paradise-runner/phashboards" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://hec.works" target="_blank" rel="noopener noreferrer" aria-label="Website">
                  <WandSparkles className="h-5 w-5" />
                </a>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground flex items-center">
              Made with <Heart className="h-3 w-3 mx-1 text-red-500" /> using data from Phish.net & TapeHendge
            </p>
          </div>
        </div>
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} phashboards. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
