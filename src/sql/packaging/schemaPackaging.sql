CREATE TABLE packaging (
    id SERIAL UNIQUE,
    name VARCHAR(128) NOT NULL PRIMARY KEY,
    footprint REAL NOT NULL,
    breakdown_time REAL NOT NULL,
    reusability INT NOT NULL
);