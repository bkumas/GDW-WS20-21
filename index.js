const express = require('express');
const app = express();
app.use(express.json());
const Joi = require('joi');
let fs = require('fs');

//users - Esra

app.get('/users', (req, res) => {
    let users = JSON.parse(fs.readFileSync('users.json'));
    res.send(users);
});

//missions - Beyza
//rooms - Achelia
//results - Achelia
