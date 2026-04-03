# Mo-Draws 🎨

A modern web platform for storing and showcasing digital illustrations. Mo-Draws provides artists with a sleek, user-friendly interface to upload, manage, and display their digital artwork.

## 📋 Table of Contents
- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Design](#design)

## 🎯 About

Mo-Draws is a digital illustration platform designed for artists to share their creative work. The application provides a modern, intuitive interface with authentication capabilities, allowing artists to create accounts, manage their portfolios, and showcase their illustrations to the community.

## ✨ Features

- **Landing Page**: Welcoming hero section with FAQ section
- **User Authentication**: Sign up and login pages for secure user accounts
- **Modern UI Design**: Dark-themed interface with vibrant neon accent colors
- **Responsive Navigation**: Interactive header with dropdown menus
- **Artist Showcase**: Dedicated space for displaying digital illustrations

## 🛠️ Tech Stack

### Frontend
- **React** (v19.2.4) - JavaScript library for building user interfaces
- **React Router DOM** (v7.13.2) - Client-side routing for seamless navigation
- **React Scripts** (v5.0.1) - Build and development tooling

### Styling
- **CSS3** - Custom stylesheets with modern color schemes
- **Google Fonts** - Fredoka and Varela Round typefaces

### Testing & Quality
- **React Testing Library** - Component testing framework
- **Jest** - JavaScript testing framework
- **ESLint** - Code linting and quality checks

### Deployment
- **GitHub Pages** - Static site hosting (gh-pages)

## 📦 Installation

### Prerequisites
- Node.js (v14.0 or higher)
- npm or yarn package manager
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/tesssie-tech/Mo-draws.git
   cd mo-draws
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

The app will automatically open in your browser at `http://localhost:3000`

## 🚀 Getting Started

### Running the Application
```bash
npm start
```

### Building for Production
```bash
npm run build
```

### Running Tests
```bash
npm test
```

### Deploying to GitHub Pages
```bash
npm run deploy
```

## 📁 Project Structure

```
mo-draws/
├── public/
│   ├── index.html           # Main HTML file
│   ├── manifest.json        # Web app manifest
│   ├── robots.txt           # SEO robots configuration
│   └── img/                 # Static images
├── src/
│   ├── App.js               # Main application component
│   ├── App.css              # Main app styles
│   ├── LandingPage.js       # Landing page with hero section and FAQ
│   ├── LoginPage.js         # User login interface
│   ├── SignUpPage.js        # User registration interface
│   ├── index.js             # React entry point
│   ├── index.css            # Global styles
│   └── img/                 # Local image assets
├── build/                   # Production build output
├── package.json             # Project dependencies and scripts
└── README.md                # This file
```

## 🎨 Design

### Color Scheme
- **Primary Background**: Pure Black (#000000)
- **Primary Accent**: Hot Pink (#FF006B)
- **Secondary Accent**: Purple (#857AFF)
- **Highlight Color**: Cyan (#45FFEF)
- **Border Color**: Cyan (#45FFFF)

### Typography
- **Headings**: Fredoka (bold, 600 weight)
- **Body Text**: Varela Round (regular, 500 weight)
- **Letter Spacing**: Optimized for readability

### UI Features
- Dark theme for reduced eye strain
- Interactive dropdown navigation menus
- Expandable FAQ items
- Responsive button styling
- Smooth hover transitions

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Runs development server on port 3000 |
| `npm build` | Creates optimized production build |
| `npm test` | Launches test runner in interactive mode |
| `npm eject` | Exposes webpack configuration (irreversible) |
| `npm run deploy` | Deploys to GitHub Pages |

## 🌐 Live Demo

View the live application: [Mo-Draws GitHub Pages](https://tesssie-tech.github.io/Mo-draws/)

## 📝 License

This project is private and owned by tesssie-tech.

## 🤝 Support

For issues, questions, or suggestions, please open an issue on the [GitHub repository](https://github.com/tesssie-tech/Mo-draws/issues).

---

**Created with ❤️ for artists**

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
