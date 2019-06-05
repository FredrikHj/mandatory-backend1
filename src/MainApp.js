import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {Helmet} from "react-helmet";

// React Router - ES6 modules
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";

import { ChatRoom } from './Components/ChatRoom.js';
import { currentRoom$, updateCurrentRoom } from './Components/store.js';
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
    setApiUrl('http://localhost:3001');
    //setRedirect(false);
    getRoomtList();
    }, []);
    function getRoomtList() {
      axios.get('http://localhost:3001/RoomList').
        then((res) => {
          setRoomList(res.data);
        });
        currentRoom$.subscribe((currentRoom) => { 
          if (currentRoom) {
            setShowChatRoom(' - ' + currentRoom);
          }
        });      
    }
    function createRoom(){
      //if (redirect === true) return <Redirect to="/"/>;
    
    axios.post(apiUrl + '/NewRoom', {roomName: roomNameStr }, { 'Content-Type': 'application/json'}).
      then((res) => {
      setChatRoomCreatedMess(true);
      setChatRoomCreatedStr(res.statusText)
    });
    getRoomtList();
  }
  let pathNameFix = (pathName) => {
    let getPathName = pathName.split('=');
    let getFixedPathName = getPathName[1].split('_')[0];
    
    updateCurrentRoom(getPathName[1]);
    window.localStorage.setItem('currentRoom', getPathName);    
    return getFixedPathName;
  }
  let removeRoom = (e) => {
    let targetDelBtnId = e.target.id;
    let targetDelItemIndex = parseInt(e.target.dataset.index);
    axios.delete(apiUrl + '/RemoveRoom/' + targetDelBtnId
    ).
    then((res) => {});
    let newRoomList = [...roomList.slice(0, targetDelItemIndex), ...roomList.slice(targetDelItemIndex + 1)];
    setRoomList(newRoomList);
  }
  let setRoomName = (e) => {
    let targetRoom = e.target.value;
    updateRoomNameStr(targetRoom);
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
              pathNameFix={ pathNameFix }
              />}
            />
            <Route exact path="/ChatRoom=:id" render={(props) => <ChatRoom {...props}
              pathNameFix={ pathNameFix }
              />}
            />
          </Router>
        </main>
      </>
  );
}

export default MainApp;