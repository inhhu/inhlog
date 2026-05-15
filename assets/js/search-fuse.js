/**
 * Fuse.js search integration.
 * This file is loaded only on the /search page when Fuse.js is enabled.
 *
 * Security: All DOM rendering uses createElement + textContent (no innerHTML).
 * UX: Loading indicator shown until index is ready; error state on fetch failure.
 */
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('fuse-search-input');
  const searchResults = document.getElementById('fuse-search-results');
  let fuse = null;

  // Derive search index URL from the data attribute set by Hugo template.
  // This supports both root and subdirectory deployments (e.g., /blog/index.json).
  // 末尾のスラッシュの有無に関わらず、正しく index.json を指すように調整
  // 修正版：URLの組み立てを安全にする
  //let baseUrl = searchInput.dataset.baseUrl || '/';
  
  // 末尾にスラッシュがなければ足す
  //const baseUrl = searchInput.dataset.baseUrl || '/';
  //const indexUrl = baseUrl + 'index.json';
  // もし data-base-url が空だったら、強制的にルートにする
  //const rawBaseUrl = searchInput.dataset.baseUrl;
  //const baseUrl = (rawBaseUrl && rawBaseUrl !== "") ? rawBaseUrl : "/";
  //const indexUrl = searchInput.dataset.indexUrl;
  // 他の変数は消して、これだけにしてください
  const indexUrl = '/inhlog/index.json';

  // 1. Show loading state
  searchInput.disabled = true;
  searchInput.placeholder = 'Loading search...';
  const loadingMsg = document.createElement('p');
  loadingMsg.className = 'search-loading';
  loadingMsg.textContent = 'Loading search index...';
  searchResults.appendChild(loadingMsg);

  // 2. Fetch the search index
  fetch(indexUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('HTTP ' + response.status);
      }
      return response.json();
    })
    .then(json => {
      // 3. Initialize Fuse.js
      fuse = new Fuse(json, {
        keys: ['title', 'content', 'tags', 'categories'],
        includeScore: true,
        // 以下の3つを書き換え・追記
        threshold: 0.4,       // 少し緩める（0.0〜1.0）
        distance: 10000,      // 本文が長い場合、ここを大きくしないと後半が無視されます
        ignoreLocation: true, // どこに単語があっても見つけるようにする
        minMatchCharLength: 1
      });
      // Remove loading indicator and enable input
      if (loadingMsg.parentNode) {
        loadingMsg.parentNode.removeChild(loadingMsg);
      }
      searchInput.disabled = false;
      searchInput.placeholder = 'Search for articles...';

      // If a ?q= param is present, pre-fill and run the search
      const urlQuery = new URLSearchParams(window.location.search).get('q');
      if (urlQuery) {
        searchInput.value = urlQuery;
        if (urlQuery.length >= 2) {
          displayResults(fuse.search(urlQuery));
        }
      }

      searchInput.focus();
    })
    .catch(error => {
      // Show error state
      clearResults();
      const errorMsg = document.createElement('p');
      errorMsg.className = 'search-error';
      errorMsg.textContent = 'Search is currently unavailable. Please try again later.';
      searchResults.appendChild(errorMsg);
      searchInput.disabled = true;
      searchInput.placeholder = 'Search unavailable';
      console.error('Failed to load search index:', error);
    });

  // 4. Add event listener for search input
  searchInput.addEventListener('input', () => {
    const query = searchInput.value;
    if (query.length < 2) {
      clearResults();
      return;
    }

    // Guard against searching before index is ready
    if (!fuse) {
      clearResults();
      const waitMsg = document.createElement('p');
      waitMsg.className = 'search-loading';
      waitMsg.textContent = 'Still loading...';
      searchResults.appendChild(waitMsg);
      return;
    }

    const results = fuse.search(query);
    displayResults(results);
  });

  // 5. Clear results safely (no innerHTML)
  function clearResults() {
    while (searchResults.firstChild) {
      searchResults.removeChild(searchResults.firstChild);
    }
  }

  // 6. Display results using safe DOM construction (no innerHTML)
  function displayResults(results) {
    clearResults();

    if (results.length === 0) {
      const noResults = document.createElement('p');
      noResults.textContent = 'No results found.';
      searchResults.appendChild(noResults);
      return;
    }

    results.forEach(({ item }) => {
      const article = document.createElement('article');
      article.className = 'result-item';

      const heading = document.createElement('h3');
      heading.className = 'result-title';

      const link = document.createElement('a');
      link.href = item.uri;
      link.textContent = item.title;
      heading.appendChild(link);

      const snippet = document.createElement('p');
      snippet.className = 'result-snippet';
      snippet.textContent = item.content.substring(0, 150) + '...';

      article.appendChild(heading);
      article.appendChild(snippet);
      searchResults.appendChild(article);
    });
  }
});
