const API_KEY = "e3d2de7d";
const BASE_URL = "https://www.omdbapi.com/";
const COMMENT_RATING_URL = "http://127.0.0.1:8000/movies/"

// ===== Grab the HTML elements (ids must match index.html exactly) =====
const SearchForm = document.getElementById("SearchForm");
const SearchTitleInput = document.getElementById("SearchTitleInput");
const SearchYearInput = document.getElementById("SearchYearInput");
const ResultsDiv = document.getElementById("results");

// ===== Search: calls OMDb and shows the results =====
async function searchMovies() {
  const title = SearchTitleInput.value.trim();
  const year = SearchYearInput.value.trim();

  // OMDb needs a title; the year is only an extra filter (same as the Python model)
  if (title === "") {
    ResultsDiv.innerHTML = `<div class="alert alert-warning">Please enter a title.</div>`;
    return;
  }

  ResultsDiv.innerHTML = `<div class="text-center"><div class="spinner-border text-success"></div></div>`;

  let searchUrl = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(title)}&type=movie`;
  if (year !== "") {
    searchUrl += `&y=${encodeURIComponent(year)}`;
  }

  try {
    // 1st request: list of movies matching the title (and year)
    const response = await fetch(searchUrl);
    const data = await response.json();

    if (data.Response === "False") {
      ResultsDiv.innerHTML = `<div class="alert alert-warning">${data.Error}</div>`;
      return;
    }

    // 2nd request per movie: full details including the plot
    const details = await Promise.all(
      data.Search.map(movie =>
        fetch(`${BASE_URL}?apikey=${API_KEY}&i=${movie.imdbID}`).then(res => res.json())
      )
    );

    showResults(details);
  } catch (error) {
    ResultsDiv.innerHTML = `<div class="alert alert-danger">Something went wrong. Check your connection or API key.</div>`;
    console.error(error);
  }
}

// ===== Build one card per movie =====
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

function validate_fields(name, comment) {
  if (name === "") {
    alert("Please fill in your name")
    return;
  }
  if (comment === "") {
    alert("Please fill in a comment")
    return;
  }
}

function today(){
  const now = new Date();

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  return `${day}-${month}-${year}`;
}

function add_comment_rating(){
  const date = today()
  const imdb_id = document.getElementById("imdb_id").value;
  const name = document.getElementById("name").value;
  const rating = document.getElementById("rating").value;
  const comment = document.getElementById("comment").value;

  validate_fields(name, comment);

  fetch(
      COMMENT_RATING_URL,
      {
        method: "POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify(
            {
                  date: date,
                  imdb_id: imdb_id,
                  comment: comment,
                  name: name,
                  rating: Number(rating),
            }
        )
      }

  )
      .then(response=> {
        if(!response.ok){
          throw new Error(`Error HTTP: ${response.status}`)
        }
      }).catch(
          error=>{
            alert("The comment / rating could not be added");
            console.log("Error detail: ",error);

          }
  );
}

const API_URL = "http://127.0.0.1:8000";

const commentsBox = document.getElementById("commentsBox");
const commentsList = document.getElementById("commentsList");
const commentForm = document.getElementById("commentForm");
let currentImdbId = null;   // remembers which movie is open

// Open the box and load the comments
async function openComments(imdbID) {
  currentImdbId = imdbID;
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

  if (comments.length === 0) {
    commentsList.innerHTML = `<p class="text-body-secondary">No comments yet.</p>`;
    return;
  }

  commentsList.innerHTML = "";
  for (const c of comments) {
    commentsList.innerHTML += `
      <div class="border rounded p-2 mb-2">
        <strong>${escapeHtml(c.Name)}</strong> · ${c.Rating}/5
        <div class="small text-body-secondary">${c.Date}</div>
        <p class="mb-0">${escapeHtml(c.Comment)}</p>
      </div>`;
  }
}

// Send a new comment to your Python API
commentForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  await fetch(`${API_URL}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      imdb_id: currentImdbId,
      name: document.getElementById("commentName").value,
      rating: Number(document.getElementById("commentRating").value),
      date: today(),
      comment: document.getElementById("commentText").value
    })
  });

  commentForm.reset();     // empty the form
  await loadComments();    // show the list again, including the new comment
});

// Makes user text safe to show (stops people posting <script> as a comment)
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ===== One form, one Search button (Enter in either box also searches) =====
SearchForm.addEventListener("submit", (event) => {
  event.preventDefault();   // stop the page from reloading
  searchMovies();
});