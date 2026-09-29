/**
 * Express.js Web Application Server
 * Integrates JokeAPI (https://v2.jokeapi.dev/) using Axios and EJS Templating.
 * Features Tailwind CSS v4 styling, search filters, name personalization, and robust error handling.
 */

const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware setup
app.use(express.static(path.join(__dirname, 'public'))); // Serve static assets (CSS, images, client JS)
app.use(express.urlencoded({ extended: true }));       // Parse URL-encoded form data
app.use(express.json());                                // Parse JSON request bodies

// JokeAPI Base Endpoint
const JOKE_API_BASE = 'https://v2.jokeapi.dev/joke';

/**
 * Replaces placeholder names in joke content with user-specified name
 * @param {string} text - The raw joke text or setup/delivery string
 * @param {string} customName - User provided custom name
 * @returns {string} Personalised joke string
 */
function personalizeJokeText(text, customName) {
  if (!text || !customName || !customName.trim()) return text;
  const name = customName.trim();

  return text
    .replace(/\bChuck Norris\b/g, name)
    .replace(/\bJohn Doe\b/gi, name)
    .replace(/\bAlice\b/g, name)
    .replace(/\bBob\b/g, name);
}

/**
 * GET /
 * Render main view with an initial random safe joke
 */
app.get('/', async (req, res) => {
  try {
    // Axios request to JokeAPI for an initial safe joke
    const response = await axios.get(`${JOKE_API_BASE}/Any`, {
      params: { 'safe-mode': true },
      timeout: 6000
    });

    res.render('index', {
      data: response.data,
      error: null,
      query: {
        category: 'Any',
        type: 'any',
        search: '',
        customName: '',
        blacklists: ['nsfw', 'racist', 'sexist', 'explicit']
      }
    });
  } catch (error) {
    console.error('Error fetching initial joke:', error.message);
    res.render('index', {
      data: null,
      error: 'Unable to connect to JokeAPI. Click "Fetch Joke" to try again!',
      query: {
        category: 'Any',
        type: 'any',
        search: '',
        customName: '',
        blacklists: ['nsfw', 'racist', 'sexist', 'explicit']
      }
    });
  }
});

/**
 * POST /get-joke
 * Handles user search inputs, filter selections, and returns API data to EJS template
 */
app.post('/get-joke', async (req, res) => {
  const { category, type, search, customName, blacklists } = req.body;

  const selectedCategory = category || 'Any';
  const apiParams = {};

  // Joke format filter (single or twopart)
  if (type && type !== 'any') {
    apiParams.type = type;
  }

  // Keyword search term filter
  if (search && search.trim() !== '') {
    apiParams.contains = search.trim();
  }

  // Blacklist content flags filter
  if (blacklists) {
    const flagsArray = Array.isArray(blacklists) ? blacklists : [blacklists];
    if (flagsArray.length > 0) {
      apiParams.blacklistFlags = flagsArray.join(',');
    }
  }

  // Store user query preferences to populate form inputs in EJS
  const currentQuery = {
    category: selectedCategory,
    type: type || 'any',
    search: search || '',
    customName: customName || '',
    blacklists: blacklists ? (Array.isArray(blacklists) ? blacklists : [blacklists]) : []
  };

  try {
    // Axios HTTP request to JokeAPI
    const response = await axios.get(`${JOKE_API_BASE}/${selectedCategory}`, {
      params: apiParams,
      timeout: 8000
    });

    const jokeData = response.data;

    // Handle JokeAPI logical errors (e.g. no jokes match search filters)
    if (jokeData.error) {
      return res.render('index', {
        data: null,
        error: jokeData.message || 'No jokes found matching your filter criteria. Try adjusting your search!',
        query: currentQuery
      });
    }

    // Apply custom name substitution if provided by user
    if (customName && customName.trim() !== '') {
      if (jokeData.type === 'single') {
        jokeData.joke = personalizeJokeText(jokeData.joke, customName);
      } else if (jokeData.type === 'twopart') {
        jokeData.setup = personalizeJokeText(jokeData.setup, customName);
        jokeData.delivery = personalizeJokeText(jokeData.delivery, customName);
      }
    }

    // Render index.ejs with fetched API data
    res.render('index', {
      data: jokeData,
      error: null,
      query: currentQuery
    });
  } catch (error) {
    console.error('API integration error in /get-joke:', error.message);

    // Contextual error handling for user feedback
    let userErrorMessage = 'An error occurred while fetching data from the API.';

    if (error.response && error.response.data && error.response.data.message) {
      userErrorMessage = error.response.data.message;
    } else if (error.code === 'ECONNABORTED') {
      userErrorMessage = 'Request to JokeAPI timed out. Please try again.';
    } else if (error.response && error.response.status === 404) {
      userErrorMessage = 'No jokes match your exact search criteria.';
    }

    res.render('index', {
      data: null,
      error: userErrorMessage,
      query: currentQuery
    });
  }
});

// Start listening on configured port
app.listen(PORT, () => {
  console.log(`⚡ Server running in developer mode at http://localhost:${PORT}`);
});
