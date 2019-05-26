// Övning med routes     
const express = require('express');
const app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

const fileSystem = require('fs');
app.use(express.json());
const port = 3000;


let chatroomCountID = 0;
let chatRoom = require('./ChatRoom.json');

let messCountID = 0;
let chatRoom1 = require('./ChatRoom1.json');
let chatRoom2 = require('./ChatRoom2.json');
let chatRoom3 = require('./ChatRoom3.json');

// Gets chattmess =================================================
app.get('/', (req, res) => {    
    res.send(movieList);
});

// Create a chatroom & new mess ===============================================

function createID() { 
    for (let index = 0; index < movieList.data.length; index++) {
        let idMax = movieList.data[index];
        countID = idMax.id;
    }
    // Get the last id in my arr of movies
    console.log('Id innan förändring');
    console.log(parseInt(countID));
    
    countID++;
    console.log('44');
    console.log(countID);
    
    return countID;
}
app.post('/Room', (req, res) => {
    chatRoom
    
    
    /* console.log('Ny post');
    
    let chatroom = {
        id: JSON.stringify(createID()),
        name: req.body.name,
        rating: req.body.rating,
        genre: req.body.genre,
    };
    movieList.data.push(objForm);
    console.log(movieList);
    
    // Save the movies in an json file
    fileSystem.writeFile('express_JSON_API-RestAPI.json', JSON.stringify(movieList //debugging
        , null, 2
        ), function(err) {
            
            console.log(err);
            
        }); */
        
        res.send(movieList);
    });
app.post('/Mess', (req, res) => {
// Delete a movie ================================================
app.delete('/Movie/:id', (req, res) => {
    console.log('Tabort film');
    let targetId = parseInt(req.params.id);
    
    // Verify if ID
    if (!targetId) {
        res.status(400).end();
        return;
    }
    let deldMovieIndex = movieList.data.findIndex(delMovie => parseInt(delMovie.id) === targetId);
    if (deldMovieIndex !== -1) {
        
        // Remove the item in the list
        movieList.data.splice(deldMovieIndex, 1);
    }
    
    
    // Save the movies in an json file
    fileSystem.writeFile('express_JSON_API-RestAPI.json', JSON.stringify(movieList //debugging
    , null, 2
    ), function(err) {
        if (err) {
            console.log(err);
            res.status(204);
            return;
        }
            
    });
        
    res.status(204).end();
});

 app.listen(port, () =>  console.log(`Example app listening on port ${port}!`));