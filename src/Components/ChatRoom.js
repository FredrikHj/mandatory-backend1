// The ChatWindow ======================================================================================================
import React, { PureComponent } from 'react';
import io from 'socket.io-client';
import ScrollToBottom from 'react-scroll-to-bottom';
import Linkify from 'react-linkify';
import Emojify from "react-emojione";

// React Router - ES6 modules
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import { UserTyped } from './UserTyped.js';
import { chatRoom$ } from './store';
import { resolvePtr } from 'dns';
import { functionTypeAnnotation } from '@babel/types';
import { MainApp } from '../MainApp.js';
import axios from 'axios';

export class ChatRoom extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      serverUrl: 'http://localhost:3001/',
      usrName: '',
      messStr: '',
      incommingMess: [],
      activeChatroom: '',
    }
  }
  componentDidMount() {
    this.pathNameFix(this.props.location.pathname);

    let messCount = 0;
    console.log('Reset');

    // Send my room id and name
    axios.get('http://localhost:3001' //ChatRoom' + this.props.location.pathname
    ).
    then((res) => {
    console.log(res);
    
   });
    // Listen on respponse from the chatserver
    this.listen = io.connect(this.state.serverUrl);
/*     this.listen.on('messegnes', res => {
      console.log('Incomming Messegnes');
      console.log(res);  
      console.log(res.data);
    
      for (const chatMessObj of res.data) {
        this.messegnesAdd(chatMessObj);
      }
    });
    this.listen.on('newMessegnes', res => {
      console.log('Incomming newMessegnes');
      console.log(res);  
        this.messegnesAdd(res);
    });
    this.listen.on('connection', function(){}); */
    let subscription = chatRoom$.subscribe((chatRoom) => { 
      if (chatRoom) {
        this.setState({
          activeChatroom: '-',
        });
      }
    });
  }
  pathNameFix = (pathName) => {
    console.log(pathName);
    let getPathNameArr = pathName.split(':').join();
    console.log(getPathNameArr);
    
  }
  messegnesAdd = (chatMessObj) => {  
    console.log('Old mess add with new one');
    
    this.setState({
      incommingMess: [ ...this.state.incommingMess, chatMessObj] 
    });
    
  }
  messagnesSend = () => {
    let messBody = {
      usr: this.state.usrName,
      chatMess: this.state.messStr,
    }
    this.listen.emit('newMessegnes', messBody, (data) => {
      console.log(data);

      this.messegnesAdd(data);
    });
    
  }
  changeUsrName = (e) => {       
    this.setState({
      usrName: e.target.value,
    })
  }
  changeMess = (e) => {       
    this.setState({
      messStr: e.target.value,
    })
  }
  componentWillUnmount() {
    this.listen.on('disconnect', function(){});
  }
  
  
  
  translateInSv = () => {
    let getSplittedChatName = this.state.activeChatroom.split('-');
    return 'Chatrumm ' + getSplittedChatName[1];
  }
  
  
  
  
  
  letterCounter = () => {
    if (this.state.messStr === 0) {
      return 0;
    }
    else{ 
      let startValue = 0;
      let getMessLength = this.state.messStr.length;
      let getTotLeft = startValue+getMessLength;
      let getCounter = document.querySelector('#totCounter');
      return getTotLeft;
    }
  } 
  render() {  
    console.log(this.state.incommingMess);
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
      <section id="mainContentContainer">
        <p id="chatWindow">{ this.translateInSv() }</p>
        <fieldset>
          <legend>Meddelanden</legend>
            <ScrollToBottom className="messagnesReceive">
              {
                this.state.incommingMess.map(obj => {
                  return (
                    <section className="messContainer" key={ obj.id }>
                    <header className="messHeader">
                      <p>{ obj.usr }</p> 
                    </header>
                    <div className="messContent" >
                      <Linkify>
                        <Emojify style={{height: 30, width: 30}}>
                          { obj.chatMess }

                        </Emojify>
                      </Linkify>
                    </div>

                    </section>

                  );
                })
              }
            </ScrollToBottom>
            <hr className="middleLine"/>
          </fieldset>
          <fieldset id="messagneSend">
            <legend>Ditt meddelande <span className="inputReq"> *</span> </legend>
              <textarea id="chatMessegnes" maxLength="200" onChange={ this.changeMess } required></textarea>
              <div id="finishMess">  Använda tecken: <p id="totCounter" style={(this.state.messStr.length > 200) ? {color: 'red', fontWeight: 'bold'} : null }>
              { this.letterCounter() } / 200 </p> <button id="sendBtn" onClick={ this.messagnesSend }> Sänd</button></div>
          </fieldset>
          <section id="changeRoomContainer">
            <p id="changeRoomHeadline">
            <Link className="button" to={ '/'}>Hantera rum</Link>
            </p>

          </section>
        <UserContainer
          changeUsrName={ this.changeUsrName }
          stateUsrName={ this.state.usrName }
        />
        <UserTyped/>
      </section>
    );
  }
}

    //  UserName =====================================================================================================================
function UserContainer(props) {

  return (
    <section id="userContainer">
      <label htmlFor="userName" id="userName">Användarnamn</label><br/>
      <input type="text" id="userName" minLength="1" maxLength="12" onChange={ props.changeUsrName } defaultValue={ props.stateUsrName } required/>
    </section>
  );
}