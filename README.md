# Kwebbler Standup Manager (Chrome Extension)

Kwebbler is a developer-themed tool that automates and manages speaker order in daily standup meetings. It runs as a Chrome Extension, injecting a terminal-style UI directly into the Google Meet page.

## Features

- **Terminal UI:** A sleek, developer-console aesthetic.
- **Role System:** Join as a "Lead" to manage the meeting or as a "Participant".
- **Persistent Roster:** The Lead manages a persistent list of team members.
- **Easy Attendance:** The Lead can quickly mark absent members before starting.
- **Real-time Sync:** The meeting state (speaker order, current speaker) is synchronized in real-time for all participants using Firebase.
- **Automatic Room Creation:** Uses the Google Meet URL to create a shared, unique meeting room.

## Local Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### 1. Installation

Clone the repository and install the dependencies:

```bash
git clone <your-repo-url>
cd kwebbler-extension
npm install
```

### 2. Firebase Configuration

This project uses Firebase Realtime Database for real-time state synchronization.

1.  Create a new project in the [Firebase Console](https://console.firebase.google.com/).
2.  In your project, go to **Build > Realtime Database** and create a database. Start in **test mode** for now, which allows open read/write access.
3.  Go to **Project Settings** (click the gear icon) > **General**.
4.  Under "Your apps", click the web icon (`</>`) to register a new web app.
5.  After registering, you'll be given a `firebaseConfig` object. Copy these values.
6.  Open the `firebase-config.ts` file in the project and replace the placeholder values with your actual Firebase config keys.

### 3. Build the Extension

The source code is written in TypeScript and React (`.tsx`). You need to compile it into a single JavaScript file that Chrome can use.

Run the build script:

```bash
npm run build
```

This command uses `esbuild` to compile all source files and places the output into a `dist` folder. You will need to run this command every time you make changes to the source code.

### 4. Load the Extension in Chrome

1.  Open Google Chrome and navigate to `chrome://extensions`.
2.  Enable **"Developer mode"** using the toggle in the top-right corner.
3.  Click the **"Load unpacked"** button.
4.  In the file dialog, select the `dist` folder that was created by the build script.
5.  The "Kwebbler Standup Manager" extension will now appear in your list of extensions.

### 5. Test It Out

1.  Navigate to any Google Meet URL (e.g., `meet.google.com/new`).
2.  The Kwebbler terminal UI should appear in the bottom-right corner of the page.
3.  Open the Chrome DevTools (`Cmd+Option+I` or `Ctrl+Shift+I`) on the Google Meet tab to see console logs and debug your extension's code.