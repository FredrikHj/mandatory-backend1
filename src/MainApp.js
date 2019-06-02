import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import './chatclient.css';
// import io from 'socket.io-client';
/* import ScrollToBottom from 'react-scroll-to-bottom';
import Linkify from 'react-linkify';
import Emojify from "react-emojione";
import {emojify} from 'react-emojione'; */
import {Helmet} from "react-helmet";

// React Router - ES6 modules
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";

import { ChatRoom } from './Components/ChatRoom.js';
import { chatRoom$ } from './Components/store.js';
import { HandleRoom } from './Components/HandleRoom.js';
import { Header } from './Components/Header.js';

// Main Content =================================================================================================================================
let listen;
function MainContent() {
  const [userName, setUserName ] = useState('');
  function setYourUserName() {

  }
  return (
    <section>

      <aside>

      </aside>
    </section>
  );
}

// MainApp =======================================================================================================================
function MainApp() {
  const [redirect, setRedirect ] = useState(true);
  const [apiUrl, setApiUrl ] = useState('');
  const [userName, setUserName ] = useState('');
  const [roomNameStr, updateRoomNameStr ] = useState('');
  const [roomList, setRoomList ] = useState([]);
  const [chatroom, setChatroom ] = useState('');

  useEffect(() => {
    setApiUrl('http://localhost:3001');
    //setRedirect(false);
    
    axios.get('http://localhost:3001/RoomList').
      then((res) => {
        console.log(res);
        setRoomList(res.data);
      });
      /*     let subscription = chatRoom$.subscribe((chatRoom) => { 
        if (chatRoom) {
          setChatroom(chatRoom);
        }
      }); */
    }, []);
    
    function creatRoom(){
      console.log(roomNameStr);
      //if (redirect === true) return <Redirect to="/"/>;
    
    axios.post(apiUrl + '/NewRoom', {roomName: roomNameStr }, { 'Content-Type': 'application/json'}).
      then((res) => {
      console.log(res);
      
    });
  }
  let setRoomName = (e) => {
    updateRoomNameStr(e.target.value);
  }
  console.log(chatroom);
  
    return (
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{ 'Chatklient - Rum ' + chatroom } </title>
        </Helmet>
        <header id="header">
          <Header
            chatroom={ chatroom }
          />
        </header>
        <main id="mainContainer">
          <Router>
          
            <Route exact path="/" render={(props) => <HandleRoom {...props}
              roomName={ roomNameStr }
              creatRoom= { creatRoom }
              roomList={ roomList }
              />}
            />
            <Route exact path="/ChatRoom:id" component={ ChatRoom } />
          </Router>
        </main>
      </>
  );
}

export default MainApp;