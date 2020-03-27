CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL UNIQUE,
    code VARCHAR(13) NOT NULL UNIQUE,
    packaging VARCHAR(128),
    origin VARCHAR(128),
    score REAL NOT NULL,
    FOREIGN KEY(packaging) REFERENCES packaging(name)
);