const express = require('express');
const app = express();
app.use(express.json());
const Joi = require('joi');
let fs = require('fs');
app.get( '/' , (req, res) => {  res.send("Welcome to Speakfellow")});
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
    
        let presentUser = 0;
    for (let u in users) {
        if(presentUser < users[u].id)
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
    rewriteFile("users.json", users);

    res.location(`/users/${parseInt(presentUser) + 1}`);
    res.send(newUser);
});

app.put('/users/:id', (req, res) => {
    let users = JSON.parse(fs.readFileSync('users.json'));

    const user = users.find(u => parseInt(u.id) === parseInt(req.params.id));
    if (!user) res.status(404).send("ID of user is not found");
    
        //validate
    const schema = Joi.object({
        "username": Joi.string().min(3),
        "age": Joi.number(),
        "status" : Joi.string().valid("online", "offline"),
        "interests": Joi.array().min(5).max(15),
    });
    
    const schema_result= schema.validate(req.body)
    if (schema_result.error) {
        res.status(400).send(schema_result.error.details[0].message)
        return
    }    

        //update
    if (req.body.username) user.username = req.body.username;
    if (req.body.age) user.age = req.body.age;
    if (req.body.interests) user.interests = req.body.interests;
    if(req.body.status) user.status = req.body.status;
    
        rewriteFile("users.json", users);
    res.send(user);
})

app.delete('/users/:id', (req, res) => {
    let users = JSON.parse(fs.readFileSync('users.json'));
    const user = users.find(u => parseInt(u.id) === parseInt(req.params.id));
    if (!user) res.status(404).send("ID of User is not found");
    
    //delete user
    const index = users.indexOf(user);
    users.splice(index, 1);
    
        rewriteFile("users.json", users);
    res.send(user);
});
  
//missions - Beyza

app.get('/missions', (req, res) => {
    let missions = JSON.parse(fs.readFileSync('missions.json'));
    res.send(missions);
});

app.get('/missions/:id', (req, res) => {
    let missions = JSON.parse(fs.readFileSync('missions.json'));
    const mission = missions.find(r => parseInt(r.id) === parseInt(req.params.id));
    if (!mission) res.status(404).send("Mission with such ID does not exist.");
    res.send(mission);
});

app.post('/missions', (req, res) => {

    //validate
    const schema = Joi.object({
        "userID": Joi.string().required(),
    });
    const schema_result= schema.validate(req.body)
    if (schema_result.error) {
        res.status(400).send(schema_result.error.details[0].message)
        return
    }

    const fs = require('fs');
    const datamuse = require('datamuse');

    let users = JSON.parse(fs.readFileSync('users.json'));
    let missions = JSON.parse(fs.readFileSync('missions.json'));
    const user = users.find(u => parseInt(u.id) === parseInt(req.body.userID));
    if (!user) res.status(404).send("ID of User is not found");

    let presentMission = 0;
    for (let m in missions) {
        if(presentMission < missions[m].id)
        presentMission = missions[m].id;
        }
    let newMissionID = parseInt(presentMission) + 1;

    //search User matches
    let matches = [];
    for (const u in users) {
        //find users with min 3 common interests as me
        let listOfInterests = commonInterests(user, users[u])
        if (users[u] !== user && listOfInterests !== null && users[u].status === "online")
            matches.push(users[u]);
    }

    //if there are no matched Users
    if (matches.length <= 0) res.status(404).send( "No match Users found, try later!");

    //else choose one match randomly
    const match = matches[Math.floor(Math.random() * matches.length)];
    //find our common interests again
    const interests = commonInterests(user, match);
    //choose a word from our common interests as topic
    const topic = interests[Math.floor(Math.random() * interests.length)];

     //generate a topic(word) from second level associated words
    //level1
    datamuse.request('/words?rel_trg=' + topic).then((datajson) => {
        let words_level1 = JSON.parse(JSON.stringify(datajson));

        //choose one word randomly from the associated words with the topic
        let random = Math.floor(Math.random() * words_level1.length);
        let topic2 = words_level1[random];

        //search for associated words with the topic2 (from second level)
        //topic2 becomes our main topic for the mission
        datamuse.request('/words?rel_trg=' + topic2.word).then((datajson_level2) => {
            let words_level2 = JSON.parse(JSON.stringify(datajson_level2));
        
            //get 5 words randomly from the associated words with topic2
            let mission_words_level2 = [];
            for (let i = 0; i < 5; i++) {
                let random = Math.floor(Math.random() * words_level2.length);
                mission_words_level2.push(words_level2[random].word);
            }

            //create a new mission
            let newMission = {
                "id": newMissionID,
                "topic": topic2.word,
                "words": mission_words_level2,
                "user1": user,
                "user2": match
            }
            missions.push(newMission);
            rewriteFile('missions.json', missions);
        })
    });
    //return the ID of the new Mission
    res.location(`/missions/${newMissionID}`);
    res.send("New Mission created");

});

