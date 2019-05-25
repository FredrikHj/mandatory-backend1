import React, { Component } from 'react';
//import './chatclient.css';
import io from 'socket.io-client';
import ScrollToBottom from 'react-scroll-to-bottom';
import Linkify from 'react-linkify';
import Emojify from "react-emojione";
import {emojify} from 'react-emojione';

// The headerContent ============================================================================================================================
class HeaderContent extends Component {
  render() {
    return (
      <p id="headLine">AJS Labb 1 - Min Chatklient</p>
    );
  }
}
// The ChatWindow - Child for Main Content ======================================================================================================
class ChatWindow extends Component {
  constructor(props) {
    super(props);
    this.state = { messages: [], textInput: '', color: 'black'};
    this.messegnesAdd = this.messegnesAdd.bind(this);
    this.setYourMess = this.setYourMess.bind(this);
    this.messagnesSend = this.messagnesSend.bind(this);
    this.letterCounter = this.letterCounter.bind(this);
  }
  componentDidMount() {
    this.listen = io('http://ec2-13-53-66-202.eu-north-1.compute.amazonaws.com:3000/');

    this.listen.on('messages', function(data) {
      for (let getChatMessObj of data) {
        this.messegnesAdd(getChatMessObj);
      }
    }.bind(this));
    this.listen.on('new_message', function(data) {
      console.log(data);
      this.messegnesAdd(data);
    }.bind(this));
    this.listen.on('connect', function(){});
  }
  componentWillUnmount() {
    listen.on('disconnect', function(){});
  }
  messegnesAdd(chattMessObj) {
    this.setState({ messages: [...this.state.messages, chattMessObj] });
  }
  setYourMess(e) {
    this.setState({ textInput: e.target.value });

  }
  messagnesSend() {
    // Get both string needed for sending the mess and last reset both state and the textarea for the mess
    let getUserName = document.querySelector('#yourUsrNameView2').textContent;
    let getMessStr = this.state.textInput;
    console.log(getMessStr);

    let messBody = {
        username: getUserName,
        content: getMessStr
    }

    this.listen.emit('message', messBody, (response) => {
      this.messegnesAdd(response.data.newMessage);
    });
    this.setState({ textInput: '' });
    document.querySelector('#chatMessegnes').value = '';
    //this.componentDidMount();
    console.log(this.state.messages);
  }
  letterCounter() {
    let startValue = 0;
    let getMessLength = this.state.textInput.length;
    let getTotLeft = startValue+getMessLength;
    let getCounter = document.querySelector('#totCounter');
    return getTotLeft;
  }
  render() {
    let options = {
      convertShortnames: true,
      convertUnicode: true,
      convertAscii: true,
      style: {
        backgroundImage: 'url("/path/to/your/emojione.sprites.png")',
        height: 32,
        margin: 4,
      },
      // this click handler will be set on every emoji
      onClick: event => alert(event.target.title)
    };
    return (
      <section>
        <p id="chatWindow">Chatmeddelanden</p>
        <p id="yourUsrNameView2">{ this.props.sendUsrName }</p>
        <fieldset>
          <legend>Meddelanden</legend>
            <ScrollToBottom className="messagnesReceive">
              {
                this.state.messages.map(obj => {
                  return (
                    <section className="messContainer" key={obj.id}>
                      <header className="messHeader">
                        <p>{ obj.username }</p> <p>{ new Date(obj.timestamp ).toLocaleString('sv-SE') }</p>
                      </header>
                      <div className="messContent" >
                        <Linkify>
                        <Emojify style={{height: 30, width: 30}}>
                          { obj.content }

                        </Emojify>
                      </Linkify>
                      </div>
                      <hr className="middleLine"/>
                    </section>
                  );
                })
              }
            </ScrollToBottom>
            <hr className="middleLine"/>
        </fieldset>
        <fieldset id="messagneSend">
          <legend>Ditt meddelande <span className="inputReq"> *</span> </legend>
            <textarea id="chatMessegnes" maxLength="201" onChange={ this.setYourMess } required></textarea>
            <div id="finishMess">  Använda tecken: <p id="totCounter" style={(this.state.textInput.length > 200) ? {color: 'red', fontWeight: 'bold'} : null }>{ this.letterCounter() } / 200 </p> <button id="sendBtn" onClick={ this.messagnesSend }> Sänd</button></div>
        </fieldset>
      </section>
    );
  }
}
// Main Content =================================================================================================================================
let listen;
class MainContent extends Component {
  constructor(props) {
    super(props);
    // Is sending into the ChatWindow
    this.state = { loginUsrName: '', correctUsername: true, signedIn: false };
    // ==============================

    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
    this.setYourUserName = this.setYourUserName.bind(this);
  }
  setYourUserName(e) {
    let incommingInput = e.target.value;
    let getAlphanumeric = /^[\w-]+$/;

    // Check if the strings is meetting the condition
    if (getAlphanumeric.test(incommingInput)) {
      this.setState({ loginUsrName: incommingInput, correctUsername: true });
    }
    else {
      this.setState({correctUsername: false });
    }
  }
  logIn() {
    if (this.state.correctUsername === true) {
      this.setState({ signedIn: true});
    }
  }
  logOut() {
    this.setState({ signedIn: false});
  }
  render() {
    return (
      //
      <div>
        <section id="view1">
          <div id="labelContainer">
            <label htmlFor="usernameStr" id="usrInputStr">Användarnamn <span className="inputReq"> *</span> </label></div>
            <div id="userContainer">
              <input type="text" id="usernameStr" minLength="1" maxLength="12" onChange={ this.setYourUserName } defaultValue={ this.state.loginUsrName } required/>
              <button id="usernameBtn" onClick={ this.logIn } >Logga In!</button>
            </div>
            <p id="incorrectUsername" style={ (this.state.correctUsername === false) ? {display: 'block',  color: 'red', fontWeight: 'bold'} : null}>Alphanumeric bara  inkl: - _ spaces!</p>
        </section>
        <section id="view2" style={ (this.state.signedIn === true) ? {display: 'block'} : {display: 'none'} }>
          <ChatWindow sendUsrName={ this.state.loginUsrName }/>
        </section>
        <button id="closeBtn" style={ (this.state.signedIn === true) ? {display: 'block'} : null} onClick={ this.logOut }>Logga Ut</button>
      </div>
    );
  }
}
// Application Chatclient =======================================================================================================================
class Chatclient extends Component {
  render() {
    return (
      <div>
        <header id="header">
          <HeaderContent/>
        </header>
        <main id="content">
          <MainContent/>
        </main>

      </div>
    );
  }
}

