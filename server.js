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

// Create id ==================================================================================
let chatRooms = require('./server/ChatRooms.json');
let roomId  = () => { 
    for (let index = 0; index < chatRooms.roomSetting.length; index++) {
        console.log(index);
           
        let idMax = chatRooms.roomSetting[index];
        countRoomID = idMax.id;

        console.log('idMax');
        console.log(countRoomID);
    }
    // Get the last id in my arr of movies
    countRoomID++;    
    return countRoomID;
}
let intoRoomId  = () => { 
    for (let index = 0; index < chatRooms.chatRoomSetting.length; index++) {
        let idMax = chatRooms.chatRoomSetting[index];
        countMessID = idMax.id;
    }
    // Get the last id in my arr of movies
    countMessID++;    
    console.log('91');
    console.log(countMessID);
    return countMessID; 
};
let messId  = (roomIndex) => { 
    for (let index = 0; index < chatRooms.chatRoomSetting[roomIndex].messegnes.length; index++) {
        let idMax = chatRooms.chatRoomSetting[roomIndex].messegnes[index];
        countMessID = idMax.id;
    }
    // Get the last id in my arr of movies
    countMessID++;    
    console.log('91');
    console.log(countMessID);
    return countMessID; 
};
let userTypedId  = (roomIndex) => { 
    for (let index = 0; index < chatRooms.chatRoomSetting[roomIndex].userTyped.length; index++) {
        let idMax = chatRooms.chatRoomSetting[roomIndex].userTyped[index];
        countUserID = idMax.id;
    }
    // Get the last id in my arr of movies
    countUserID++;
    return countUserID;
}
// Create a new room =============================================================================

app.post('/NewRoom', (req, res) => {
    // Create obj for roomSettings which I will save into the roomSetting key into the json file named chatRooms.json
    let roomSettingObj = {
        id: JSON.stringify(roomId()), // -1 = Give the room correct ID
        roomName: req.body.roomName,     
    };
    // Create obj for chatRoomSettings which I will save into the chatRoomSetting key into the json file above
    let chatRoomSettingObj = {
        id: JSON.stringify(intoRoomId()),
        messegnes: [],
        userTyped: [] 
    };
    chatRooms.roomSetting.push(roomSettingObj);
    chatRooms.chatRoomSetting.push(chatRoomSettingObj);
    fileSystem.writeFile('./server/ChatRooms.json', JSON.stringify(chatRooms //debugging
        , null, 2
        ), function(err) {
            console.log(err);     
    });

    console.log('46');
    console.log(chatRooms);
    res.status(201).send(chatRooms.roomSetting);
});

// Show a list with all rooms =====================================================================
app.get('/RoomList', (req, res) => {  
    res.status(200).send(chatRooms.roomSetting);
});

// Creates a connection between the server and my client and listen for mess
const io = socket(server);
    
io.on('connection', (socket) => {
    socket.on('join', function(roomNrStr) {
        console.log('102');
        console.log(roomNrStr);

        //Send all messegnes on the server in the joined room at once the client is open
        socket.join(roomNrStr);

        // Listen on newMessegnes and send it to all the client, create a  messId first
        io.to(roomNrStr).emit('messegnes', chatRooms);

        socket.on('newMessegnes', (data) => {
            let roomIndex = parseInt(roomNrStr)-1;
            console.log('112');
            console.log(data);
            console.log('113');
            console.log(roomIndex);
            
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
                id: JSON.stringify(messId(roomIndex)),
                timeStamp: fixDateTime(),
                usr: data.outUsr,
                chatMess: data.outChatMess
            }
            
            console.log('158');
            console.log(chatMessObj);
            // Push the new mes into its place

            chatRooms.chatRoomSetting[roomIndex].messegnes.push(chatMessObj);
            
            // Fix the userTyped list
            let userTypedObj = {
                id: JSON.stringify(userTypedId(roomIndex)),
                name: data.outUsr
            };
            chatRooms.chatRoomSetting[roomIndex].userTyped.push(userTypedObj);
    
            // Save the movies in an json file
            fileSystem.writeFile('./server/ChatRooms.json', JSON.stringify(chatRooms //debugging
                , null, 2
                ), function(err) {});       
                

            console.log(chatRooms.chatRoomSetting[roomIndex].messegnes.pop());
            
            // Send the mess on server at once ther is any incommin mess from the client
            socket.
            //to(roomNrStr).
            emit('newMessegnes', chatRooms.chatRoomSetting[roomIndex]              
                //chatMessObj)
                );
            socket.leave(roomNrStr);
        });
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
    console.log('198');
    console.log(incommingRoomIdNr);
    
    // Verify if ID
    if (!incommingRoomIdNr) {
        res.status(400).end();
        return;
    }
    // Remove the setting and the file for the room
    let indexToRemove = chatRooms.roomSetting.findIndex(roomIndex => parseInt(roomIndex.id) === incommingRoomIdNr);  
    console.log('Delete room: ');
    console.log(indexToRemove);
    if (indexToRemove !== -1) {
        // Remove the item in the list
        chatRooms.roomSetting.splice(indexToRemove, 1);
        chatRooms.chatRoomSetting.splice(indexToRemove, 1);
    }
    // Save the new room list back to its json file
    fileSystem.writeFile('./server/chatRooms.json', JSON.stringify(chatRooms //debugging
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

Arbetar = sista
app.delete('/RemoveMess/:id', (req, res) => { 
    console.log(req.params.id);
    
    let incommingMessIndexNr = parseInt(req.params.id.split('=')[1]);
    console.log('142');
    console.log(incommingMessIndexNr);
    
    // Verify if ID
    if (!incommingMessIndexNr) {
       res.status(400).end();
       return;
    }
    let indexToRemove = chatRooms.chatRoomSetting.messegnes.findIndex(messIndex => parseInt(messIndex.id) === incommingMessIndexNr);
    console.log('Delete mess: ');
    console.log(indexToRemove);
    if (indexToRemove !== -1) {
        // Remove the mess from the list
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
