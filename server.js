'use strict';
//Aplication Depenencies (require)
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const superagent = require('superagent');
let pg = require('pg');
//application setup (port,server,use cors)
const PORT = process.env.PORT || 7000;
const server = express();
server.use(cors());
server.use(express.static('./public'));// connect the folders on the machine (locally)
const client = new pg.Client(process.env.DATABASE_URL);
server.set('view engine', 'ejs');// hi theeeere am using ejs !

//routes
server.get('/', (req, res) => {
  let SQL = `SELECT * FROM books;`;
  client.query(SQL)
    .then(result => {
      console.log(result.rows);
      res.render('pages/index', { books: result.rows });
    });
});
server.get('/books/:id', showaAllDetailsHandlerFun);
server.get('/searches/new', (req, res) => {
  res.render('pages/searches/new');
});
server.get('/addChosenBook', addBookToDB);
server.get('/sendBookInfoGet', bookHandlerFun);
server.get('/error', errorHandlerFunc);
server.get('/', (req, res) => {
  res.render('pages/index');
});
server.get('/searches/new', (req, res) => {
  res.render('pages/searches/new');
});


//error function
function errorHandlerFunc(req, res) {
  res.render('pages/error');
}

function bookHandlerFun(req, res) {
  let searchQuery = req.query.myText;// take it from the ejs form
  let query1 = req.query.search;// take it from the ejs form
  console.log(query1);
  let url = ``;
  if (query1 == 'auther') {
    url = `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}+inauther:${searchQuery}`;
  }
  else if (query1 == 'title') {
    url = `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}+intitle:${searchQuery}`;
  }

  superagent.get(url)
    .then(data => data.body.items.map(result => new Book(result.volumeInfo)))
    .then(bookInfoResult => res.render('pages/searches/show', { fn: bookInfoResult }))
    .catch(() => {
      let error = 'you have a problem in the superagent';
      res.render('pages/error', { er: error });
    });
}

// select * 
function showaAllDetailsHandlerFun(req, res) {
  let id = req.params.id;
  console.log(req.params.id);
  let SQL = `SELECT * FROM books WHERE id=$1`;
  let values = [id];
  client.query(SQL, values)
    .then(result => {
      console.log(result.rows);
      res.render('pages/books/details', { books: result.rows[0] });
    });
}
function addBookToDB(req, res) {
  let insertQuery = `INSERT INTO books (title,author,isbn,image_url,description) VALUES($1,$2,$3,$4,$5) RETURNING id`;
  let { title, author, isbn, image_url, description } = req.query;
  let values = [title, author, isbn, image_url, description];
  client.query(insertQuery, values)
    .then(result => {
      console.log(result.rows[0].id);
      res.redirect(`/books/${result.rows[0].id}`);
    });
}

//constructor
Book.all = [];
function Book(bookObj) {
  if (bookObj.imageLinks.thumbnail) {
    let splittedURL = bookObj.imageLinks.thumbnail.split('');
    let arr = ['s', 'p', 't', 't', 'h'];
    if (splittedURL[4] != 's') {
      for (let i = 0; i < 4; i++) {
        splittedURL.shift();
      }
      for (let i = 0; i < 5; i++) {

        splittedURL.unshift(arr[i])

        splittedURL.unshift(arr[i]);

      }
    }
    this.img = splittedURL.join('');
  }
  else {
    this.img = `https://i.imgur.com/J5LVHEL.jpg`;//ensure it is secure website
  }
  this.title = bookObj.title ? bookObj.title : ' There is no title for this book';
  this.descreption = bookObj.description ? bookObj.description : 'There is no descreption';
  this.autherName= bookObj.authors ? bookObj.authors[0]: 'Auther is not Known'; // array
  Book.all.push(this);
}

//listening 
client.connect()
  .then(() => {
    server.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
  });


