from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

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
    comment:str
    rating:float


@app.get("/movies", tags=["Movies"])
def index():
    return {"message":"welcome to movie API"}