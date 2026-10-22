import sqlite3

class Connection:
    def __init__(self, sqlquery, parameter= []):
        self.connection = sqlite3.connect('C:/Users/amartji/PycharmProjects/fetch_lol_data/proyecto_final_OMDb_alfie_martijn/backend/comments_ratings_api/comments_ratings.db')
        self.connection.row_factory = sqlite3.Row
        self.cursor = self.connection.cursor()
        self.answer = self.cursor.execute(sqlquery, parameter)