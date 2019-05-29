// Övning med routes     
const express = require('express');
const socket = require('socket.io');


const app = express();
app.use(express.json());


const fileSystem = require('fs');
const port = 3001;
const server = app.listen(port, () =>  console.log(`Chatserver is listening on port ${port}!`));

let chatRooms = require('./server/ChatRoom.json');
let chatMess = require('./server/ChatMess.json');
console.log('JSON fil, 16');
console.log(chatMess);

// Set id for the mess ==================
let countID = 0;
function createID() { 
    for (let index = 0; index < chatMess.data.length; index++) {
        let idMax = chatMess.data[index];
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

const io = socket(server);
// Creates a connection between the server and my client
io.on('connection', function(socket) {
    console.log('Anslutning upprättad', socket.id);

    // Send the mess on server at once
    io.sockets.emit('chatMess', chatMess);
    socket.on('chatMess', function(data) {
        
        let chatMessObj = {
            id: JSON.stringify(createID()),
            timeStamp: '', //
            usr: data.usr,
            chatMess: data.chatMess
        }
        console.log('chatMess');
        chatMess.data.push(chatMessObj);
        
        // Save the movies in an json file
         fileSystem.writeFile('./server/ChatMess.json', JSON.stringify(chatMess //debugging
        , null, 2
        ), function(err) {
            
            console.log(err);    
        });
    // Send the mess on server at once ther is any incommin mess from the client
    io.sockets.emit('chatMess', chatMess);
        console.log('42');
        console.log(chatMess);
        
    })
});

let chatroomCountID = 0;

let messCountID = 0;
/*
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
}*/