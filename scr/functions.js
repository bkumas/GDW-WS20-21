function rewriteFile(file, object, callback) {
    const fs = require('fs');
    fs.writeFile(file, JSON.stringify(object), function (err) {
            if (err) throw err;
            //if (err) throw err;
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

function create(user, users, present) {
    const datamuse = require('datamuse');
    const fs = require('fs');
    let missions = JSON.parse(fs.readFileSync('missions.json'));

    //search User matches
    let matches = [];
    for (const u in users) {
        //find users with min 3 common interests as me
        let listOfInterests = commonInterests(user, users[u])
        if (users[u] !== user && listOfInterests !== null && users[u].status === "online")
            matches.push(users[u]);
    }

    //if the are no matched Users
    if (matches.length <= 0) throw "No match Users found, try later!";

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

            let newMissionId = present + 1;
            //create a new mission
            let newMission = {
                "id": newMissionId,
                "topic": topic2.word,
                "words": mission_words_level2,
                "user1": user,
                "user2": match
            }

            missions.push(newMission);
            rewriteFile('missions.json', missions);
        })
    });
    //return the Id of the new Mission
    return present + 1;
}

function listening(room, newResultsId) {

    const datamuse = require('datamuse');
    const fs = require('fs');
    let missions = JSON.parse(fs.readFileSync('missions.json'));
    let results = JSON.parse(fs.readFileSync('results.json'));
    let rooms = JSON.parse(fs.readFileSync('rooms.json'));

    const {vr} = require('voice-recognition');
    const recognizer = new vr('en-US');
    recognizer.listen();

    const mission_id = parseInt(room.missionId);
    let words_input = [];

    recognizer.on("vc:recognized", (result) => {

        //split the sentences into words
        let words = result.Text.split(" ");
        console.log(words);

        //collect all sentences
        words.forEach(k => words_input.push(k));

        //set a timer for listening and save the result
        setTimeout(() => {

            console.log("Time is up. Stop speaking!");
            recognizer.stop();

            const mission = missions.find(u => parseInt(u.id) === parseInt(mission_id));
            if (!mission) throw "ID of mission is not found";

            let words_required = mission.words;

            //get the whole set of associated words fot the topic of the mission
            datamuse.request('/words?rel_trg=' + mission.topic).then((datajson) => {
                const words_topic_all = JSON.parse(JSON.stringify(datajson)).map(i => i.word);

                const words_input_lowerCase = words_input.map(w => w.toLowerCase());

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

                //create a new result
                let result = {
                    "id": newResultsId,
                    "userID": room.userId,
                    "missionID": room.missionId,
                    "words_req": words_required_res,
                    "words_bonus": words_bonus,
                    "motivation_words": words_topic_all_minus
                };
                results.push(result);
                rewriteFile('results.json', results);


                //find the room and update the rooms.json file
                let roomOld = rooms.find(r => parseInt(r.id) === parseInt(room.id));
                if (!roomOld) throw "Mission with such ID does not exist.";
                //delete the old
                const index = rooms.indexOf(roomOld);
                rooms.splice(index, 1);
                //push the new and update the file
                rooms.push(room);
                rewriteFile('rooms.json', rooms);
            });
        }, 10000); //10 sec
    });
}

module.exports = {create, listening, rewriteFile};