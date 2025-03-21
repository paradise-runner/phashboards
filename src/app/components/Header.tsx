import React from "react";
import { Sun, Moon, Laptop, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GradientHomeIcon from "../GradientHomeIcon";
import { PALETTES } from "../Utils";

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

interface HeaderProps {
  selectedPalette: string;
  onPaletteChange: (palette: string) => void;
  onHomeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
  selectedPalette,
  onPaletteChange,
  onHomeClick,
}) => {
  return (
    <nav className="bg-card shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
            phashboards
          </h1>
          <Button variant="ghost" size="icon" onClick={onHomeClick}>
            <GradientHomeIcon className="h-5 w-5" />
            <span className="sr-only">Home</span>
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <PaletteSelector
            selectedPalette={selectedPalette}
            onPaletteChange={onPaletteChange}
          />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Header;
