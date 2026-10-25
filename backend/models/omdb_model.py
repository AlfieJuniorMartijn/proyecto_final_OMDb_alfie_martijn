import requests as request
from backend.config import API_KEY

#Save api key
API = f"http://www.omdbapi.com/?apikey={API_KEY}"

class ModelApi:
    """
    A class used to model the obtained omdb API data to formatted, usable data.
    """
    def __init__(self):
        self.result = None
        self.formatted_result = []

    # Returns an empty list if nothing is found.
    def search_with_details(self, title, year=""):
        """
        Receives a title and a year optionally. If there is no response, returns an emtpy list. Else, returns a list of
        dictionaries containing imdbid, title, year and plot.
        """
        params = {"s": title, "type": "movie"}
        if year:
            params["y"] = year
        self.result = request.get(API, params=params).json()

        if self.result.get("Response") == "False":
            return []

        movies = []
        for movie in self.result["Search"]:
            details = request.get(API, params={"i": movie["imdbID"]}).json()
            movies.append({
                "imdbID": movie["imdbID"],
                "Title": details.get("Title", movie["Title"]),
                "Year": details.get("Year", movie["Year"]),
                "Plot": details.get("Plot", "N/A"),
            })
        return movies
