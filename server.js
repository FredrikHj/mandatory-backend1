// Övning med routes     
const express = require('express');
const app = express();
let cors = require('cors');

app.use(express.json());
app.use(cors());

const fileSystem = require('fs');
const socket = require('socket.io');
const port = 3001;
const server = app.listen(port, () =>  console.log(`Chatserver is listening on port ${port}!`));

// Create a chatRoom
let roomId  = () => { 
    for (let index = 0; index < roomSetting.length; index++) {
        let idMax = roomSetting[index];
        countID = idMax.id;
    }
    // Get the last id in my arr of movies
    countID++;    

    return countID;
}
// Create a new room ==============================================================================
let roomSetting =  require('./server/roomSetting.json');
app.post('/NewRoom', (req, res) => {
    let getRoomID = JSON.stringify(roomId()); // -1 = Give the room correct ID

    let roomSettingObj = {
        id: getRoomID,
        roomName: req.body.roomName,
        fileName: 'ChatRoom' + getRoomID + '.json',
    }
    roomSetting.push(roomSettingObj);
    let roomBody = {
        config: {
            id: getRoomID, 
            name: req.body.roomName,
            userTyped: [],
            "status": "",
            "content-type": "",
        },
        messegnes: [],
    } 
    // Save some setting of the chatRooms
    fileSystem.writeFile('./server/roomSetting.json', JSON.stringify(roomSetting //debugging
        , null, 2
        ), function(err) {
            
            console.log(err);     
        });    
    // Save the new room into a json files named as room + its ID
    fileSystem.writeFile('./server/rooms/' + roomSettingObj.fileName, JSON.stringify(roomBody //debugging
        , null, 2
        ), function(err) {
            console.log(err);     
    });
    res.status(201).end();
});

// Show a list with all rooms =====================================================================
app.get('/RoomList', (req, res) => {
    console.log(req.body);
    res.status(200).send(roomSetting);
});
// Get into a specific room, room is store in :id
app.get('/ChatRoom/:id', (req, res) => {
let incommingRoomId = req.params.id;
console.log(incommingRoomId);

// Creates a connection between the server and my client and listen for mess
const io = socket(server);
io.on('connection', (socket) => {
    console.log('Anslutning upprättad', socket.id);
    let currentRoomFile =  require('./server/rooms/ChatRoom' + incommingRoomId + '.json');
    // test
    console.log('82');
    console.log('ChatRoom' + incommingRoomId);
    
    
    //Send all messegnes on the server at once the client is open
    socket.join(incommingRoomId);
    io.to(incommingRoomId).emit('messegnes', currentRoomFile);

    // Listen on newMessegnes and send it to all the client
    socket.on('newMessegnes', (data) => {
        console.log('Incomming mess from client');
        console.log(data);
    
        let chatMessObj = {
            id: JSON.stringify(createID()),
            timeStamp: '', //
            usr: data.outUsr,
            chatMess: data.outChatMess
        }        
        currentRoomFile.messegnes.push(chatMessObj);
        // Save the movies in an json file
        fileSystem.writeFile('./server/rooms/ChatRoom1.json', JSON.stringify(currentRoomFile //debugging
            , null, 2
            ), function(err) {
                
                console.log(err);     
            });       
            // Send the mess on server at once ther is any incommin mess from the client
            socket.join(incommingRoomId).emit('newMessegnes', chatMessObj);
        });
    });
    
    //socket.leave(roomId);
});
    
// Set id for the mess ==================
let countID = 0;
function createID() { 
    for (let index = 0; index < currentRoomFile.messegnes.length; index++) {
        let idMax = currentRoomFile.messegnes[index];
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
// Delete a room
app.delete('/RemoveRoom/:id', (req, res) => { 

})