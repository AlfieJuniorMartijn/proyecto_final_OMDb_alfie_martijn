CREATE TABLE comments_ratings (
    "ID"      INTEGER PRIMARY KEY AUTOINCREMENT,
    "IMDB_ID" TEXT NOT NULL,
    "Name"    TEXT NOT NULL,
    "Rating"  REAL,
    "Date"    TEXT NOT NULL,
    "Comment" TEXT NOT NULL
);