DROP TABLE books;
CREATE TABLE IF NOT EXISTS books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  author VARCHAR(255),
  isbn VARCHAR(255),
  image_url VARCHAR(255),
  description TEXT
);

INSERT INTO books (title, author, isbn, image_url, description) 
VALUES('feed Sherry','Razan','do immediately after getting home','pets','Sherry is hungry');
