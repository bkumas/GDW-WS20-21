function create(user, users, present) {
    //choose user with same interests

    //find users
    let matches = [];
    for (const u in users) {
        let listOfInterests = commonInterests(user, users[u])
        if (users[u] !== user && listOfInterests !== null && user.dislikedUsers.includes(users[u].id) === false && users[u].status === "online")
            matches.push(users[u]);
    }
    //console.log(matches);
    if (matches.length <= 0) throw "No match Users found, try later!";

    // const match = matches[Math.random(matches.length)];
    const match = matches[Math.floor(Math.random() * matches.length)]
    //console.log(match);
    //generate the same interests and choose a topic for a mission
    const datamuse = require('datamuse');

    const interests = commonInterests(user, match);
    const topic = interests[Math.floor(Math.random() * interests.length)];

    let fs = require('fs');
    let missions = JSON.parse(fs.readFileSync('missions.json'));

    //let newmissions={};
    datamuse.request('/words?rel_trg=' + topic).then((datajson) => {
        let words_level1 = JSON.parse(JSON.stringify(datajson));
        //aus der gemeinsame interesse ein wort finden und mission erstellen
        //console.log(words_level1[0]);

        let random = Math.floor(Math.random() * words_level1.length);
        //console.log("randomi=" + random);
        let topic2 = words_level1[random];
        //console.log( "LAenge : "+words_level1.length);
        //console.log("WORD:"+topic2.word);
        //console.log(topic2);
        //let topic_word = topic2;
        //console.log(topic_word);
        datamuse.request('/words?rel_trg=' + topic2.word).then((datajson_level2) => {
            let words_level2 = JSON.parse(JSON.stringify(datajson_level2));
            //console.log(words_level2);
            let mission_words_level2 = [];

            for (let i = 0; i < 5; i++) {
                let random = Math.floor(Math.random() * words_level2.length);
                //console.log(random);
                mission_words_level2.push(words_level2[random].word);
            }
            //console.log(mission_words_level2);

            // console.log(mission_words_level2);

            //problem
            let newMission = {
                "id" : `${present+1}`,
                "topic": topic2.word,
                "words": mission_words_level2,
                "user1": user,
                "user2": match
            }
            //console.log(newMission);


            missions.push(newMission);
            console.log(newMission);
            fs.writeFile("missions.json", JSON.stringify(missions), function (err) {
                    if (err) throw err;
                    console.log('Missions updated...');
                }
            );


        })


    });

    // const missions = JSON.parse(fs.readFileSync('missions.json'));
    //console.log(matches);
    //console.log(match);
    //console.log(interests);
    //console.log(topic);


    //missions.push(test);
    //console.log(missions);

    return present+1;

}

function start() {

    const {vr} = require('voice-recognition');
    const recognizer = new vr('en-US');

//defaults
    recognizer.continuos = true;
    recognizer.sameThread = false;

// recognizer.on( "vc:audioLevel", (result) => {
//     console.log( result );
// });
    recognizer.listen()
    let result_all = [];
    recognizer.on( "vc:recognized", ( result ) => {
        console.log( result.Text );
        result_all.push(result.Text);

    });
    recognizer.on( "vc:audioProblem", ( problem ) => {
        console.log( problem );
    })

    console.log(result_all);
}

function running() {
}

function end() {
}

//compare arrays
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

module.exports = {create, start};