app.delete('/missions/:id', (req, res) => {
    let missions = JSON.parse(fs.readFileSync('missions.json'));
    const mission = missions.find(u => parseInt(u.id) === parseInt(req.params.id));
    if (!mission) res.status(404).send("ID of Mission is not found");

    //delete user
    const index = missions.indexOf(mission);
    missions.splice(index, 1);

    rewriteFile("missions.json", missions);
    res.send(mission);
});     
//rooms - Achelia
        
app.get('/rooms', (req, res) => {
    let rooms = JSON.parse(fs.readFileSync('rooms.json'));
    res.send(rooms);
});

app.get('/rooms/:id', (req, res) => {
    let results = JSON.parse(fs.readFileSync('results.json'));
    let rooms = JSON.parse(fs.readFileSync('rooms.json'));

    let room = rooms.find(r => parseInt(r.id) === parseInt(req.params.id));
    if (!room) res.status(404).send("Room with such ID does not exist.");

    //new result node should be created
    //new result node should be created
    let presentResult = 0;
    for (let r in results) {
        if(presentResult < results[r].id)
            presentResult = results[r].id;
    }
    //update the result parameter in json file with a valid result id
    const newResultsID = parseInt(presentResult) + 1;

    room.links[0].href = `/results/${newResultsID}`;
    console.log(room.links[0].href);
    let newResult = {
        "id" : newResultsID,
        "userID": room.userID,
        "missionID": room.missionID
    };

    results.push(newResult);
    rewriteFile('rooms.json', rooms);
    rewriteFile('results.json', results);

    res.send(room);

});

app.post('/rooms', (req, res) => {

    let rooms = JSON.parse(fs.readFileSync('rooms.json'));
    let users = JSON.parse(fs.readFileSync('users.json'));
    let missions = JSON.parse(fs.readFileSync('missions.json'));
    //validate
    const schema = Joi.object({
        "userID": Joi.string().required(),
        "missionID": Joi.string().required(),
    });

    const schema_result = schema.validate(req.body)
    if (schema_result.error) {
        res.status(400).send(schema_result.error.details[0].message)
        return
    }

    const user = users.find(u => parseInt(u.id) === parseInt(req.body.userID));
    if (!user) res.status(404).send("User can not be found!");

    const mission = missions.find(u => parseInt(u.id) === parseInt(req.body.missionID));
    if (!mission) res.status(404).send("Mission can not be found!");

    if(parseInt(req.body.userID) !== parseInt(mission.user1.id) &&  parseInt(req.body.userID)!==parseInt(mission.user2.id) ) {
        res.status(404).send("This user cannot access this room.");
    }

    let presentRoom = 0;
    for (let r in rooms) {
        if(presentRoom < rooms[r].id)
        presentRoom = rooms[r].id;
    }

    let newRoom = {
        "id": `${parseInt(presentRoom) + 1}`,
        "userID": req.body.userID,
        "missionID": req.body.missionID,
        "links": [
            {
                "rel": "result",
                "href": `/results/`
            }
        ]
    }
    rooms.push(newRoom);
    rewriteFile("rooms.json", rooms);

    res.location(`/rooms/${parseInt(presentRoom) + 1}`);
    res.send(newRoom);
});

app.delete('/rooms/:id', (req, res) => {
    let rooms = JSON.parse(fs.readFileSync('rooms.json'));
    const room = rooms.find(u => parseInt(u.id) === parseInt(req.params.id));
    if (!room) res.status(404).send("ID of Room is not found");

    //delete
    const index = rooms.indexOf(room);
    rooms.splice(index, 1);

    rewriteFile("rooms.json", rooms);
    res.send(room);
});
    
