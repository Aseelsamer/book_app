'use strict';
//Aplication Depenencies (require)
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const superagent = require('superagent');
let pg = require('pg');




//application setup (port,server,use cors)
const PORT = process.env.PORT || 5000;
const server = express();
server.use(cors());

server.use(express.static('./public'));// connect the folders on the machine (locally)
server.set('view engine', 'ejs');// hi theeeere am using ejs !

server.get('/', (req, res) => {
  res.render('pages/index');
});
server.get('/searches/new', (req, res) => {
  res.render('pages/searches/new');

});


server.get('/sendBookInfoGet', bookHandlerFun);
function bookHandlerFun(req, res) {
  let searchQuery = req.query.myText;// take it from the ejs form
  let query1 = req.query.search;// take it from the ejs form
  console.log(query1);
  let url = ``;
  if (query1 == 'auther') {
    url = `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}+inauthor:${searchQuery}`;
  }
  else if (query1 == 'title') {
    url = `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}+intitle:${searchQuery}`;

  }
  superagent.get(url)
    .then(data => {
      for (let i = 0; i < data.body.items.length; i++) {
        let newObj = new Book(data.body.items[i].volumeInfo);
      }

      res.render('pages/searches/show', { fn: Book.all });
    })

    .catch(()=>{
      let error='you have a problem in the superagent';
      res.render('pages/error',{er:error});
    });

}
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
        splittedURL.unshift(arr[i]);
      }
    }
    this.img = splittedURL.join('');
  }
  else {
    this.img = `https://i.imgur.com/J5LVHEL.jpg`;//ensure it is secure website
  }
  this.title = bookObj.title;
  this.descreption = bookObj.description;
  this.autherName = bookObj.authors; // array
  Book.all.push(this);
}





server.listen(PORT, () => {
  console.log(`listining on port ${PORT}`);
});
