from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from requests import *

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)

class CommentModel(BaseModel):
    date:str
    imdb_id:str
    comment:str
    name:str
    rating:float



@app.get("/movies/{imdb_id}", tags=["Movies"])
def movies_by_id(imdb_id:str):
    return select_by_imdb_id(imdb_id)

@app.post("/movies/", tags=["Movies"])
def add_comment_rating(body: CommentModel):
    try:
        insert_comment_rating( [body.imdb_id, body.name, body.rating, body.date, body.comment] )
        return {"message": "Rating added"}
    except sqlite3.Error as error:
        return {"message": error}
