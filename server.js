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
    res.status(200).send(roomSetting);
});
// Get into a specific room, room is store in :id
app.get('/ChatRoom/:id', (req, res) => {
let incommingRoomId = req.params.id;

// Creates a connection between the server and my client and listen for mess
const io = socket(server);
io.on('connection', (socket) => {
    let currentRoomFile =  require('./server/rooms/ChatRoom' + incommingRoomId
     + '.json');
   
    //Send all messegnes on the server at once the client is open
    socket.join(incommingRoomId);
    io.to(incommingRoomId).emit('messegnes', currentRoomFile);

    // Listen on newMessegnes and send it to all the client
    socket.on('newMessegnes', (data) => {
        // Datum och tid -------------------------------------------------------------------------------------------
        let fixDateTime = () => {
            var today = new Date();
            
            //  Visa datum
            var dd = today.getDate();
            
            // Visa månadens namn
            var month = new Array();
            
            month[0] = "Januari";
            month[1] = "Februari";
            month[2] = "Mars";
            month[3] = "April";
            month[4] = "Maj";
            month[5] = "Juni";
            month[6] = "Juli";
            month[7] = "Augusti";
            month[8] = "September";
            month[9] = "Oktober";
            month[10] = "November";
            month[11] = "December";
            
            var monthnr = new Date();
            var monthname = month[monthnr.getMonth()];
            
            var yyyy = today.getFullYear();
            let hh = today.getHours();
            h = checkTime(hh);
            let mm  = today.getMinutes();
            m = checkTime(mm);

            function checkTime(i){
                if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
                return i;
            }
            return dd + " " + monthname + " " + yyyy + ' | ' + hh + ':' + mm
        }        
        let chatMessObj = {
            id: JSON.stringify(createID()),
            timeStamp: fixDateTime(),
            usr: data.outUsr,
            chatMess: data.outChatMess
        }
        // Push the new mes and the user into the file
        currentRoomFile.messegnes.push(chatMessObj);
        let userTypedObj = {name: data.outUsr};
        currentRoomFile.config.userTyped.push(userTypedObj);

        // Save the movies in an json file
        fileSystem.writeFile('./server/rooms/ChatRoom' + incommingRoomId +'.json', JSON.stringify(currentRoomFile //debugging
            , null, 2
            ), function(err) {});       
            // Send the mess on server at once ther is any incommin mess from the client
            socket.join(incommingRoomId).emit('newMessegnes', chatMessObj);
    });
        // Set id for the mess ==================
        let countID = 0;
        function createID() {             
            for (let index = 0; index < currentRoomFile.messegnes.length; index++) {
                let idMax = currentRoomFile.messegnes[index];
                countID = idMax.id;
            }
            // Get the last id in my arr of movies
            
            countID++;           
            return countID;
        }
    // Listen for who is typing a mess
    socket.on('typing', (usr) => {
        let typing = '';
        if (usr != '') {
            typing = ' skriver ...'
        }
        let usrTyping = usr + typing;
        socket.broadcast.emit('typing', usrTyping);
    })
});
    // Listen for typing events

    //socket.leave(roomId);

});
    
// Delete a room
app.delete('/RemoveRoom/:id', (req, res) => { 
    let incommingRoomIdStr = req.params.id;
    let incommingRoomIdNr = parseInt(incommingRoomIdStr);    
    // Remove the setting and the file for the room
    fileSystem.unlink('./server/rooms/ChatRoom' + incommingRoomIdStr +'.json', (err) => {});
   
    // Verify if ID
    if (!incommingRoomIdNr) {
       res.status(400).end();
     return;
    }
    let indexToRemove = roomSetting.findIndex(roomIndex => parseInt(roomIndex.id) === incommingRoomIdNr);  
    if (indexToRemove !== -1) {
        
        // Remove the item in the list
        roomSetting.splice(indexToRemove, 1);
    }

    // Save the new room bak to its json file
    fileSystem.writeFile('./server/roomSetting.json', JSON.stringify(roomSetting //debugging
        , null, 2
        ), function(err) {
            if (err) {
                console.log(err);
                res.status(204);
                return;
            }   
    });
            
    res.status(204).end();
})