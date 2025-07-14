import { movies } from './movies.js';

function getMovieIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function updateMovieDetails(movie) {
  if (!movie) {
    document.getElementById("movie-title").textContent = "Movie Not Found!";
    document.getElementById("movie-description").textContent = "Sorry, the movie you're looking for doesn't exist.";
    return;
  }

  document.getElementById("movie-title").textContent = movie.title;
  document.getElementById("movie-description").textContent = movie.description;
  document.getElementById("movie-banner").src = movie.poster;
  document.getElementById("movie-banner").alt = movie.title;
}

function setupReviewSystem(movieId) {
  const movieKey = "cineReviews-" + movieId;
  const voteCountKey = "cineVotes-" + movieId;

  const reviewsContainer = document.getElementById("reviewsContainer");
  const totalVotesDisplay = document.getElementById("totalVotes");

  function loadReviews() {
    reviewsContainer.innerHTML = "";
    const reviews = JSON.parse(localStorage.getItem(movieKey) || "[]");

    reviews.forEach((item, index) => {
      const div = document.createElement("div");
      div.className = "bg-gray-800 p-4 rounded";

      const stars = "★".repeat(item.rating).padEnd(5, "☆");
      const reviewerName = item.user || `User ${index + 1}`;

      div.innerHTML = `
        <div class="flex justify-between items-start gap-4">
          <p class="flex-1" id="review-text-${index}">
            <strong>${reviewerName}:</strong> ${item.text}<br>
            <span class="text-yellow-400 text-lg">${stars}</span>
          </p>
          <div class="flex flex-col gap-2">
            <button onclick="editReview(${index})" class="text-yellow-400 hover:text-yellow-300 text-sm font-bold bg-gray-900 border border-yellow-400 px-2 py-1 rounded transition">
              ✏️ Edit
            </button>
            <button onclick="deleteReview(${index})" class="text-red-500 hover:text-red-400 text-sm font-bold bg-gray-900 border border-red-500 px-2 py-1 rounded transition">
              ✖ Delete
            </button>
          </div>
        </div>
      `;
      reviewsContainer.appendChild(div);
    });
  }

  function loadVoteCount() {
    const totalVotes = parseInt(localStorage.getItem(voteCountKey) || "0");
    totalVotesDisplay.textContent = totalVotes;
  }

  window.editReview = function (index) {
    const reviews = JSON.parse(localStorage.getItem(movieKey) || "[]");
    const reviewText = reviews[index].text;

    const reviewElement = document.getElementById(`review-text-${index}`);
    reviewElement.innerHTML = `
      <textarea id="edit-box-${index}" class="w-full mt-2 p-2 bg-gray-900 text-white border border-gray-600 rounded">${reviewText}</textarea>
      <button onclick="saveReview(${index})" class="mt-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded">
        ✅ Save
      </button>
    `;
  };

  window.saveReview = function (index) {
    const reviews = JSON.parse(localStorage.getItem(movieKey) || "[]");
    const newText = document.getElementById(`edit-box-${index}`).value.trim();
    if (!newText) return;

    reviews[index].text = newText;
    localStorage.setItem(movieKey, JSON.stringify(reviews));
    loadReviews();
  };

  window.deleteReview = function (index) {
    const reviews = JSON.parse(localStorage.getItem(movieKey) || "[]");
    reviews.splice(index, 1);
    localStorage.setItem(movieKey, JSON.stringify(reviews));

    let currentVotes = parseInt(localStorage.getItem(voteCountKey) || "0");
    currentVotes = Math.max(currentVotes - 1, 0);
    localStorage.setItem(voteCountKey, currentVotes);

    loadVoteCount();
    loadReviews();
  };

  loadVoteCount();
  loadReviews();
}

// MAIN
const movieId = getMovieIdFromURL();
const allMovies = [...movies];
const selectedMovie = allMovies.find(m => m.id === movieId);
updateMovieDetails(selectedMovie);
setupReviewSystem(movieId);
