/**
 * Joke Generator Web Application
 * Express.js backend using Axios to fetch jokes from JokeAPI (https://v2.jokeapi.dev/)
 * and serving a static frontend with Vanilla JavaScript.
 */

const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static frontend files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base URL for JokeAPI
const JOKE_API_BASE = 'https://v2.jokeapi.dev/joke';

/**
 * Replaces placeholder names in joke content with user-specified name
 * @param {string} text - Joke setup or body text
 * @param {string} customName - Name provided by the user
 * @returns {string} Personalised text string
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
 * GET /api/joke
 * Returns a default safe random joke
 */
app.get('/api/joke', async (req, res) => {
  try {
    const response = await axios.get(`${JOKE_API_BASE}/Any`, {
      params: {
        'safe-mode': true
      },
      timeout: 5000
    });

    res.json({ success: true, joke: response.data });
  } catch (error) {
    console.error('Error fetching initial joke:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch initial joke. Please try again.'
    });
  }
});

/**
 * POST /api/joke
 * Fetches a customized joke based on category, filters, type, search term, and custom name
 */
app.post('/api/joke', async (req, res) => {
  const { category, type, search, customName, blacklists } = req.body;

  const selectedCategory = category || 'Any';
  const params = {};

  if (type && type !== 'any') {
    params.type = type;
  }

  if (search && search.trim() !== '') {
    params.contains = search.trim();
  }

  if (blacklists) {
    const flagsArray = Array.isArray(blacklists) ? blacklists : [blacklists];
    if (flagsArray.length > 0) {
      params.blacklistFlags = flagsArray.join(',');
    }
  }

  try {
    // Axios HTTP GET request to JokeAPI
    const response = await axios.get(`${JOKE_API_BASE}/${selectedCategory}`, {
      params,
      timeout: 7000
    });

    const jokeData = response.data;

    // JokeAPI returns error: true if no joke matches criteria
    if (jokeData.error) {
      return res.json({
        success: false,
        error: jokeData.message || 'No jokes found matching your criteria. Try adjusting your filters!'
      });
    }

    // Personalize joke text if custom name was supplied
    if (customName && customName.trim() !== '') {
      if (jokeData.type === 'single') {
        jokeData.joke = personalizeJokeText(jokeData.joke, customName);
      } else if (jokeData.type === 'twopart') {
        jokeData.setup = personalizeJokeText(jokeData.setup, customName);
        jokeData.delivery = personalizeJokeText(jokeData.delivery, customName);
      }
    }

    res.json({ success: true, joke: jokeData });
  } catch (error) {
    console.error('Error in /api/joke endpoint:', error.message);

    let errorMessage = 'An error occurred while communicating with the Joke API.';
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'The API request timed out. Please try again.';
    } else if (error.response && error.response.status === 404) {
      errorMessage = 'No jokes found matching your criteria. Try adjusting your filters!';
    }

    res.status(500).json({ success: false, error: errorMessage });
  }
});

// Start Express server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
