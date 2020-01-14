CREATE TABLE ingredientsInProducts (
    product INT REFERENCES products(id),
    ingredient INT REFERENCES ingredients(id),
    amount NUMBER NOT NULL,
);