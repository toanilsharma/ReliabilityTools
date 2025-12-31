
# Reliability Tools

A comprehensive React-based suite of industrial reliability engineering calculators including MTBF, Weibull Analysis, Availability, and RBD modeling.

## Features

- **MTBF Calculator**: Compute Mean Time Between Failures.
- **Weibull Analysis**: Fit life data to 2-parameter Weibull (Rank Regression) and visualize plots.
- **RBD Builder**: Model Series/Parallel system configurations.
- **PM Scheduler**: Generate simple preventive maintenance calendars.
- **Spare Parts**: Estimate safety stock and reorder points.
- **SEO Optimized**: Full Schema.org support, meta tags, and high-quality content.
- **Privacy First**: Client-side calculations only. No data sent to server.

## Getting Started

### Prerequisites

- Node.js 18+
- NPM or Yarn

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

### Deployment

#### Vercel (Recommended)

1. Push code to GitHub/GitLab/Bitbucket.
2. Import project into Vercel.
3. Framework Preset: Create React App (or Vite).
4. Build Command: `npm run build`.
5. Output Directory: `build` (or `dist`).
6. Deploy.

#### Netlify

1. Drag and drop the `build` folder to Netlify Drop or connect Git repository.
2. Build command: `npm run build`.
3. Publish directory: `build`.

## AdSense & Analytics Setup

### Google Analytics (GA4)
1. Create a GA4 property in Google Analytics.
2. Copy your Measurement ID (`G-XXXXXXXXXX`).
3. Open `index.html` and uncomment the Google Analytics script block in the `<head>`.
4. Replace `G-XXXXXXXXXX` with your ID.

### Google AdSense
1. Approve your site in Google AdSense.
2. Copy your Publisher ID (`ca-pub-XXXXXXXXXXXXXXXX`).
3. Open `index.html` and uncomment the AdSense script block in the `<head>`.
4. Replace `ca-pub-XXXXXXXXXXXXXXXX` with your ID.
5. **Recommended Ad Slots**:
   - **Sidebar**: Use a vertical display ad in the layout sidebar (desktop only).
   - **In-Article**: Place native ads between the "Explanation" and "Calculator" sections on tool pages.
   - **Footer**: A horizontal leaderboard above the footer is non-intrusive.

## Testing Checklist

### Unit Tests
- [x] Verify MTBF calculation logic (Time / Failures).
- [x] Verify Availability formula (MTBF / (MTBF + MTTR)).
- [x] Verify RBD Series/Parallel logic.

### End-to-End Test Scenario (Manual or Cypress)
1. Navigate to Homepage.
2. Click "Start MTBF Calculator".
3. Enter "8760" for hours, "4" for failures.
4. Click "Calculate".
5. Verify result is "2,190 Hours".
6. Click "Copy Result" button.
7. Verify toast notification appears.

### Lighthouse & Performance
- [x] Performance > 90 (Lazy loading implemented for charts).
- [x] Accessibility > 90 (ARIA labels, semantic HTML).
- [x] SEO > 90 (Meta descriptions, JSON-LD schema present).

## License

MIT License. Free for educational and commercial use.

## Author

**Anil Sharma**
