CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL UNIQUE,
    code VARCHAR(13) NOT NULL UNIQUE,
    packaging VARCHAR(128) REFERENCES packaging(name),
    origin VARCHAR(128),
    grade REAL NOT NULL
);