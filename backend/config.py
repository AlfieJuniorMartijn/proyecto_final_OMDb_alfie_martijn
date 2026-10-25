from pathlib import Path

API_KEY = ""
# This makes sure that the path will work on any device, no need to change it manually
DB_PATH = Path(__file__).parent / "database" / "comments_ratings.db"