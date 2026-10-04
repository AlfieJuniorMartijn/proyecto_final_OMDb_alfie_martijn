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

print(select_by_imdb_id("tt1201607"))