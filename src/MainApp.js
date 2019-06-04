import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {Helmet} from "react-helmet";

// React Router - ES6 modules
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";

import { ChatRoom } from './Components/ChatRoom.js';
import { currentRoom$ } from './Components/store.js';
import { HandleRoom } from './Components/HandleRoom.js';
import { Header } from './Components/Header.js';

// MainApp =======================================================================================================================
function MainApp() {
  const [redirect, setRedirect ] = useState(true);
  const [apiUrl, setApiUrl ] = useState('');
  const [userName, setUserName ] = useState('');
  const [roomNameStr, updateRoomNameStr ] = useState('');
  const [roomList, setRoomList ] = useState([]);
  const [showChatRoom, setShowChatRoom ] = useState('');
  const [chatRoomCreatedMess, setChatRoomCreatedMess ] = useState(false);
  const [chatRoomCreatedStr, setChatRoomCreatedStr ] = useState('');

  useEffect(() => {
    console.log('rgdg');
    
    setApiUrl('http://localhost:3001');
    //setRedirect(false);
    
    axios.get('http://localhost:3001/RoomList').
      then((res) => {
        console.log(res);
        setRoomList(res.data);
      });
      currentRoom$.subscribe((currentRoom) => { 
        if (currentRoom) {
          setShowChatRoom(' - ' + currentRoom);
        }
      });
    }, []);
    
    function createRoom(){
      console.log(roomNameStr);
      //if (redirect === true) return <Redirect to="/"/>;
    
    axios.post(apiUrl + '/NewRoom', {roomName: roomNameStr }, { 'Content-Type': 'application/json'}).
      then((res) => {
      console.log(res);
      setChatRoomCreatedMess(true);
      setChatRoomCreatedStr(res.statusText)
    });
  }
  let removeRoom = (e) => {
    let targetDelBtn = e.target;
    axios.delete(apiUrl + '/RemoveRoom').
    then((res) => {
      console.log(res);

    });
    
  }
  let setRoomName = (e) => {
    let targetRoom = e.target.value;
    console.log(targetRoom);
    
    updateRoomNameStr(targetRoom);
    console.log(showChatRoom);
  }
  
    return (
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{ 'Chatklient' + showChatRoom } </title>
        </Helmet>
        <header id="header">
          <Header
          />
        </header>
        <main id="mainContainer">
          <Router>
          
            <Route exact path="/" render={(props) => <HandleRoom {...props}
              setRoomName={ setRoomName }
              createRoom= { createRoom }
              roomList={ roomList }
              chatRoomCreatedMess={ chatRoomCreatedMess }
              chatRoomCreatedStr={ chatRoomCreatedStr }
              removeRoom={ removeRoom }
              />}
            />
            <Route exact path="/ChatRoom=:id" component={ ChatRoom } />
          </Router>
        </main>
      </>
  );
}

export default MainApp;