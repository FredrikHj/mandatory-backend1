// The ChatWindow ======================================================================================================
import React, { PureComponent } from 'react';
import io from 'socket.io-client';
import ScrollToBottom from 'react-scroll-to-bottom';
import Linkify from 'react-linkify';
import Emojify from "react-emojione";

// React Router - ES6 modules
import { Link } from "react-router-dom";

import { currentRoom$ } from './store';
import { UserName, UserTyped } from './SideComponents.js';
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
      userTyped: [],
      usrCurrentTyping: '',
    }
  }
  fixRoomId = () => {
    let getRoomId = this.props.location.pathname.split('=')[1].split('_')[0]; 
    return getRoomId;
  }
  componentDidMount() {  
    // Send my room id and name
    axios.get('http://localhost:3001/ChatRoom/' + this.props.pathNameFix(this.props.location.pathname)).then((res) => {});
    // Listen on respponse from the chatserver
    this.listen = io.connect(this.state.serverUrl);
    this.listen.on('messegnes', res => {
      
      // Update mess and userTyped
      let intoRoom = res.chatRoomSetting[parseInt(this.fixRoomId()) - 1];
      for (const chatMessObj of intoRoom.messegnes) {
        this.messegnesAdd(chatMessObj);
      }
      for (const chatUserTyped of intoRoom.userTyped) {
        this.userTypedAdd(chatUserTyped);
      }
    });
    this.listen.on('connection', function(){});
    
    // Tell server which room to join
    this.listen.on('newMessegnes', res => {
      this.messegnesAdd(res.messegnes.pop());
      this.userTypedAdd(res.userTyped.pop());
    });
    this.listen.emit('join', this.fixRoomId());

    currentRoom$.subscribe((currentRoom) => { 
      if (currentRoom) {
        this.setState({
          activeChatroom: currentRoom,
        });
      }
    });
  }
  componentDidUpdate() {
    // listen for another usertyping
    this.listen.on('typing', (usr) => {
      this.setState({
        usrCurrentTyping: usr,
      });
    });

  }
  messegnesAdd = (messObj) => {   
    this.setState({
      incommingMess: [ ...this.state.incommingMess, messObj ],
    });
  }
  userTypedAdd = (userTypedObj) => {
    this.setState({
      userTyped: [ ...this.state.userTyped, userTypedObj] 
    });
  }
  messagnesSend = () => {
    let messBody = {
      outUsr: this.state.usrName,
      outChatMess: this.state.messStr,
    };
    this.listen.emit('newMessegnes', messBody, (data) => {
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
    });
    let typingUser = this.state.usrName;

    // Send the typing user to server and broadcast it out for the other client who are useing the chat
    this.listen.emit('typing', typingUser, data => {});   
  }
   
  componentWillUnmount() {
    this.listen.on('disconnect', function(){});
  }  
  letterCounter = () => {
    if (this.state.messStr === 0) {
      return 0;
    }
    else{ 
      let startValue = 0;
      let getMessLength = this.state.messStr.length;
      let getTotLeft = startValue+getMessLength;
      return getTotLeft;
    }
  }
  messRoomListReset = () => {
    this.setState({
      incommingMess: [],
    });
    window.localStorage.removeItem('currentRoom');
  }
  removeMess = (e) => {
    let targetDelBntMessIndex = parseInt(e.target.dataset.index);
    let targetDelBtInRoomId = e.target.dataset.room;
    let targetDelBntMessId = e.target.id;

    axios.delete(this.props.apiUrl + '/RemoveMess/' +  targetDelBtInRoomId + '=' + targetDelBntMessId
    ).then((res) => {});
    let newMessList = [...this.state.incommingMess.slice(0, targetDelBntMessIndex), ...this.state.incommingMess.slice(targetDelBntMessIndex + 1)];
    this.setState({
     incommingMess: newMessList,
    });
  } 
  render() {  
    let incommingMess = this.state.incommingMess;  
    return (
      <section id="mainContentContainer">
        <fieldset>
          <legend id="chatRoomHedline">Meddelanden</legend>            
            <ScrollToBottom className="messagnesReceive">
              {(incommingMess.length !== 0) ? 
                incommingMess.map((obj, count) => {
                  return (
                    <section className="messContainer" key={ obj.id }>
                      <header className="messHeader">
                        <p className="messCountedId">{ obj.id + ',)' }</p><p>{ obj.usr }</p> <p>{ obj.timeStamp }</p> 
                        <p className="removeMessBtn" onClick={ this.removeMess } id={ obj.id } data-room={ this.fixRoomId() } data-index={ count }>X</p>
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
                }) : <p>Meddelanden laddas ....</p>
              }
            </ScrollToBottom>
            <div id="usrTypingStatus">{ this.state.usrCurrentTyping }</div>
            <hr className="middleLine"/>
          </fieldset>
          <fieldset id="messagneSend">
            <legend>Ditt meddelande <span className="inputReq"> *</span> </legend>
              <textarea id="chatMessegnes" maxLength="200" onChange={ this.changeMess } required></textarea>
              <div id="finishMess">  Använda tecken: <p style={(this.state.messStr.length > 200) ? {color: 'red', fontWeight: 'bold'} : null }>
              { this.letterCounter() } / 200 </p> <button id="sendBtn" onClick={ this.messagnesSend }> Sänd</button></div>
          </fieldset>
          <section id="changeRoomContainer">
            <p id="changeRoomHeadline">
            <Link className="button" to={ '/'} onClick={ this.messRoomListReset }>Hantera rum</Link>
            </p>

          </section>
        <UserName
          changeUsrName={ this.changeUsrName }
          stateUsrName={ this.state.usrName }
        />
        <UserTyped
          userTyped={ this.state.userTyped }
        />
      </section>
    );
  }
}

