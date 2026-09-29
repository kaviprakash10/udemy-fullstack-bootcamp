# Chuckles & Bytes - Public API Joke Generator Web App

A full-stack web application built with **Node.js**, **Express.js**, **Axios**, and **Vanilla JavaScript** (HTML5, CSS3, ES6 JS) that integrates with [JokeAPI](https://sv443.net/jokeapi/v2/) to deliver customized, interactive jokes to users.

![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)
![Express](https://img.shields.io/badge/Express.js-4.x-blue.svg)
![Axios](https://img.shields.io/badge/Axios-1.x-purple.svg)
![Vanilla JS](https://img.shields.io/badge/JavaScript-ES6%2B-yellow.svg)

---

## 📌 Project Overview

This project was developed as part of the Udemy Fullstack Web Development Bootcamp capstone assignment for API integration. It demonstrates client-server architecture: an **Express.js** backend acts as an API middleware using **Axios** to communicate with an external REST API ([JokeAPI](https://sv443.net/jokeapi/v2/)), while a **Vanilla JavaScript** frontend dynamically fetches and presents data in an intuitive user interface.

---

## ✨ Features

- 🎭 **Category Selection**: Choose between *Programming*, *Misc*, *Dark*, *Pun*, *Spooky*, *Christmas*, or *Any* jokes.
- 🎯 **Joke Format Filtering**: Filter jokes by Single-line or Two-Part (Setup & Punchline) format.
- 👤 **Name Personalization**: Enter a custom name (e.g. *John*, *Alex*) to replace character names in jokes.
- 🔍 **Search Keyword**: Search for jokes containing specific terms (e.g., *java*, *doctor*, *cat*).
- 🛡️ **Blacklist Flagging**: Exclude unwanted content (NSFW, Political, Religious, Racist, Sexist, Explicit).
- 👁️ **Interactive Punchline Reveal**: Reveal the punchline on demand for setup/delivery jokes.
- 📋 **Copy to Clipboard**: One-click button to copy jokes directly to your clipboard.
- ⚠️ **Error Handling**: Responsive error notifications if no joke matches search criteria or upon network errors.

---

## 🛠️ Project Structure

```text
Joke-generator/
├── index.js             # Express.js REST API server & static file middleware
├── package.json         # Project dependencies & npm scripts
├── README.md            # Project documentation & instructions
├── .gitignore           # Git ignore configuration
└── public/              # Static frontend assets
    ├── index.html       # HTML5 web interface
    ├── css/
    │   └── styles.css   # Modern responsive CSS stylesheet
    └── js/
        └── app.js       # Vanilla JS DOM manipulation & Fetch API client
```

---

## 🚀 Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16.0 or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)

### Installation & Execution

1. **Clone or open the project folder:**
   ```bash
   cd Joke-generator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**

   - **Standard Mode:**
     ```bash
     npm start
     # or
     node index.js
     ```

   - **Development Mode (Auto-reload with Nodemon):**
     ```bash
     npm run dev
     # or
     npx nodemon index.js
     ```

4. **Open in Web Browser:**
   Navigate to:
   ```text
   http://localhost:3000
   ```

---

## 🌐 API Integration Details

The backend utilizes **Axios** to communicate with [JokeAPI v2](https://v2.jokeapi.dev/):
- **Endpoint**: `https://v2.jokeapi.dev/joke/{category}`
- **Method**: `GET`
- **Params**: `type`, `contains`, `blacklistFlags`, `safe-mode`

The frontend communicates asynchronously with the Express backend endpoints:
- `GET /api/joke`: Retrieves initial default safe joke.
- `POST /api/joke`: Sends filter payload and retrieves customized joke JSON data.

---

## 📜 Code Documentation & Comments

Detailed comments are included throughout `index.js`, `public/index.html`, and `public/js/app.js` explaining the server logic, routing, DOM manipulation, and asynchronous fetch handling.
