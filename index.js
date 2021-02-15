const express = require('express');
const app = express();
app.use(express.json());
const Joi = require('joi');
const lib = require("./mission");

//read jsons
let fs = require('fs');
let users = JSON.parse(fs.readFileSync('users.json'));
let missions = JSON.parse(fs.readFileSync('missions.json'));
let rooms = JSON.parse(fs.readFileSync('rooms.json'));
/*let missions2 = JSON.parse(
    fs.readFile('missions.json', 'utf8' , (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        console.log(data)
    }))*/

/*function readFile(file){
    return JSON.parse(fs.readFileSync(file))
}*/


function rewriteFile(file, object){
    fs.writeFile (file, JSON.stringify(object), function(err) {
            if (err) throw err;
            //if (err) throw err;
            console.log(`File updated`);
        }
    )
}

//users
app.get('/users',(req,res) => {
    res.send(users);
});

app.get('/users/:id', (req,res) => {
    const user = users.find( u => parseInt(u.id) === parseInt(req.params.id))
    if(!user) res.status(404).send("ID of User is not found");
    res.send(user)
});

app.post('/users',(req,res) => {

    //validate
    const schema = Joi.object({
        "username" : Joi.string().min(3).required(),
        "age" : Joi.string().required(),
        "interests" : Joi.array().min(5).max(15).required()
    });
    const result = schema.validate(req.body)
    //console.log(result);
     if(result.error){
         res.status(400).send(result.error.details[0].message)
         return
     }

    let present =0;
    for(let u in users){
        present = users[u].id;
        //console.log(present);
    }
     //create
    const newUser = {
        "id" : `${parseInt(present) + 1 }`,
        "username" : req.body.username,
        "age" : req.body.age,
        "status" : "online",
        "interests" : req.body.interests,
        "likedUsers": [],
        "dislikedUsers" : []
    };

    users.push(newUser);
//MAKE IT users.json
    rewriteFile("users1.json", users);

    res.send(users);
});


app.put('/users/:id',(req,res) => {
    //find the user
    const user = users.find( u => parseInt(u.id) === parseInt(req.params.id));

    //if doesn't exist
    if(!user) res.status(404).send("ID of user is not found");

    //if invalid
    const schema = Joi.object({
        "username" : Joi.string().min(3),
        "age" : Joi.string(),
        "interests" : Joi.array().min(5).max(15),
        "likedUsers" : Joi.array(),
        "dislikedUsers" : Joi.array()
    });

    const result = schema.validate(req.body)
    //console.log(result);
    if(result.error){
        res.status(400).send(result.error.details[0].message)
        return
    }

    //update
    if(req.body.username) user.username = req.body.username;
    if(req.body.age) user.age = req.body.age;
    if(req.body.interests) user.interests = req.body.interests;
    if(req.body.likedUsers) user.likedUsers = req.body.likedUsers;
    if(req.body.dislikedUsers) user.dislikedUsers = req.body.dislikedUsers;

    //console.log(user);

    // for(let u in users){
    //     if(users.hasOwnProperty(req.params.id)) users[u] = user;
    // }
//MAKE IT users.json
    rewriteFile("users.json", users);
    res.send(users);
})

app.delete('/users/:id',(req,res) =>{

    //find the user
    const user = users.find( u => parseInt(u.id) === parseInt(req.params.id));

    //if doesn't exist
    if(!user) res.status(404).send("ID of User is not found");

    //delete user
    const index = users.indexOf(user);
    users.splice(index,1);

    //delete user at from liked and disliked users, can be done too

//MAKE IT user.json
    rewriteFile("users.json", users);
    res.send(user);
});

/*//waitingroom
app.get('/waitingroom', (req,res) => {
   res.send(waitingroom)
});

app.post('/waitingroom', (req,res)=>{
    //validate
    const schema = Joi.object(
        {
            "id" : Joi.string().required().not("0")
        }
    );

    const result = schema.validate(req.body)
    if(result.error){
        res.status(400).send(result.error.details[0].message)
        return
    }

    waitingroom.push(req.body.id);
    rewriteFile("waitingroom.json", waitingroom);
    res.send(waitingroom);
    res.location("")
});*/

//missions
app.get('/missions',(req,res) => {
    res.send(missions);
});

app.get('/missions/:id',(req,res) => {
    //mission the missions
    const mission = missions.find( r => parseInt(r.id) === parseInt(req.params.id));
    //if doesn't exist
    if(!mission) res.status(404).send("Mission with such ID does not exist.");
    res.send(mission);
});



