CREATE TABLE packaging (
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL UNIQUE,
    footprint INT NOT NULL,
);