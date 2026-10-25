import sqlite3

from backend.models.db_connection import Connection


def format_answer(answer):
    """
    Receives an answer from sqlite database and formats it in a readable list of dict.
    """
    result = []
    for row in answer.fetchall():
        result.append(dict(row))
    return result

def select_by_imdb_id(imdb_id):
    """
    Receives an imdb id and returns a list of dicts with all movies in the db with that id.
    """
    conn = Connection("SELECT * FROM comments_ratings WHERE IMDB_ID = ?", (imdb_id,))
    answer = format_answer(conn.answer)
    conn.connection.close()
    return answer

def insert_comment_rating(data):
    """
    Receives a list of BaseModel objects (data) and inserts it into the databes.
    """
    try:
        insert = Connection("INSERT INTO comments_ratings(IMDB_ID, Name, Rating, Date, Comment) VALUES (?,?,?,?,?);", data)
        insert.answer
        insert.connection.commit()
        insert.connection.close()
    except sqlite3.Error as error:
        print("Error:", error)

