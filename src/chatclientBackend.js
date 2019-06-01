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

import { ChatRoom } from './Components/ChatRooms.js';
import { chatRoom$ } from './Components/store';
// The headerContent ============================================================================================================================
function HeaderContent() {
  return (
    <p id="headLine">Backend Labb 1 - En Chatklient</p>
  );
}

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
  const [apiUrl, setApiUrl ] = useState('');
  const [chatroom, setChatroom ] = useState('');
  const [userName, setUserName ] = useState('');
  let [roomName, updateRoomName ] = useState('');

  useEffect(() => {
    setApiUrl('http://localhost:3001');
    let subscription = chatRoom$.subscribe((chatRoom) => { 
      if (chatRoom) {
        setChatroom(chatRoom);
      }
    });
  });

  function creatRoom(){
    console.log(roomName);
    
    axios.post(apiUrl + '/NewRoom', {roomName: roomName}, { 'Content-Type': 'application/json'}).
      then((res) => {
      console.log(res);
      
    });
  }
  let setRoomName = (e) => {
    updateRoomName(e.target.value);
  }
  //if (this.state.redirect === true) return <Redirect to="/"/>;
  return (
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{ 'Chatklient - Rum ' + chatroom } </title>
        </Helmet>
        <header id="header">
          <HeaderContent/>
        </header>
        <main id="mainContainer">
          {/* <ChatRoom/> */}
          <Router>
            <section id="goToRoomContainer" style={(chatroom === '') ? {display: 'block'} : {display: 'none'}}>
              
              <section id="createRoomContainer">
                <p id="createRoomHl"> Skapa rum >>> </p> 
                <span>
                  <input type="text" onChange={ setRoomName }/> >>> <button className="button createRoomBtn" onClick={ creatRoom }> <p id="createRoomSymbol">+</p></button>  
                </span> 
              </section>
              <section id="chooseRoomContainer">
                <p id="chooseRoom">Välj rum:</p>
                <section id="gotToRoom">

  {/*                 <Link className="button" to="/Chatroom1">Rum 1</Link>
                  <Link className="button" to="/Chatroom2">Rum 2</Link>
                  <Link className="button" to="/Chatroom3">Rum 3</Link> */}
                </section>
              </section>
            </section>
{/*               <Route exact path="/Chatroom1" component={ ChatRoom1 } />
              <Route exact path="/Chatroom2" component={ ChatRoom2 } />
              <Route exact path="/Chatroom3" component={ ChatRoom3 } /> */}
          </Router>
        </main>
      </>
  );
}

export default MainApp;