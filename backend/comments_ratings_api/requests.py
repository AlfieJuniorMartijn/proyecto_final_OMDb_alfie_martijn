from connection import Connection
import sqlite3

def format_answer(answer):
    result = []
    for row in answer.fetchall():
        result.append(dict(row))
    return result

def select_by_imdb_id(imdb_id):
    conn = Connection("SELECT * FROM comments_ratings WHERE IMDB_ID = ?", (imdb_id,))
    answer = format_answer(conn.answer)
    conn.connection.close()
    return answer

def insert_comment_rating(data):
    try:
        insert = Connection("INSERT INTO comments_ratings(IMDB_ID, Name, Rating, Date, Comment) VALUES (?,?,?,?,?,?);", data)
        insert.answer
        insert.connection.commit()
        insert.connection.close()
    except sqlite3.Error as error:
        print("Error:", error)

