
//requirements: 
//Datamuse and Express installieren 


const express = require('express');
const app = express();

const datamuse = require('datamuse');
//usage of datamuse:
//let searchword = "car"
//datamuse.request('/words?rel_trg='+ searchword).then((json)=>{console.log(json);})


var fs = require('fs');

app.get('/',function(req,res){
    res.send('Welcome, now to go <<http://localhost:9000/topic>>' )
});

app.get('/topic', function (req,res){
   
    //Alternative: query parameter hier
    //ex.: localhost : 9000/topic?word = cars

     res.send("Now you can seach a word with Param like this << /cars >> ")

})

app.get('/topic/:word', function (req,res){
    //dynamic parameter
    const word = req.params.word

    datamuse.request('/words?rel_trg='+ word)
    .then((datajson) => 
    {
        res.json(datajson)
        //we request from datamuse a json file and send it as response

        fs.writeFile ("input.json", JSON.stringify(datajson), function(err) {
            if (err) throw err;
            console.log('mission file saved');
            }
        );
        //so it is beaing generated a mission for the room. when the room is accepted, this file is saved and deleted, after the call ends
        //if this mission is not accepted, then the file will be deleted too. 

        //this file will be used for the mission - to rate the conversation(to search words in it) and to give a mission, 
        //means to choose randomly 3 words

        
    })
})

app.listen(9000, function(req,res){
    console.log("~i am running on port 9000~")
});