app.post('/missions/users/:id',(req,res) =>{


    /*const schema = Joi.object(
    {
        "topic": Joi.string().required(),
        "words": Joi.array().required().max(3).min(3),
        "user1": {
            "id": Joi.string().required(),
            "username" : Joi.string().required(),
            "age": Joi.string().required(),
            "status": Joi.string().required().valid("online", "offline"),
            "likedUsers": Joi.array(),
            "dislikedUsers": Joi.array(),
            "Interests": Joi.array().min(5).max(15).required()
        },
        "user2" : {
            "id": Joi.string().required(),
            "username" : Joi.string().required(),
            "age": Joi.string().required(),
            "status": Joi.string().required().valid("online", "offline"),
            "likedUsers": Joi.array(),
            "dislikedUsers": Joi.array(),
            "Interests": Joi.array().min(5).max(15).required()
        }

    });*/

    const user = users.find( u => parseInt(u.id) === parseInt(req.params.id));
    if(!user) res.status(404).send("ID of User is not found");


    let present =0;
    for(let m in missions){
        present = missions[m].id;
        //console.log(present);
    }

    /*fs.readFile('missions.json', 'utf8' , (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        res.send(JSON.parse(data));
    });*/
    const newMissionID = lib.create(user,users,parseInt(present));
    //create a new room
    //the mission id is there
/*
    let presentRoom =0;
    for(let r in rooms){
        presentRoom = rooms[r].id;
        //console.log(present);
    }

    let newRoom = {
        "id" : `${parseInt(presentRoom) + 1}`,
        "missionId" : newMissionID
    }
    rooms.push(newRoom);
     rewriteFile('rooms.json', rooms);*/

    res.location(`/missions/${parseInt(newMissionID)}`);
    //res.location('novo');
    res.send("New Mission and Room created");


    //let neu = ()
    //const missions2 = JSON.parse(fs.readFileSync('missions.json'));

    //res.send(missions);

    //const user2 = users.find(u => parseInt(u.id) === parseInt(req.params.id));

    //console.log(missions);
   /* const result = schema.validate(newMission)
    //console.log(result);
    if(result.error){
        res.status(400).send(result.error.details[0].message)
    }*/
    //create room

    //make it sync!!!!

});

app.delete('/missions/:id', (req,res)=>{
    //find the user
    const mission = missions.find( u => parseInt(u.id) === parseInt(req.params.id));

    //if doesn't exist
    if(!mission) res.status(404).send("ID of Mission is not found");

    //delete user
    const index = missions.indexOf(mission);
    missions.splice(index,1);

    //delete user at from liked and disliked users, can be done too

    rewriteFile("missions.json", missions);
    res.send(mission);
});

app.get('/rooms', (req,res)=>{
    res.send(rooms);
});

app.get('/rooms/:id', (req,res)=>{
    //mission the missions
    const room = rooms.find( r => parseInt(r.id) === parseInt(req.params.id));
    //if doesn't exist


    if(!room) res.status(404).send("Mission with such ID does not exist.");
    res.send(room);






    //function running!!!
});

app.post('/rooms', (req,res) =>{

    if(!req.body.missionid) res.status(404).send("Mission can not be found!");

    let presentRoom =0;
    for(let r in rooms){
        presentRoom = rooms[r].id;
        //console.log(present);
    }

    let newRoom = {
        "id" : `${parseInt(presentRoom) + 1}`,
        "missionId" : req.body.missionid,
        "links": [
            {
                "rel": "result",
                "href": `/results/${parseInt(presentRoom) + 1}`
            }
            ]
    }
    rooms.push(newRoom);
    fs.writeFile("rooms.json", JSON.stringify(rooms), function (err) {
            if (err) throw err;
            console.log('Rooms updated...');
        }
    );
    res.location(`/rooms/${parseInt(presentRoom) + 1}`)
    res.send(newRoom);
});

app.delete('/rooms/:id', (req,res)=>{
    //find the user
    const room = rooms.find( u => parseInt(u.id) === parseInt(req.params.id));

    //if doesn't exist
    if(!room) res.status(404).send("ID of Mission is not found");

    //delete user
    const index = rooms.indexOf(room);
    rooms.splice(index,1);

    //delete user at from liked and disliked users, can be done too

    rewriteFile("rooms.json", rooms);
    res.send(room);

});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));







//user
//get
//post
//put
//delete

//missions
//get
//put
//post
//delete

//room
//
