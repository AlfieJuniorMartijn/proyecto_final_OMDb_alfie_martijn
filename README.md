# Movie Search

Web app to search movies via the OMDb API and leave comments and ratings.

## Features
- Search movies by title and (optional) year
- View plot and details for each result
- Read and add comments with star ratings (half stars supported)
- Average rating and rating distribution per movie

## Project structure (MVC)
- `backend/models/`: data access (OMDb API, SQLite database)
- `backend/controllers/`: FastAPI routes
- `backend/database/`: SQLite database and SQL script
- `frontend/`: HTML page and JavaScript (view)

## Installation
```
pip install -r requirements.txt
```

## Running

1. Go to omdbapi.com and get your API key. Save the API key in;
   ```
   config.py
   ```

2. Start the API from the project folder:
   ```
   fastapi dev main.py
   ```
3. Open `frontend/index.html` in your browser.

## API endpoints
| Method | Route | Description |
|---|---|---|
| GET | `/search?title=...&year=...` | Search movies |
| GET | `/movies/{imdb_id}` | Comments for a movie |
| POST | `/movies/` | Add a comment and rating |

## Technologies
Python, FastAPI, SQLite, JavaScript, Bootstrap, OMDb API

## Author
Alfie Martijn