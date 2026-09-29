/**
 * Client-Side JavaScript Application (Vanilla JS)
 * Chuckles & Bytes - Joke Generator
 *
 * Handles DOM manipulation, form submissions, asynchronous fetch requests
 * to the Express backend API, punchline toggling, and clipboard interaction.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Set dynamic current year in footer
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // Category chips selection handler
    const chipLabels = document.querySelectorAll('.chip-label');
    chipLabels.forEach(chip => {
        chip.addEventListener('click', () => {
            chipLabels.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            const radio = chip.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        });
    });

    // Form submission listener
    const jokeForm = document.getElementById('jokeForm');
    if (jokeForm) {
        jokeForm.addEventListener('submit', handleFormSubmit);
    }

    // "Another One!" button click listener
    const anotherBtn = document.getElementById('anotherBtn');
    if (anotherBtn) {
        anotherBtn.addEventListener('click', () => {
            if (jokeForm) jokeForm.dispatchEvent(new Event('submit'));
        });
    }

    // Copy to clipboard listener
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyJokeToClipboard);
    }

    // Initial load: Fetch default joke
    fetchDefaultJoke();
});

/**
 * Fetches initial default joke from backend API
 */
async function fetchDefaultJoke() {
    showLoading(true);
    hideError();

    try {
        const response = await fetch('/api/joke');
        const data = await response.json();

        if (data.success && data.joke) {
            renderJoke(data.joke);
        } else {
            showError(data.error || 'Failed to load initial joke.');
        }
    } catch (err) {
        console.error('Fetch error:', err);
        showError('Network error while connecting to server.');
    } finally {
        showLoading(false);
    }
}

/**
 * Handles user form submission to request a customized joke
 * @param {Event} e - Submit event
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    showLoading(true);
    hideError();

    const form = document.getElementById('jokeForm');
    const formData = new FormData(form);

    // Extract form data fields
    const category = formData.get('category') || 'Any';
    const type = formData.get('type') || 'any';
    const customName = formData.get('customName') || '';
    const search = formData.get('search') || '';
    const blacklists = formData.getAll('blacklists');

    const payload = { category, type, customName, search, blacklists };

    try {
        const response = await fetch('/api/joke', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.success && data.joke) {
            renderJoke(data.joke);
        } else {
            showError(data.error || 'No joke found matching your criteria.');
        }
    } catch (err) {
        console.error('API submission error:', err);
        showError('An error occurred while fetching your joke. Please check your connection.');
    } finally {
        showLoading(false);
    }
}

/**
 * Renders the joke object into the DOM structure
 * @param {Object} joke - The joke data returned from server
 */
function renderJoke(joke) {
    const jokeCard = document.getElementById('jokeCard');
    const badgeCategory = document.getElementById('badgeCategory');
    const badgeId = document.getElementById('badgeId');
    const badgeSafe = document.getElementById('badgeSafe');
    const jokeBody = document.getElementById('jokeBody');

    if (!jokeCard || !jokeBody) return;

    // Badges update
    badgeCategory.innerHTML = `<i class="fa-solid fa-tag"></i> ${joke.category}`;
    badgeId.textContent = `ID: #${joke.id}`;
    
    if (joke.safe) {
        badgeSafe.classList.remove('hidden');
    } else {
        badgeSafe.classList.add('hidden');
    }

    // Clear previous joke content
    jokeBody.innerHTML = '';

    if (joke.type === 'single') {
        const p = document.createElement('p');
        p.className = 'joke-text single-joke';
        p.textContent = joke.joke;
        jokeBody.appendChild(p);
    } else if (joke.type === 'twopart') {
        const container = document.createElement('div');
        container.className = 'twopart-joke';

        const setupP = document.createElement('p');
        setupP.className = 'joke-text setup-text';
        setupP.innerHTML = `<i class="fa-regular fa-circle-question"></i> ${escapeHTML(joke.setup)}`;

        const deliveryDiv = document.createElement('div');
        deliveryDiv.className = 'delivery-container';

        const revealBtn = document.createElement('button');
        revealBtn.type = 'button';
        revealBtn.className = 'btn btn-secondary btn-sm';
        revealBtn.innerHTML = `<i class="fa-regular fa-eye"></i> Reveal Punchline`;
        revealBtn.onclick = () => {
            deliveryP.classList.remove('hidden');
            revealBtn.style.display = 'none';
        };

        const deliveryP = document.createElement('p');
        deliveryP.className = 'joke-text delivery-text hidden';
        deliveryP.innerHTML = `<i class="fa-solid fa-face-grin-tears"></i> ${escapeHTML(joke.delivery)}`;

        deliveryDiv.appendChild(revealBtn);
        deliveryDiv.appendChild(deliveryP);

        container.appendChild(setupP);
        container.appendChild(deliveryDiv);

        jokeBody.appendChild(container);
    }

    jokeCard.classList.remove('hidden');
}

/**
 * Copies the currently visible joke text to the system clipboard
 */
function copyJokeToClipboard() {
    let textToCopy = '';

    const singleJoke = document.querySelector('.single-joke');
    const setupText = document.querySelector('.setup-text');
    const deliveryText = document.querySelector('.delivery-text');

    if (singleJoke) {
        textToCopy = singleJoke.innerText.trim();
    } else if (setupText) {
        textToCopy = setupText.innerText.trim();
        if (deliveryText && !deliveryText.classList.contains('hidden')) {
            textToCopy += '\n\n' + deliveryText.innerText.trim();
        }
    }

    if (textToCopy) {
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                const copyBtn = document.getElementById('copyBtn');
                if (copyBtn) {
                    const originalHTML = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
                    copyBtn.classList.add('btn-accent');
                    setTimeout(() => {
                        copyBtn.innerHTML = originalHTML;
                        copyBtn.classList.remove('btn-accent');
                    }, 2000);
                }
            })
            .catch(err => {
                console.error('Clipboard copy failed:', err);
            });
    }
}

/**
 * Toggles loading state UI visibility
 * @param {boolean} isLoading
 */
function showLoading(isLoading) {
    const loadingState = document.getElementById('loadingState');
    const jokeCard = document.getElementById('jokeCard');

    if (isLoading) {
        if (loadingState) loadingState.classList.remove('hidden');
        if (jokeCard) jokeCard.classList.add('hidden');
    } else {
        if (loadingState) loadingState.classList.add('hidden');
    }
}

/**
 * Displays error alert banner with specified message
 * @param {string} msg
 */
function showError(msg) {
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');
    const jokeCard = document.getElementById('jokeCard');

    if (errorMessage) errorMessage.textContent = msg;
    if (errorAlert) errorAlert.classList.remove('hidden');
    if (jokeCard) jokeCard.classList.add('hidden');
}

/**
 * Hides error alert banner
 */
function hideError() {
    const errorAlert = document.getElementById('errorAlert');
    if (errorAlert) errorAlert.classList.add('hidden');
}

/**
 * Helper to escape HTML strings to prevent XSS
 */
function escapeHTML(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