//results - Achelia
app.get('/results', (req, res) => {
    let results = JSON.parse(fs.readFileSync('results.json'));
    res.send(results);
});

app.get('/results/:id', (req, res) => {
    let results = JSON.parse(fs.readFileSync('results.json'));
    const result = results.find(u => parseInt(u.id) === parseInt(req.params.id));
    if (!result) res.status(404).send("ID of Result is not found");
    res.send(result);
});

//for update
app.post('/results',(req,res)=>{

    const schema = Joi.object({
        "id": Joi.string().required(),
        "words_input": Joi.array().required()
    });

    const schema_result = schema.validate(req.body)
    if (schema_result.error) {
        res.status(400).send(schema_result.error.details[0].message)
        return
    }

    const fs = require('fs');
    const datamuse = require('datamuse');

    let missions = JSON.parse(fs.readFileSync('missions.json'));
    let results = JSON.parse(fs.readFileSync('results.json'));

    const result = results.find(u => parseInt(u.id) === parseInt(req.body.id));

    // const words_input_lowerCase = req.body.words_input.map(w => w.toLowerCase());
    const words_input_lowerCase = req.body.words_input.map(w => w.toLowerCase());

    const mission_id = parseInt(result.missionID);
    console.log(mission_id);
    const mission = missions.find(u => parseInt(u.id) === mission_id);
    if (!mission)  res.status(404).send("ID of Mission is not found");
    let words_required = mission.words;

    datamuse.request('/words?rel_trg=' + mission.topic).then((datajson) => {
        const words_topic_all = JSON.parse(JSON.stringify(datajson)).map(i => i.word);

        //get all used words from the required words of the mission
        let words_required_res = [];
        for (let w in words_required) {
            if (words_input_lowerCase.includes(words_required[w])) words_required_res.push(words_required[w]);
        }
        console.log("words_required_res : " + words_required_res);

        //extract the required words of the mission from the whole set of words, associated with the topic
        const words_topic_all_minus = words_topic_all.filter(val => !words_required.includes(val));

        //get all used words from the whole set of words, associated with the topic
        let words_bonus = [];
        for (let w in words_topic_all_minus) {
            if (words_input_lowerCase.includes(words_topic_all_minus[w])) words_bonus.push(words_topic_all_minus[w]);
        }
        console.log("words_bonus: " + words_bonus);

        //calculate Points!
        let points = 0;
        if (words_required_res.length > 0) points = words_required_res.length * 20;

        //calculate Bonus!
        let bonus = 0;
        if (words_bonus.length > 0) bonus = words_bonus.length * 10;

        let resultNew =  {
            "id": result.id,
            "userID": result.userID,
            "missionID": result.missionID,
            "words_input" : words_input_lowerCase,
            "points": points,
            "bonus": bonus,
            "total": (points + bonus),
            "words_req": words_required_res,
            "words_bonus": words_bonus,
            "motivation_words": words_topic_all_minus
        }
        const index = results.indexOf(result);
        results.splice(index, 1);

        // //push the new and update the file
        results.push(resultNew);
        rewriteFile('results.json', results);

        res.location(`results/${result.id}`)
        res.send(resultNew);
    });

    // res.location(`results/${req.body.id}`);
    // res.send("result/evaluation created");
});

app.delete('/results/:id', (req, res) => {
    let results = JSON.parse(fs.readFileSync('results.json'));
    const result = results.find(u => parseInt(u.id) === parseInt(req.params.id));
    if (!result) res.status(404).send("ID of Result is not found");

    const index = results.indexOf(result);
    results.splice(index, 1);

    rewriteFile("results.json", results);
    res.send(result);

});

function rewriteFile(file, object, callback) {
    const fs = require('fs');
    fs.writeFile(file, JSON.stringify(object), function (err) {
            if (err) throw err;
            console.log(`File updated`);
        }
    )
    if (typeof callback == "function")
        callback();
}
//compare users' interests
function commonInterests(user1, user2) {
    let list = [];
    for (let i = 0; i < user1.interests.length; i++)
        for (let p = 0; p < user2.interests.length; p++) {
            if (user1.interests[i] === user2.interests[p])
                list.push(user1.interests[i])
        }
    if (list.length >= 3) return list
    else return null;
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

