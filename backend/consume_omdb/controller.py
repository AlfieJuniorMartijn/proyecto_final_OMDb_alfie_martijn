from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from model import ModelApi

app = FastAPI()

# Allows your HTML page to call this server (otherwise the browser blocks it)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.get("/movies")
def get_movies(title: str, year: str = ""):
    model = ModelApi()
    model.get_results(title, year)
    return model.formatted_result
