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

app.post('/users', (req, res) => {
    let users = JSON.parse(fs.readFileSync('users.json'));
    //validate
    const schema = Joi.object({
        "username": Joi.string().min(3).required(),
        "age": Joi.number().required().greater(16).less(40),
        "interests": Joi.array().min(5).max(15).required()
    });
    
     const schema_result = schema.validate(req.body)
    if (schema_result.error) {
        res.status(400).send(schema_result.error.details[0].message)
        return
    }   

//missions - Beyza
//rooms - Achelia
//results - Achelia
