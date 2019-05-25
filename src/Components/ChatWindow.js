
// The ChatWindow ======================================================================================================
import React, { useState, setState } from 'react';
import io from 'socket.io-client';
import ScrollToBottom from 'react-scroll-to-bottom';
import Linkify from 'react-linkify';
import Emojify from "react-emojione";

// React Router - ES6 modules
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";

export function ChatWindow(props) {
  
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
      } */
    
     /*    let options = {
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
          <p id="chatWindow">Chatmeddelanden</p>
          <p id="yourUsrNameView2">{ props.sendUsrName }</p>
          <fieldset>
            <legend>Meddelanden</legend>
              <ScrollToBottom className="messagnesReceive">
              <p>rtgtrg</p>
              {/*   {
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
                } */}
              </ScrollToBottom>
              <hr className="middleLine"/>
          </fieldset>
        {/*   <fieldset id="messagneSend">
            <legend>Ditt meddelande <span className="inputReq"> *</span> </legend>
              <textarea id="chatMessegnes" maxLength="201" onChange={ this.setYourMess } required></textarea>
              <div id="finishMess">  Använda tecken: <p id="totCounter" style={(this.state.textInput.length > 200) ? {color: 'red', fontWeight: 'bold'} : null }>{ this.letterCounter() } / 200 </p> <button id="sendBtn" onClick={ this.messagnesSend }> Sänd</button></div>
          </fieldset> */}
        </section>
      );
    }