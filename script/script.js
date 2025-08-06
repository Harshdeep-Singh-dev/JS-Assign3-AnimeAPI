// API USED : https://kitsu.docs.apiary.io/#introduction/json:api

// COPYING DOM ELEMENTS
const form = document.getElementById('search-form');
const input = document.getElementById('anime-name');
const resultsContainer = document.getElementById('results-container');

// HANDLING FORM SUBMISSION
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const query = input.value.trim();
  resultsContainer.innerHTML = '';

  // VALIDATING INPUT
  if (!query) {
    alert('Please enter an anime title');
    return;
  }

  // FETCHING DATA FROM KITSU API
  try {
    const response = await fetch(`https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(query)}`, {
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json'
      }
    });

    // CHECKING IF RESPONSE IS OK
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    // PARSING JSON DATA
    const data = await response.json();
    const animeList = data.data;

    // CHECKING IF ANY ANIME FOUND
    if (animeList.length === 0) {
      resultsContainer.innerHTML = '<p>No anime found.</p>';
      return;
    }

    // DISPLAYING ANIME CARDS
    animeList.forEach(anime => {
      const attributes = anime.attributes;
      const titles = attributes.titles;
      const image = attributes.posterImage?.small || '';
      const title = titles.english || titles.en_jp || 'Untitled';
      const synopsis = attributes.synopsis?.slice(0, 180) + '...' || 'No synopsis available.';
      const episodes = attributes.episodeCount || 'N/A';
      const rating = attributes.averageRating || 'N/A';
      const startDate = attributes.startDate || 'Unknown';
      const endDate = attributes.endDate || 'Ongoing';

      const card = document.createElement('div');
      card.classList.add('character-card');

      // CREATING CARD CONTENT
      card.innerHTML = `
        <h3>${title}</h3>
        ${image ? `<img src="${image}" alt="${title}" />` : ''}
        <p><strong>Episodes:</strong> ${episodes}</p>
        <p><strong>Rating:</strong> ${rating}</p>
        <p><strong>Aired:</strong> ${startDate} to ${endDate}</p>
        <p>${synopsis}</p>
      `;

      // APPENDING CARD TO RESULTS CONTAINER
      resultsContainer.appendChild(card);
    });

  // HANDLING NO ANIME FOUND
  } catch (error) {
    console.error('Fetch error:', error);
    resultsContainer.innerHTML = '<p>There was an error fetching data. Please try again later.</p>';
  }
});
