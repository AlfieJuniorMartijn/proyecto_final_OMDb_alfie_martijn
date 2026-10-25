const API_URL = "http://127.0.0.1:8000";

// Grab the HTML elements and save in variables
const SearchForm = document.getElementById("SearchForm");
const SearchTitleInput = document.getElementById("SearchTitleInput");
const SearchYearInput = document.getElementById("SearchYearInput");
const ResultsDiv = document.getElementById("results");

// Search: make request o python API => makes request to OMDB API
async function searchMovies() {
  const title = SearchTitleInput.value.trim();
  const year = SearchYearInput.value.trim();

  // Title is mandatory, year is optional
  if (title === "") {
    ResultsDiv.innerHTML = `<div class="alert alert-warning">Please enter a title.</div>`;
    return;
  }

  ResultsDiv.innerHTML = `<div class="text-center"><div class="spinner-border text-success"></div></div>`;

  let searchUrl = `${API_URL}/search?title=${encodeURIComponent(title)}`;
  if (year !== "") {
    searchUrl += `&year=${encodeURIComponent(year)}`;
  }

  try {
    // Python returns a list of movies, each with Title, Year, Plot and imdbID
    const response = await fetch(searchUrl);
    const movies = await response.json();

    if (movies.length === 0) {
      ResultsDiv.innerHTML = `<div class="alert alert-warning">No movies found.</div>`;
      return;
    }

    showResults(movies);
  } catch (error) {
    ResultsDiv.innerHTML = `<div class="alert alert-danger">Something went wrong. Is the Python server running?</div>`;
    console.error(error);
  }
}

// Build one card per movie
function showResults(movies) {
  ResultsDiv.innerHTML = "";

  for (const movie of movies) {
    const plot = movie.Plot && movie.Plot !== "N/A" ? movie.Plot : "No description available.";

    ResultsDiv.innerHTML += `
      <div class="card shadow-sm">
        <div class="card-body">
          <h4 class="card-title">${movie.Title}</h4>
          <p class="card-subtitle text-body-secondary">${movie.Year}</p>
          <p class="card-text mt-2">${plot}</p>
          <a href="#" class="link-success" onclick="openComments('${movie.imdbID}'); return false;">View comments and ratings</a>
        </div>
      </div>
    `;
  }
}
// Gives todays date in format DD-MM-YYYY
function today(){
  const now = new Date();

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  return `${day}-${month}-${year}`;
}

const commentsBox = document.getElementById("commentsBox");
const commentsList = document.getElementById("commentsList");
const commentForm = document.getElementById("commentForm");
let currentImdbId = null;   // remembers which movie is open

const reviewSummary = document.getElementById("reviewSummary");
const starInput = document.getElementById("starInput");
const starInputLabel = document.getElementById("starInputLabel");
let selectedRating = 0;     // the rating the user clicked (0 = nothing chosen yet)

// Builds 5 stars for a rating like 3.5: three full, one half, one empty
function starsHtml(rating) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    let fill = 0;
    if (rating >= i) {
      fill = 100;
    } else if (rating >= i - 0.5) {
      fill = 50;
    }
    html += `<span class="star">★<span class="fill" style="width: ${fill}%;">★</span></span>`;
  }
  return html;
}

// Draws the clickable stars in the form
function drawStarInput(rating) {
  starInput.innerHTML = starsHtml(rating);
  if (selectedRating === 0) {
    starInputLabel.textContent = "Click a star to rate";
  } else {
    starInputLabel.textContent = `Your rating: ${selectedRating} / 5`;
  }
}

// Works out which rating the mouse is pointing at (left half of a star = .5)
function ratingFromMouse(event) {
  const star = event.target.closest(".star");
  if (!star) return null;

  const position = Array.from(starInput.children).indexOf(star) + 1;   // 1 to 5
  const box = star.getBoundingClientRect();
  const onLeftHalf = event.clientX - box.left < box.width / 2;

  return onLeftHalf ? position - 0.5 : position;
}

