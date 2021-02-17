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

app.get('/users/:id', (req, res) => {
    let users = JSON.parse(fs.readFileSync('users.json'));
    const user = users.find(u => parseInt(u.id) === parseInt(req.params.id))
    if (!user) res.status(404).send("ID of User is not found");
    res.send(user)
});

//missions - Beyza
//rooms - Achelia
//results - Achelia
