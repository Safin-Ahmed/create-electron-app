# Electron + React + TypeScript + Vite Starter Template

This starter template provides a minimal, production-ready setup for building Electron desktop applications using React, TypeScript, and Vite. It includes a custom window frame, system tray, live system statistics monitoring, and secure IPC communication.

## Features

- **Electron Main Process:** Handles window creation, system resource polling, IPC, and app lifecycle.
- **React Renderer Process:** Provides a modern UI with live-updating charts and custom window controls.
- **TypeScript:** Ensures type safety and better developer experience.
- **Vite:** Fast development and optimized production builds.
- **Secure IPC:** Preload script bridges the main and renderer processes securely.
- **Custom Window Frame:** Frameless window with custom close, minimize, and maximize buttons.
- **System Tray:** Minimize to tray functionality with a custom icon.
- **Live System Statistics:** Monitors and displays CPU, RAM, and Storage usage in real time.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone this repository:

   ```bash
   git clone <your-repo-url>
   cd <your-repo-name>
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Build for production:

   ```bash
   npm run build
   # or
   yarn build
   ```

5. Package the app:
   ```bash
   npm run package
   # or
   yarn package
   ```

## Project Structure

- **`src/electron/`:** Electron main process code.
  - `main.ts`: Entry point for the Electron app.
  - `preload.cts`: Preload script for secure IPC.
  - `resourceManager.ts`: Polls system resources.
  - `menu.ts`: Sets up the application menu.
  - `tray.ts`: Sets up the system tray.
  - `pathResolver.ts`: Resolves paths for assets and scripts.
  - `utils.ts`: Utility functions for IPC and environment checks.
- **`src/ui/`:** React renderer process code.
  - `main.tsx`: Entry point for the React app.
  - `App.tsx`: Main React component.
  - `Chart.tsx` & `BaseChart.tsx`: Chart components for displaying statistics.
  - `hooks/useStatistics.ts`: Custom hook for subscribing to system statistics.
- **`types.d.ts`:** Type definitions for shared types.
- **`vite.config.ts`:** Vite configuration.
- **`electron-builder.json`:** Electron Builder configuration.

## Customization

- **Window Frame:** Modify `src/electron/main.ts` to change window properties.
- **UI:** Modify `src/ui/App.tsx` and related components to change the UI.
- **System Statistics:** Modify `src/electron/resourceManager.ts` to change the polling logic.
- **Menu & Tray:** Modify `src/electron/menu.ts` and `src/electron/tray.ts` to change the menu and tray behavior.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
