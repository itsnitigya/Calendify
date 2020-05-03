CREATE SCHEMA IF NOT EXISTS calendify;
USE calendify;

DROP TABLE IF EXISTS users;
CREATE TABLE users(
    email TEXT NOT NULL,
    token TEXT NOT NULL
);

DROP TABLE IF EXISTS meeting;
CREATE TABLE meeting(
    m_id INT PRIMARY KEY AUTO_INCREMENT,
    link TEXT  NOT NULL,
    email TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL
);