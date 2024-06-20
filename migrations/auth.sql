CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    description  VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username  VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    disabled BOOLEAN NOT NULL DEFAULT FALSE,
    roleid INTEGER REFERENCES roles(id)
);

INSERT INTO roles (description) VALUES ('admin'), ('therapist'), ('receptionist');
INSERT INTO users (name, username, password, roleid) VALUES ('admin', 'admin', '$2a$10$DZnycoUY3fm/umNnwtiEbekpx4oQV88Do5JZdZ8mzYyeHk5bozDou', 1)