// Preview while hovering, save on click, go back to the saved rating when the mouse leaves
starInput.addEventListener("mousemove", (event) => {
  const rating = ratingFromMouse(event);
  if (rating !== null) starInput.innerHTML = starsHtml(rating);
});

starInput.addEventListener("click", (event) => {
  const rating = ratingFromMouse(event);
  if (rating !== null) {
    selectedRating = rating;
    drawStarInput(selectedRating);
  }
});

starInput.addEventListener("mouseleave", () => drawStarInput(selectedRating));

drawStarInput(0);

// Reviews summary card
function showSummary(comments) {
  // Count how many ratings belong to each bar (3.5 counts as 4, 0.5 as 1)
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let total = 0;
  for (const c of comments) {
    total += c.Rating;
    counts[Math.max(1, Math.round(c.Rating))] += 1;
  }

  const average = comments.length > 0 ? total / comments.length : 0;
  const averageText = comments.length > 0 ? average.toFixed(1) : "–";

  // One bar per star value, 5 at the top
  let bars = "";
  for (let star = 5; star >= 1; star--) {
    const percent = comments.length > 0 ? (counts[star] / comments.length) * 100 : 0;
    bars += `
      <div class="d-flex align-items-center gap-2 mb-1">
        <div class="progress flex-grow-1" style="height: 8px;">
          <div class="progress-bar bg-dark" style="width: ${percent}%;"></div>
        </div>
        <small style="width: 10px;">${star}</small>
      </div>`;
  }

  reviewSummary.innerHTML = `
    <div class="border rounded-3 p-3 mb-3">
      <h4 class="mb-3">Reviews</h4>
      <div class="d-flex align-items-center gap-3">
        <div class="text-center">
          <div class="rounded-circle bg-body-secondary d-flex align-items-center justify-content-center mx-auto fs-2"
               style="width: 90px; height: 90px;">${averageText}</div>
          <div class="mt-2 text-nowrap">${starsHtml(average)}</div>
          <div class="small text-body-secondary">${comments.length} reviews</div>
        </div>
        <div class="flex-grow-1">${bars}</div>
      </div>
    </div>`;
}

// Open the box and load the comments
async function openComments(imdbID) {
  currentImdbId = imdbID;
  selectedRating = 0;         // start with empty stars for each movie
  drawStarInput(0);
  commentsBox.classList.remove("d-none");
  await loadComments();
}

// Close button
document.getElementById("closeComments").addEventListener("click", () => {
  commentsBox.classList.add("d-none");
});

// Get the comments from your Python API and show them
async function loadComments() {
  const response = await fetch(`${API_URL}/movies/${currentImdbId}`);
  const comments = await response.json();

  showSummary(comments);

  if (comments.length === 0) {
    commentsList.innerHTML = `<p class="text-body-secondary">No comments yet.</p>`;
    return;
  }

  commentsList.innerHTML = "";
  for (const c of comments) {
    commentsList.innerHTML += `
      <div class="border rounded p-2 mb-2">
        <strong>${c.Name}</strong> <span class="stars-sm">${starsHtml(c.Rating)}</span>
        <div class="small text-body-secondary">${c.Date}</div>
        <p class="mb-0">${c.Comment}</p>
      </div>`;
  }
}

// Send a new comment to Python API
commentForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (selectedRating === 0) {
    alert("Please click the stars to give a rating");
    return;
  }

  const response = await fetch(`${API_URL}/movies/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      imdb_id: currentImdbId,
      name: document.getElementById("commentName").value,
      rating: selectedRating,
      date: today(),
      comment: document.getElementById("commentText").value
    })
  });

  if (!response.ok) {
    console.log("Error:", response.status, await response.json());
    alert("The comment / rating could not be added");
    return;
  }

  commentForm.reset();     // empty the form
  selectedRating = 0;      // and the stars
  drawStarInput(0);
  await loadComments();    // show the list again, including the new comment
});


// ===== One form, one Search button (Enter in either box also searches) =====
SearchForm.addEventListener("submit", (event) => {
  event.preventDefault();   // stop the page from reloading
  searchMovies();
});