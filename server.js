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

// Creates a connection between the server and my client and listen for mess
const io = socket(server);
io.on('connection', (socket) => {
    console.log('Anslutning upprättad', socket.id);

    // Send all the mess on the server at once the client is fired up
    io.sockets.emit('messegnes', chatMess); 

    // Listen on newMessegnes and send it to all the client
    socket.on('newMessegnes', (data) => {
        console.log('Incomming mess from client');
        console.log(data);
        
        let chatMessObj = {
            id: JSON.stringify(createID()),
            timeStamp: '', //
            usr: data.usr,
            chatMess: data.chatMess
        }
        console.log('chatMess');
        console.log(chatMessObj);
        
        chatMess.data.push(chatMessObj);
        // Save the movies in an json file
        fileSystem.writeFile('./server/ChatMess.json', JSON.stringify(chatMess //debugging
            , null, 2
            ), function(err) {
                
                console.log(err);     
            });
        
            // Send the mess on server at once ther is any incommin mess from the client
            io.sockets.emit('newMessegnes', chatMessObj);        
    });
});

let chatroomCountID = 0;

let messCountID = 0;
/*
// Gets chattmess =================================================
 app.get('/', (req, res) => {    
    res.send(movieList);
});

// Create a chatroom & new mess ===============================================
*/