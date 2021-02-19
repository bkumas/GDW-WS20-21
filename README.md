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

- Hier sind unsere REquests definiert. Sie können sie zum Testen verwenden 

## How to

### 1. Users
 * POST - Create a User with POST and JSON Body for the request with "username","age" and array with min 5 Strings for "interests". Use POST with  https://speakfellow.herokuapp.com/users
 * GET - GET information about all users with get https://speakfellow.herokuapp.com/users or GET information about a specific user like this https://speakfellow.herokuapp.com/users/1 (change the id at the end for different users with different user ids)
 * PUT - Update the Information about your User. PUT https://speakfellow.herokuapp.com/users/1 (id of the user at the end) and in Request Body as in JSON format write the values, that should be updated and how. You can update these values :  "username", "age", "interests" and "status". Users with same username can exist, but the id is unique.
 * DELETE - DELETE the User giving https://speakfellow.herokuapp.com/users/1 (id of the user at the end)

### 2. Missions
 * POST - Create a Mission for a user using https://speakfellow.herokuapp.com/missions and giving in Request Body the "userID" in JSON format.
 * GET -  GET information about all missions with get https://speakfellow.herokuapp.com/missions or GET information about a specific mission like this https://speakfellow.herokuapp.com/missions/1 (change the id at the end for different mission with different mission ids)
 * DELETE - DELETE the Mission giving https://speakfellow.herokuapp.com/missions/1 (id of the mission at the end)

### 3. Rooms
 * POST - POST - Create a Room with POST and JSON Body for the request with "userID", "missionID". Use POST with  https://speakfellow.herokuapp.com/rooms
 ##### Pay attention that a User cannot be joined in a Room with the Mission, if this mission is not created for him, means his ID is not in the mission itself. 
 * GET -  GET information about all rooms with get https://speakfellow.herokuapp.com/rooms or GET information about a specific rooms like this https://speakfellow.herokuapp.com/rooms/1 (change the id at the end for different room with different room ids). 
 ##### Pay attention: GET for a specific room also means that the user is entering the room and a result ID is automatically assigned in the response body, but also documented in Results resource. 
 * DELETE - DELETE the Room giving https://speakfellow.herokuapp.com/rooms/1 (id of the room at the end)

### 4. Results
 * POST - POST - Update a Result with POST and JSON Body for the request with "id" and "words_input" as an array with separate String words. "words_input" should be the result from the Voice Recognition on the client side and the POST evaluates the input, depending on the mission. Use POST with  https://speakfellow.herokuapp.com/results .
 ##### Pay attention that a Result is not created here, but updated.  
 ##### IMPORTANT NOTE: In index_local.js version, where the Voice Recognition is implemented but is not functioning on a deployed code, "words_input" are passed to the Result while GETting a Room and you don't have to give the words in the Request, only the ID of the result. 
 * GET - GET information about all results with get https://speakfellow.herokuapp.com/results or GET information about a specific result like this https://speakfellow.herokuapp.com/results/1 (change the id at the end for different result with different result ids).
 * DELETE - DELETE the Result giving https://speakfellow.herokuapp.com/results/1 (id of the result at the end)
