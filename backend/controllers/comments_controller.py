from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from backend.models.db_queries import *
from backend.models.omdb_model import ModelApi

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)
# Create BaseModel
class CommentModel(BaseModel):
    date:str
    imdb_id:str
    comment:str
    name:str
    rating:float



# Search OMDb through Python
@app.get("/search", tags=["Search"])
def search_movies(title: str, year: str = ""):
    """
    Search movies by title and optionally also by year. Returns the title, year and plot in json format.
    """
    model = ModelApi()
    return model.search_with_details(title, year)
# Search by IMDB ID
@app.get("/movies/{imdb_id}", tags=["Movies"])
def movies_by_id(imdb_id:str):
    """
    Get a movie from omdb api by imdb_id.
    """
    return select_by_imdb_id(imdb_id)
# Add a comment / rating to a movie and save it comments_ratings.db
@app.post("/movies/", tags=["Movies"])
def add_comment_rating(body: CommentModel):
    """
    Insert a comment / rating into the database.
    """
    try:
        insert_comment_rating( [body.imdb_id, body.name, body.rating, body.date, body.comment] )
        return {"message": "Rating added"}
    except sqlite3.Error as error:
        return {"message": error}
