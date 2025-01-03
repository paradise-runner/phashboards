# phashboards

phashboards is a personal Phish dashboard that allows fans to visualize and analyze their show attendance and song statistics.

![GitHub](https://img.shields.io/github/license/paradise-runner/phashboards)
![GitHub package.json version](https://img.shields.io/github/package-json/v/paradise-runner/phashboards)
![GitHub last commit](https://img.shields.io/github/last-commit/paradise-runner/phashboards)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.0+-61DAFB.svg?logo=react&logoColor=white)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2+-black.svg?logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-F38020.svg?logo=cloudflare)](https://pages.cloudflare.com/)

![graphs](./graphs.png)

## Features

- Fetch and display user's Phish show history
- Visualize show statistics (by year, venue, tour)
- Display song statistics and frequency
- Analyze multi-day run data
- Interactive charts and graphs
- Responsive design for desktop and mobile

## Technologies Used

- React and Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui component library
- Recharts for data visualization
- Phish.net API integration

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Phish.net API key

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/phashboards.git
   cd phashboards
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your Phish.net API key:
   ```
   NEXT_PUBLIC_PHISH_NET_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Usage

1. Enter your Phish.net username in the input field.
2. Click "Fetch Data" to retrieve your show history.
3. Explore the various charts and statistics presented in the dashboard.
4. Use the theme toggle to switch between light and dark modes.
5. Click on "View All Shows" or "View All Songs" to see complete lists.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [GPL-3.0 License](LICENSE).

## Acknowledgements

- [Phish.net](https://phish.net) for providing the API and data
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Recharts](https://recharts.org/) for the charting library
- All the Phish fans who inspired this project

## More Projects
Check out my other projects at [hec.works](https://hec.works)! This is a personal portfolio site that showcases my work and projects. 