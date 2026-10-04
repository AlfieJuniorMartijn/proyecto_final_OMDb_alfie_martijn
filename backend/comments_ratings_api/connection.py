import sqlite3

class Connection:
    def __init__(self, sqlquery, parameter= []):
        self.connection = sqlite3.connect('comments_ratings.db')
        self.connection.row_factory = sqlite3.Row
        self.cursor = self.connection.cursor()
        self.answer = self.cursor.execute(sqlquery, parameter)