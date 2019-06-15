import React, { useState, useEffect } from 'react';

// React Router - ES6 modules
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";

export function HandleRoom(props) {
  console.log(props);
  
    return (
      <section id="handleRoomContainer" //style={(props.chatroom === '') ? {display: 'block'} : {display: 'none'}}
      >
      <section id="createRoomContainer">
        <p id="createRoomHl"> Skapa rum >>> </p> 
        <span>
          <input type="text" onChange={ props.setRoomName }/> >>> <button className="button createRoomBtn" onClick={ props.createRoom }>
          <p id="createRoomSymbol">+</p></button>  
        </span> 
      </section>
      <section id="chooseRoomContainer">
        <p id="chooseRoomHl">Välj rum:</p>
          { <section id="gotToRoom">
            {(props.roomList.length != 0) ? 
              props.roomList.map((obj, count) => {
                console.log(obj);
                { return (
                  <>
                    <Link className="button topMargin" to={ '/ChatRoom=' + obj.id + '_' + obj.roomName} key={ obj.id }>{ obj.roomName }</Link>
                      <p className="removeRoomBtn" onClick={ props.removeRoom } id={ obj.id } data-index={ count } key={ count }>X</p>
                  </>
                ); }
              }) : <p>Rum laddas ....</p>
            }
          </section> }
      </section>
    </section>
    );
  }
  