export const PALETTES: { [key: string]: string[] } = {
  default: [
    "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088FE",
    "#00C49F", "#FFBB28", "#FF8042", "#a4de6c", "#d0ed57"
  ],
  fall: [
    "#3F83BF", "#75A3BF", "#F2A922", "#BF463B", "#F25252",
  ],
  bubble: [
    "#8704BF", "#5D04D9", "#0487D9", "#F2B705", "#F28705",
  ],
  sunset: [
    "#8C3B7F", "#B8A0D9", "#4D3B8C", "#F2A341", "#F28177",
  ],
  folk: [
    "#D97E8E", "#73D9D9", "#8CA62D", "#F2D027", "#F2622E",
  ],
};


// Function to shuffle an array (Fisher-Yates shuffle algorithm)
export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Function to get an evenly distributed color generator
export const getEvenlyDistributedColorGenerator = (dataLength: number, palette: string = 'default') => {
  const colors = PALETTES[palette] || PALETTES.default;
  const repeatedColors = colors.flatMap((color) =>
    Array(Math.ceil(dataLength / colors.length)).fill(color)
  ).slice(0, dataLength);

  const shuffledColors = shuffleArray(repeatedColors);
  let index = 0;

  return () => {
    const color = shuffledColors[index];
    index = (index + 1) % shuffledColors.length;
    return color;
  };
};