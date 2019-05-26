
// The ChatWindow ======================================================================================================
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import ScrollToBottom from 'react-scroll-to-bottom';
import Linkify from 'react-linkify';
import Emojify from "react-emojione";

// React Router - ES6 modules
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import { UserTyped } from './UserTyped.js';
import { chatRoom$ } from './store';

export function ChatWindow(props) {
  const [activeChatroom, setActiveChatroom ] = useState('');
  const [ textInputNr, setTextInputNr ] = useState(0);

  useEffect(() => {
    let subscription = chatRoom$.subscribe((chatRoom) => { 
      if (chatRoom) {
        setActiveChatroom(chatRoom);
      }
    });
  });
  let translateInSv = () => {
    let getSplittedChatName = activeChatroom.split('-');
    console.log(getSplittedChatName);
    return 'Chatrumm ' + getSplittedChatName[1];
    
  }
    /*     this.state = { messages: [], textInput: '', color: 'black'};
        this.messegnesAdd = this.messegnesAdd.bind(this);
        this.setYourMess = this.setYourMess.bind(this);
        this.messagnesSend = this.messagnesSend.bind(this);
        this.letterCounter = this.letterCounter.bind(this); */
      //}
      /* componentDidMount() {
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
      } */
      let setYourMess = (e) => {
        setTextInputNr(e.target.value );
    
      }
     let messagnesSend = () => {
        /* // Get both string needed for sending the mess and last reset both state and the textarea for the mess
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
        console.log(this.state.messages); */
      }
      console.log(textInputNr);
      
        let letterCounter = () => {
          if (textInputNr === 0) {
            return 0;
          }
          else{ 
            let startValue = 0;
            let getMessLength = textInputNr.length;
            
            let getTotLeft = startValue+getMessLength;
            console.log(getTotLeft);
            
            let getCounter = document.querySelector('#totCounter');
            return getTotLeft;
          }
        } 

        /*let options = {
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
        }; */
      return (
        <section>
          <p id="chatWindow">{ translateInSv() }</p>
          <fieldset>
            <legend>Meddelanden</legend>
              <ScrollToBottom className="messagnesReceive">
              <p>rtgtrg</p>
              {/*   {
                  this.state.messages.map(obj => {
                    return (
                      <section className="messContainer" key={obj.id}>
                        <header className="messHeader">
                          <p>{ obj.username }</p>
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
                } */}
              </ScrollToBottom>
              <hr className="middleLine"/>
          </fieldset>
          <fieldset id="messagneSend">
            <legend>Ditt meddelande <span className="inputReq"> *</span> </legend>
              <textarea id="chatMessegnes" maxLength="200" onChange={ setYourMess } required></textarea>
              <div id="finishMess">  Använda tecken: <p id="totCounter" style={(setTextInputNr.length > 200) ? {color: 'red', fontWeight: 'bold'} : null }>
              { letterCounter() } / 200 </p> <button id="sendBtn" onClick={ messagnesSend }> Sänd</button></div>
          </fieldset>
          <section id="changeRoomContainer">
            <p id="changeRoomHeadline">Byt rumm</p>
              <Link className="button" to="/Chatroom1">Rum 1</Link>
              <Link className="button" to="/Chatroom2">Rum 2</Link>
              <Link className="button" to="/Chatroom3">Rum 3</Link>
          </section>
        <UserContainer/>
        <UserTyped/>
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