export default Chatclient;import React, { Component } from 'react';
import './chatclient.css';
import io from 'socket.io-client';
import ScrollToBottom from 'react-scroll-to-bottom';
import Linkify from 'react-linkify';
import Emojify from "react-emojione";
import {emojify} from 'react-emojione';

// The headerContent ============================================================================================================================
class HeaderContent extends Component {
  render() {
    return (
      <p id="headLine">AJS Labb 1 - Min Chatklient</p>
    );
  }
}
// The ChatWindow - Child for Main Content ======================================================================================================
class ChatWindow extends Component {
  constructor(props) {
    super(props);
    this.state = { messages: [], textInput: '', color: 'black'};
    this.messegnesAdd = this.messegnesAdd.bind(this);
    this.setYourMess = this.setYourMess.bind(this);
    this.messagnesSend = this.messagnesSend.bind(this);
    this.letterCounter = this.letterCounter.bind(this);
  }
  componentDidMount() {
    this.listen = io('http://ec2-13-53-66-202.eu-north-1.compute.amazonaws.com:3000/');

    this.listen.on('messages', function(data) {
      for (let getChatMessObj of data) {
        this.messegnesAdd(getChatMessObj);
      }
    }.bind(this));
    this.listen.on('new_message', function(data) {
      console.log(data);
      this.messegnesAdd(data);
    }.bind(this));
    this.listen.on('connect', function(){});
  }
  componentWillUnmount() {
    listen.on('disconnect', function(){});
  }
  messegnesAdd(chattMessObj) {
    this.setState({ messages: [...this.state.messages, chattMessObj] });
  }
  setYourMess(e) {
    this.setState({ textInput: e.target.value });

  }
  messagnesSend() {
    // Get both string needed for sending the mess and last reset both state and the textarea for the mess
    let getUserName = document.querySelector('#yourUsrNameView2').textContent;
    let getMessStr = this.state.textInput;
    console.log(getMessStr);

    let messBody = {
        username: getUserName,
        content: getMessStr
    }

    this.listen.emit('message', messBody, (response) => {
      this.messegnesAdd(response.data.newMessage);
    });
    this.setState({ textInput: '' });
    document.querySelector('#chatMessegnes').value = '';
    //this.componentDidMount();
    console.log(this.state.messages);
  }
  letterCounter() {
    let startValue = 0;
    let getMessLength = this.state.textInput.length;
    let getTotLeft = startValue+getMessLength;
    let getCounter = document.querySelector('#totCounter');
    return getTotLeft;
  }
  render() {
    let options = {
      convertShortnames: true,
      convertUnicode: true,
      convertAscii: true,
      style: {
        backgroundImage: 'url("/path/to/your/emojione.sprites.png")',
        height: 32,
        margin: 4,
      },
      // this click handler will be set on every emoji
      onClick: event => alert(event.target.title)
    };
    return (
      <section>
        <p id="chatWindow">Chatmeddelanden</p>
        <p id="yourUsrNameView2">{ this.props.sendUsrName }</p>
        <fieldset>
          <legend>Meddelanden</legend>
            <ScrollToBottom className="messagnesReceive">
              {
                this.state.messages.map(obj => {
                  return (
                    <section className="messContainer" key={obj.id}>
                      <header className="messHeader">
                        <p>{ obj.username }</p> <p>{ new Date(obj.timestamp ).toLocaleString('sv-SE') }</p>
                      </header>
                      <div className="messContent" >
                        <Linkify>
                        <Emojify style={{height: 30, width: 30}}>
                          { obj.content }

                        </Emojify>
                      </Linkify>
                      </div>
                      <hr className="middleLine"/>
                    </section>
                  );
                })
              }
            </ScrollToBottom>
            <hr className="middleLine"/>
        </fieldset>
        <fieldset id="messagneSend">
          <legend>Ditt meddelande <span className="inputReq"> *</span> </legend>
            <textarea id="chatMessegnes" maxLength="201" onChange={ this.setYourMess } required></textarea>
            <div id="finishMess">  Använda tecken: <p id="totCounter" style={(this.state.textInput.length > 200) ? {color: 'red', fontWeight: 'bold'} : null }>{ this.letterCounter() } / 200 </p> <button id="sendBtn" onClick={ this.messagnesSend }> Sänd</button></div>
        </fieldset>
      </section>
    );
  }
}
// Main Content =================================================================================================================================
let listen;
class MainContent extends Component {
  constructor(props) {
    super(props);
    // Is sending into the ChatWindow
    this.state = { loginUsrName: '', correctUsername: true, signedIn: false };
    // ==============================

    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
    this.setYourUserName = this.setYourUserName.bind(this);
  }
  setYourUserName(e) {
    let incommingInput = e.target.value;
    let getAlphanumeric = /^[\w-]+$/;

    // Check if the strings is meetting the condition
    if (getAlphanumeric.test(incommingInput)) {
      this.setState({ loginUsrName: incommingInput, correctUsername: true });
    }
    else {
      this.setState({correctUsername: false });
    }
  }
  logIn() {
    if (this.state.correctUsername === true) {
      this.setState({ signedIn: true});
    }
  }
  logOut() {
    this.setState({ signedIn: false});
  }
  render() {
    return (
      //
      <div>
        <section id="view1">
          <div id="labelContainer">
            <label htmlFor="usernameStr" id="usrInputStr">Användarnamn <span className="inputReq"> *</span> </label></div>
            <div id="userContainer">
              <input type="text" id="usernameStr" minLength="1" maxLength="12" onChange={ this.setYourUserName } defaultValue={ this.state.loginUsrName } required/>
              <button id="usernameBtn" onClick={ this.logIn } >Logga In!</button>
            </div>
            <p id="incorrectUsername" style={ (this.state.correctUsername === false) ? {display: 'block',  color: 'red', fontWeight: 'bold'} : null}>Alphanumeric bara  inkl: - _ spaces!</p>
        </section>
        <section id="view2" style={ (this.state.signedIn === true) ? {display: 'block'} : {display: 'none'} }>
          <ChatWindow sendUsrName={ this.state.loginUsrName }/>
        </section>
        <button id="closeBtn" style={ (this.state.signedIn === true) ? {display: 'block'} : null} onClick={ this.logOut }>Logga Ut</button>
      </div>
    );
  }
}
// Application Chatclient =======================================================================================================================
class Chatclient extends Component {
  render() {
    return (
      <div>
        <header id="header">
          <HeaderContent/>
        </header>
        <main id="content">
          <MainContent/>
        </main>

      </div>
    );
  }
}

export default Chatclient;