function starting(mission_id) {


// recognizer.on( "vc:audioLevel", (result) => {
//     console.log( result );
// });
    const {vr} = require('voice-recognition');
    const recognizer = new vr('en-US');
    recognizer.listen();
    let words_input = [];
    //let fs = require('fs');
    //let results = JSON.parse(fs.readFileSync('results.json'));

    recognizer.on("vc:recognized", (result) => {

        let words = result.Text.split(" ");
        console.log(words);
        words.forEach(k => words_input.push(k));
        // words_input.push(words);
        console.log(words_input);
        setTimeout(()=>{
            //OR A FUNCTION TO calculate the result!
           /* fs.writeFile('results.json',words_input.toString(),function(err) {
                    if (err) throw err;
                    //if (err) throw err;
                    console.log(`Results updated`);
                }
            );*/
            recognizer.stop();
            //function to calculate;
            calculate(words_input, mission_id);

        },10000); //10 sec
    });
}

function calculate (words_in, mission_id){
    let fs = require('fs');
    let missions = JSON.parse(fs.readFileSync('missions.json'));
    const mission = missions.find( u => parseInt(u.id) === parseInt(mission_id));
    //if doesn't exist
    if(!mission) throw "ID of mission is not found";
    let words_required = mission.words;
    console.log(words_required);

    const datamuse = require('datamuse');

    datamuse.request('/words?rel_trg=' + mission.topic).then((datajson) => {

        const words_topic_all = JSON.parse(JSON.stringify(datajson)).map(i => i.word);
        console.log(words_topic_all);


        const words_input = words_in.map(w => w.toLowerCase());
        console.log(words_input);

        let nr_required = [];
        for( let w in words_required){
            if (words_input.includes(words_required[w])) nr_required.push(words_required[w]);}
        console.log(nr_required);

        const words_topic_all_minus = words_topic_all.filter(val => !words_required.includes(val));

        console.log(words_topic_all_minus);
/*
        //console.log(words_topic_all);
        //console.log(words_required);

        let nr_bonus = [];

        for( let w in words_topic_all_minus){
            if(words_input.includes(words_topic_all_minus[w])) nr_bonus.push(words_topic_all_minus[w]);}


        console.log(nr_required)
        console.log(nr_bonus);
*/




        let result ={
            "userID" : "1",
            "missionID" : "1",
            "points" : "",
            "bonus" : "",
            "result" : "bonus + points",
            "note" : "You are great",
            "bonus_words" : "all bonus words"
        };





    });





}






function stoping_return(recognizer) {
    recognizer.stop();
}

function mainche(){
    const {vr} = require('voice-recognition');
    const recognizer = new vr('en-US');

//defaults
    recognizer.continuos = true;
    recognizer.sameThread = false;
    // starting(recognizer);
    setTimeout(()=>{},10000);
    stoping_return(recognizer);
}
starting("3");


//setTimeout(()=>{console.log("The conversation finished!")}, 4000);
//let x = 0;
//setTimeout(()=>{x=1; console.log("Finito")}, 4000);
//setInterval(()=>{if(x===1) recognizer.stop(); console.log("checking")},2000);
//recognizer.stop();

function sorting(){
    let words_input = ['Hi', 'Hello', 'sometimes', 'Goat'];
    //to lowerCase!
    const words_required = ['cat', 'goat', 'milk'];
// words_topic_all - words_required
    const words_topic_all = ['cat', 'goat', 'milk', 'time', 'hello'];

    words_input = words_input.map(w => w.toLowerCase());
    //console.log(words_input);

    let nr_required = [];
    for( let w in words_required)
        if (words_input.includes(words_required[w])) nr_required.push(words_required[w]);


    const words_topic_all_minus = words_topic_all.filter(val => !words_required.includes(val));

    console.log(words_topic_all_minus);

    console.log(words_topic_all);
    console.log(words_required);

    let nr_bonus = [];

    for( let w in words_topic_all_minus)
        if(words_input.includes(words_topic_all_minus[w])) nr_bonus.push(words_topic_all_minus[w]);


    console.log(nr_bonus);


}

// sorting()
