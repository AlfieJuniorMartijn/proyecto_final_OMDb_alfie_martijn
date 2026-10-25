from pathlib import Path

OMDB_API_KEY = "e3d2de7d&"
# This makes sure that the path will work on any device, no need to change it manually
DB_PATH = Path(__file__).parent / "database" / "comments_ratings.db"