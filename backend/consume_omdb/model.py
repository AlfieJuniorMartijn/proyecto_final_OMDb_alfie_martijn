import requests as request


API = "http://www.omdbapi.com/?apikey=e3d2de7d&"

class ModelApi:
    def __init__(self):
        self.result = None
        self.formatted_result = []

    def format_results(self):
        try:
            id_dict = {}
            for movie in self.result["Search"]:
                id_dict[movie["imdbID"]] = movie["Title"]
            self.formatted_result = id_dict
        except KeyError:
            self.formatted_result = "No movies have been found with that title."

    def get_results(self, title, year):
        if year:
            self.result = request.get(f"{API}s={title}&y={year}&type=movie").json()
            self.format_results()
        else:
            self.result = request.get(f"{API}s={title}&type=movie").json()
            self.format_results()

    @staticmethod
    def get_plot(imdb_id):
        return request.get(f"{API}i={imdb_id}&plot=full").json()["Plot"]


