import sqlite3
from backend.config import DB_PATH
# Connection with sqlite databes for ratings / comments
class Connection:
    """
    A class that represents a database connection to the SQLite database
    """
    def __init__(self, sqlquery, parameter= []):
        self.connection = sqlite3.connect(DB_PATH)
        self.connection.row_factory = sqlite3.Row
        self.cursor = self.connection.cursor()
        self.answer = self.cursor.execute(sqlquery, parameter)