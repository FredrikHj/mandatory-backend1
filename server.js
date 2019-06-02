// Övning med routes     
const express = require('express');
const app = express();
app.use(express.json());
const fileSystem = require('fs');

const socket = require('socket.io');

const port = 3001;
const server = app.listen(port, () =>  console.log(`Chatserver is listening on port ${port}!`));
let roomSetting =  require('./server/roomSetting.json');

// Create a chatRoom
let roomId  = () => { 
    for (let index = 0; index < roomSetting.length; index++) {
        let idMax = roomSetting[index];
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
app.post('/NewRoom', (req, res) => {
    let roomSettingObj = {
        id: JSON.stringify(roomId()),
        name: req.body.roomName,
    }
    roomSetting.push(roomSettingObj);
    let roomBody = {
        config: {
            id: JSON.stringify(roomId() - 1), // -1 = Give the room correct ID
            name: req.body.roomName,
            userTyped: [],
            "status": "",
            "content-type": "",
        },
        messegnes: [],
    } 

    console.log(roomBody);
    // Save some setting of the chatRooms
    fileSystem.writeFile('./server/roomSetting.json', JSON.stringify(roomSetting //debugging
        , null, 2
        ), function(err) {
            
            console.log(err);     
        });    

    // Save the new room into a json files named as room + its ID
    fileSystem.writeFile('./server/rooms/r' + roomBody.config.id + '_' + roomBody.config.name + '.json', JSON.stringify(roomBody //debugging
        , null, 2
        ), function(err) {
            
            console.log(err);     
        });    
});
// Show a list with all rooms
app.get('/RoomList', (req, res) => {
    console.log(req.body);
    res.status(200).send(roomSetting);
});

// Get into a specific room
app.get('/ChatRoom:', (req, res) => {
    console.log('71');
    
    console.log(req.param);
    res.status(200).send(roomSetting);
});
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
/* io.on('connection', (socket) => {
    console.log('Anslutning upprättad', socket.id);

    socket.join('some room');
    // Send all messegnes on the server at once the client is open
    
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
}); */
let chatroomCountID = 0;

let messCountID = 0;
/*
// Gets chattmess =================================================
app.get('/', (req, res) => {    
    res.send(movieList);
});

// Create a chatroom & new mess ===============================================
*/
   