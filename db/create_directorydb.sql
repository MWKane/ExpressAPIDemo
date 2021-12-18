CREATE TABLE books (
    id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL CHECK (id <= 999999),
    name STRING NOT NULL,
    author STRING NOT NULL,
    published DATE
);

INSERT INTO SQLITE_SEQUENCE (
    name,
    seq
) VALUES (
    'books',
    100000
);