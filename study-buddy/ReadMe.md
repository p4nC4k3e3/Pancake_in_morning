# Study Buddy

Study Buddy is a lightweight web application designed to help students organize their study sessions, manage tasks, and stay focused. The project combines a simple frontend interface with a Node.js backend to create a clean and functional productivity tool.

## Overview

This project is built to support students by providing:

- a clean study dashboard
- task management features
- session planning and organization
- a simple local web app experience
- a backend server to serve the application and handle requests

## Design

Study Buddy is designed with a simple, student-friendly interface that focuses on clarity, productivity, and ease of use.

### Design Goals

- Clean and distraction-free layout
- Intuitive navigation for quick access to study tools
- Modern visual style with minimal clutter
- Responsive design for desktop and small screens
- Friendly experience for students managing tasks and goals

### Visual Style

The interface combines a modern, minimal aesthetic with usability-focused design principles. The layout is intentionally simple so students can stay focused while planning study sessions, checking tasks, and moving through the app without unnecessary complexity.

### Design Folder

The project includes a dedicated design section in the `design/` folder, which contains styling and visual assets for the app’s interface.

## Features

- Responsive user interface
- Study planning workflow
- Simple backend using Node.js
- Easy local setup and development
- Lightweight project structure for learning and extension

## Project Structure

```text
study-buddy/
├── .env
├── .gitignore
├── design/
├── index.html
├── package.json
├── server.js
├── test-key.js
├── ReadMe.md
└── node_modules/
```

## Tech Stack

- HTML
- CSS
- JavaScript
- Node.js
- Express-style server setup (via custom server logic)

## Prerequisites

Before running the project, make sure you have the following installed:

- Node.js (recommended version 18 or later)
- npm

## Installation

1. Open your terminal in the project folder.
2. Install dependencies:

```bash
npm install
```

3. Start the application:

```bash
node server.js
```

4. Open the app in your browser at:

```text
http://localhost:3000
```

## Environment Configuration

The project includes a `.env` file for environment-specific values. Make sure it contains the required configuration for your local setup before running the app.

Example:

```env
PORT=3000
```

## Usage

Once the app is running, you can open the browser and use the interface to:

- view the study dashboard
- organize tasks or study goals
- use the app as a local productivity tool
- expand the functionality as needed

## Scripts

Check the `package.json` file for available project scripts. The usual setup is:

```bash
npm start
```

or

```bash
node server.js
```

## Development Notes

This project is ideal for learning full-stack basics, frontend design, and server-side integration. It can be extended with features such as:

- user authentication
- task database storage
- study reminders
- calendar integration
- analytics and progress tracking

## License

This project is for educational and personal use.

## Author

Study Buddy project

## Contributing

Contributions are welcome. If you would like to improve the app, feel free to fork the repository, make changes, and submit a pull request.
