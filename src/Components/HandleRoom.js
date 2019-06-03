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
          <input type="text" onChange={ props.setRoomName }/> >>> <button className="button createRoomBtn" onClick={ props.creatRoom }> <p id="createRoomSymbol">+</p></button>  
        </span> 
      </section>
      <section id="chooseRoomContainer">
        <p id="chooseRoomHl">Välj rum:</p>
        <section id="gotToRoom">
          {
            props.roomList.map(obj => {
              return (
                <Link className="button" to={ '/ChatRoom=' + obj.id + '_' + obj.name} key={ obj.id }> { obj.name }</Link>
              );
            })
          }
        </section>
      </section>
    </section>
    );
  }
  