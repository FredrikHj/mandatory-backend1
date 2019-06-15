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

let countRoomID = 0;
let countMessID = 0;
let countUserID = 0;

// Create a chatRoom
let roomId  = () => { 
    for (let index = 0; index < chatRooms.length; index++) {
        
        /* let idMax = chatRooms.chatRoom.data.roomConfig[index].id;//data[index];
        countRoomID = idMax.chatRoom.roomConfig[index].id; */

        console.log('idMax');
        console.log(countRoomID);
    }
    // Get the last id in my arr of movies
    countRoomID++;    
    return countRoomID;
}
// Create a new room =============================================================================
let chatRooms = require('./server/ChatRooms.json');

app.post('/NewRoom', (req, res) => {
    let chatRoomsObj = {
        chatRoom: {
            roomConfig: {
                id: JSON.stringify(roomId()), // -1 = Give the room correct ID
                roomName: req.body.roomName,
            },
            currentRoom: false,
            userTyped: [],
            messegnes: [],
        }
    }
    chatRooms.push(chatRoomsObj);

    // Save the chatRoomsObj into a json file named chatRoomsObj
    fileSystem.writeFile('./server/ChatRooms.json', JSON.stringify(chatRooms //debugging
        , null, 2
        ), function(err) {
            console.log(err);     
    });
    res.status(201).end();
});

// Show a list with all rooms =====================================================================
app.get('/RoomList', (req, res) => {  
    res.status(200).send(chatRooms);
});
// Get into a specific room, room is store in :id
app.get('/ChatRoom/:id', (req, res) => {
    let incommingRoomId = req.params.id;

/*     let getCorrectRoomIndex = chatRooms.chatRoom.roomConfig.findIndex(room => parseInt(room.id) === parseInt(incommingRoomId));
    console.log('obj index');
    
    console.log(getCorrectRoomIndex); */
    
});

// Creates a connection between the server and my client and listen for mess
const io = socket(server);

io.on('connection', (socket) => {
    // Get out current room
    
    let choosenRoom = '1'; //chatRooms.chatRoom.roomConfig.id;
    
    //Send all messegnes on the server at once the client is open
    socket.join(choosenRoom);
    
    console.log('84');
    console.log(chatRooms);
    io.to(choosenRoom).emit('messegnes', chatRooms.chatRoom);
    
    

    // Listen on newMessegnes and send it to all the client, create a  messId first
    let messId  = () => { 
        for (let index = 0; index < chatRooms.chatRoom.messegnes.length; index++) {
            let idMax = chatRooms.chatRoom.messegnes[index];
            countMessID = idMax.id;
        }
        // Get the last id in my arr of movies
        countMessID++;    
        console.log('91');
        console.log(countMessID);
        return countMessID; 
    };
    let userTypedId  = () => { 
        for (let index = 0; index < chatRooms.chatRoom.userTyped.length; index++) {
            let idMax = chatRooms.chatRoom.userTyped[index];
            countUserID = idMax.id;
        }
        // Get the last id in my arr of movies
        countUserID++;
        return countUserID;
    }
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
            id: JSON.stringify(messId()),
            timeStamp: fixDateTime(),
            usr: data.outUsr,
            chatMess: data.outChatMess
        }
        
        // Push the new mes into its place
        chatRooms.chatRoom.messegnes.push(chatMessObj);

        // Fix the userTyped list
        let userTypedObj = {id: JSON.stringify(userTypedId()), name: data.outUsr};
        chatRooms.chatRoom.userTyped.push(userTypedObj);
 
        // Save the movies in an json file
        fileSystem.writeFile('./server/ChatRooms.json', JSON.stringify(chatRooms //debugging
            , null, 2
            ), function(err) {});       
            // Send the mess on server at once ther is any incommin mess from the client
            //socket.join(choosenRoom).emit('newMessegnes', chatMessObj);
    });
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
// Delete a room
app.delete('/RemoveRoom/:id', (req, res) => { 
    let incommingRoomIdStr = req.params.id;
    let incommingRoomIdNr = parseInt(incommingRoomIdStr);    
    // Remove the setting and the file for the room
    fileSystem.unlink('./server/ChatRooms.json', (err) => {});
   
    // Verify if ID
    if (!incommingRoomIdNr) {
        res.status(400).end();
        return;
    }
    let indexToRemove = roomSetting.findIndex(roomIndex => parseInt(roomIndex.id) === incommingRoomIdNr);  
    console.log('Delete room: ');
    console.log(indexToRemove);
    if (indexToRemove !== -1) {
        // Remove the item in the list
        roomSetting.splice(indexToRemove, 1);
        console.log('184');
        console.log(roomSetting);

    }
    // Save the new room list back to its json file
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


// Delete a mess ==============================================
app.delete('/RemoveMess/:id', (req, res) => { 
    console.log(req.params.id);
    
    let incommingRoomIdStr = req.params.id.split('=')[0];
    let incommingMessIndexNr = parseInt(req.params.id.split('=')[1]);
 
    

    let chatRoomFile = 'ChatRoom' + incommingRoomIdStr + '.json';
    
    let chatRoomFileObj = require('./server/rooms/ChatRoom' + incommingRoomIdStr + '.json');
    
    // Verify if ID
    if (!incommingMessIndexNr) {
       res.status(400).end();
       return;
    }
    let indexToRemove = chatRoomFileObj.messegnes.findIndex(messIndex => parseInt(messIndex.id) === incommingMessIndexNr);
    console.log('Delete mess: ');
    console.log(indexToRemove);
    if (indexToRemove !== -1) {
        // Remove the item in the list
        chatRoomFileObj.messegnes.splice(indexToRemove, 1);
        //chatRoomFileObj.messegnes.splice(indexToRemove, 1);
        console.log('221');
        console.log(chatRoomFileObj.messegnes);
    }
    // Save the new messlist back to its json file
    fileSystem.writeFile('./server/rooms/' + chatRoomFile, JSON.stringify(chatRoomFileObj //debugging
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
// ============================================================
