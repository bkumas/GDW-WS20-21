### Speakfellow - Projektarbeit für Grundlagen des Web in TH Köln (WS 20-21)
Repository für GDW im WS 2020/21 von Beyza Kumas, Achelia Selim und Esra Sancak.

## Documentation

SpeakFellow - RESTful Web Service

Web Service, written in Node.js for finding a second level common interests between users and creating a mission with one topic and 5 words, creating a room for practicing english speaking and evaluating the result. 

#### !Note!

Voice Recognition is not implemented in the deployed version, but another version with that implementation exists in index_local.js file and can be run on your computer.
The difference exist in Post fucntion for results.

#### index.js

- POST 'results/' + JSON-Body { "id" : "??", "words_input" : [ "??", "??", "??"....]}

#### index_local.js 

- Voice recognition starts when you enter the room GET '/rooms/:id' and ends after 10 seconds. You can change that when you change the time variable at the beginning of the code.
- When you make POST 'results/' + JSON-Body {"id" : "??"} you don't need the words_input, because they are passed from the room to your result id.


#### Build

The actual version is 1.0.0 and is dependent from the following APIs - datamuse : "^1.0.5", express : "^4.17.1", joi : "^17.4.0", and voice-recognition : "^1.0.6".

Deployed in Heroku

URL : https://speakfellow.herokuapp.com/

- uses JSON files for request and response data types

Main Ressources : Users , Missions , Rooms , Results

#### Link für Postman Team
 
URL : https://identity.getpostman.com/login?cta=join-team&invite_code=d8c5e89cbdc3d96ea02b3bdeeef161ee&ws=0b607633-a0ba-45fd-8860-699d40dadf26&continue=https%3A%2F%2Fapp.getpostman.com%2Fweb-invite-accept%3Finvite_code%3Dd8c5e89cbdc3d96ea02b3bdeeef161ee%26ws%3D0b607633-a0ba-45fd-8860-699d40dadf26

- Hier sind unsere REquests definiert sie können sie zum Testen verwenden 
