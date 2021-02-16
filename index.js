const express = require('express');
const app = express();
app.use(express.json());
const Joi = require('joi');
const lib = require("./functions");

//read jsons
let fs = require('fs');
let users = JSON.parse(fs.readFileSync('users.json'));
let missions = JSON.parse(fs.readFileSync('missions.json'));
let rooms = JSON.parse(fs.readFileSync('rooms.json'));
let results = JSON.parse(fs.readFileSync('results.json'));


//users
app.get('/users', (req, res) => {
    res.send(users);
});

app.get('/users/:id', (req, res) => {
    const user = users.find(u => parseInt(u.id) === parseInt(req.params.id))
    if (!user) res.status(404).send("ID of User is not found");
    res.send(user)
});

app.post('/users', (req, res) => {
    //validate
    const schema = Joi.object({
        "username": Joi.string().min(3).required(),
        "age": Joi.string().required(),
        "interests": Joi.array().min(5).max(15).required()
    });
    const result = schema.validate(req.body)
    if (result.error) {
        res.status(400).send(result.error.details[0].message)
        return
    }

    let presentUser = 0;
    for (let u in users) {
        presentUser = users[u].id;
    }
    //create
    const newUser = {
        "id": `${parseInt(presentUser) + 1}`,
        "username": req.body.username,
        "age": req.body.age,
        "status": "online",
        "interests": req.body.interests,
    };

    users.push(newUser);
    lib.rewriteFile("users.json", users);

    res.location(`/users/${parseInt(presentUser) + 1}`);
    res.send(newUser);
});


app.put('/users/:id', (req, res) => {

    const user = users.find(u => parseInt(u.id) === parseInt(req.params.id));
    if (!user) res.status(404).send("ID of user is not found");

    //validate
    const schema = Joi.object({
        "username": Joi.string().min(3),
        "age": Joi.string(),
        "interests": Joi.array().min(5).max(15),
    });
    const result = schema.validate(req.body)
    if (result.error) {
        res.status(400).send(result.error.details[0].message)
        return
    }

    //update
    if (req.body.username) user.username = req.body.username;
    if (req.body.age) user.age = req.body.age;
    if (req.body.interests) user.interests = req.body.interests;
    //maybe better push---
    if (req.body.likedUsers) user.likedUsers = req.body.likedUsers;
    if (req.body.dislikedUsers) user.dislikedUsers = req.body.dislikedUsers;


    lib.rewriteFile("users.json", users);
    res.send(user);
})

app.delete('/users/:id', (req, res) => {

    const user = users.find(u => parseInt(u.id) === parseInt(req.params.id));
    if (!user) res.status(404).send("ID of User is not found");

    //delete user
    const index = users.indexOf(user);
    users.splice(index, 1);

    lib.rewriteFile("users.json", users);
    res.send(user);
});

//missions
app.get('/missions', (req, res) => {
    res.send(missions);
});

app.get('/missions/:id', (req, res) => {
    const mission = missions.find(r => parseInt(r.id) === parseInt(req.params.id));
    if (!mission) res.status(404).send("Mission with such ID does not exist.");
    res.send(mission);
});

app.post('/missions/users/:id', (req, res) => {

    const user = users.find(u => parseInt(u.id) === parseInt(req.params.id));
    if (!user) res.status(404).send("ID of User is not found");

    let presentMission = 0;
    for (let m in missions) {
        presentMission = missions[m].id;
    }

    //call external function
    const newMissionID = lib.create(user, users, parseInt(presentMission));

    res.location(`/missions/${parseInt(newMissionID)}`);
    res.send("New Mission created");

});

app.delete('/missions/:id', (req, res) => {

    const mission = missions.find(u => parseInt(u.id) === parseInt(req.params.id));
    if (!mission) res.status(404).send("ID of Mission is not found");

    //delete user
    const index = missions.indexOf(mission);
    missions.splice(index, 1);

    lib.rewriteFile("missions.json", missions);
    res.send(mission);
});

//rooms
app.get('/rooms', (req, res) => {
    res.send(rooms);
});

app.get('/rooms/:id', (req, res) => {
    let presentResult = 0;
    for (let r in results) {
        presentResult = results[r].id;
    }

    let room = rooms.find(r => parseInt(r.id) === parseInt(req.params.id));
    if (!room) res.status(404).send("Mission with such ID does not exist.");

    //update the result parameter in json file with a valid result id
    const newResultsId = parseInt(presentResult) + 1;

    room.links[0].href = `/results/${newResultsId}`;
    console.log(room.links[0].href);
    //use the updated room and start a listening function
    //a result will be created
    lib.listening(room, newResultsId);
    res.send(room);

});

app.post('/rooms', (req, res) => {

    if (!req.body.missionId) res.status(404).send("Mission can not be found!");
    if (!req.body.userId) res.status(404).send("User can not be found!");

    //validate
    const schema = Joi.object({
        "userId": Joi.string().required(),
        "missionId": Joi.string().required(),
    });

    const result = schema.validate(req.body)
    if (result.error) {
        res.status(400).send(result.error.details[0].message)
        return
    }

    let presentRoom = 0;
    for (let r in rooms) {
        presentRoom = rooms[r].id;
    }

    let newRoom = {
        "id": `${parseInt(presentRoom) + 1}`,
        "userId": req.body.userId,
        "missionId": req.body.missionId,
        "links": [
            {
                "rel": "result",
                "href": `/results/`
            }
        ]
    }
    rooms.push(newRoom);

    lib.rewriteFile("rooms.json", rooms);

    res.location(`/rooms/${parseInt(presentRoom) + 1}`);
    res.send(newRoom);
});

app.delete('/rooms/:id', (req, res) => {

    const room = rooms.find(u => parseInt(u.id) === parseInt(req.params.id));
    if (!room) res.status(404).send("ID of Mission is not found");

    //delete
    const index = rooms.indexOf(room);
    rooms.splice(index, 1);

    lib.rewriteFile("rooms.json", rooms);
    res.send(room);
});

//results
app.get('/results', (req, res) => {
    res.send(results);
});

app.get('/results/:id', (req, res) => {
    const result = results.find(u => parseInt(u.id) === parseInt(req.params.id));
    if (!result) res.status(404).send("ID of Result is not found");

    //calculate Points!
    let points = 0;
    if (result.words_req.length > 0) points = result.words_req.length * 20;

    //calculate Bonus!
    let bonus = 0;
    if (result.words_bonus.length > 0) bonus = result.words_bonus.length * 10;

    const evaluation = {
        "points": points,
        "bonus": bonus,
        "total": (points + bonus),
        result
    }
    res.send(evaluation);
});

app.delete('/results/:id', (req, res) => {

    const result = results.find(u => parseInt(u.id) === parseInt(req.params.id));
    if (!result) res.status(404).send("ID of Result is not found");

    const index = results.indexOf(result);
    results.splice(index, 1);

    lib.rewriteFile("results.json", results);
    res.send(result);

});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));