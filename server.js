'use strict';


const express = require('express');
require('dotenv').config();
const server = express();
const pg = require('pg');
const client  = new pg.Client(process.env.DATABASE_URL);
const superagent = require('superagent');
const cors = require('cors');
server.use(cors());

const PORT = process.env.PORT;

server.use(express.static('./public'));
server.set('view engine','ejs');

server.get('/searches/new',(req,res)=>{
  // res.render('pages/index');
  res.render('pages/searches/new.ejs');

});

server.get('*', (req, res) => {
  res.status(400).send('Not found');
});
server.use((error, req, res) => {
  res.status(500).send('Sorry, something went wrong');
});


client.connect()
  .then(() => {
    server.listen(PORT, ()=>{
      console.log(`Listening on port ${PORT}`);
    });
  });
