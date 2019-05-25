import React, { useState, setState } from 'react';
//import './chatclient.css';
// import io from 'socket.io-client';
/* import ScrollToBottom from 'react-scroll-to-bottom';
import Linkify from 'react-linkify';
import Emojify from "react-emojione";
import {emojify} from 'react-emojione'; */
import {Helmet} from "react-helmet";

// React Router - ES6 modules
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";

import { ChatWindow } from './Components/ChatWindow.js';
import { UserTyped } from './Components/UserTyped.js';

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
    <section id="mainContentContainer">
      <section>
        <ChatWindow/>
      </section>
      <aside>
        <UserContainer/>
        <UserTyped/>
      </aside>
    </section>
  );
}

//  UserName =====================================================================================================================
function UserContainer() {
  const [userName, setUserName ] = useState('');
  function setYourUserName() {

 }
  return (
    <section id="userContainer">
      <label htmlFor="userName" id="userName">Användarnamn</label><br/>
      <input type="text" id="userName" minLength="1" maxLength="12" onChange={ setYourUserName } defaultValue={ userName } required/>
    </section>
  );
}
// ChatRoom =====================================================================================================================
function ChatRoom() {
  const [userName, setUserName ] = useState('');
  function setYourUserName() {

 }
  return (
    <section id="chatRoom">
      {/* <Link to="/">Rum 1</Link>
      <Link to="/">Rum 2</Link>
      <Link to="/">Rum 3</Link> */}
    </section>
  );
}
// MainApp =======================================================================================================================
function MainApp() {
  
  if (this.state.redirect === true) return <Redirect to="/"/>;
  return (
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Chatklient - Rum </title>
        </Helmet>
        <header id="header">
          <HeaderContent/>
        </header>
        <main id="content">

        <Router>
          <ChatRoom/>
          <Route exact path="/Rum1" component={MainPage} />
          <Route exact path="/Rum2" component={MainPage} />
          <Route exact path="/Rum3" component={MainPage} />
        </Router>
          <ChatRoom/>

          <MainContent/>
        </main>

      </>
  );
}

export default MainApp;