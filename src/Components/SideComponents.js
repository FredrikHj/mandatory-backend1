// SideComponents =====================================================================================================================
import React, { useState, setState } from 'react';
// React Router - ES6 modules
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";

export function UserName(props) {

  return (
    <section id="userContainer">
      <label htmlFor="userName" id="userName">Användarnamn</label><br/>
      <input type="text" id="userName" minLength="1" maxLength="12" onChange={ props.changeUsrName } defaultValue={ props.stateUsrName } required/>
    </section>
  );
}
export function UserTyped() {
    const [userName, setUserName ] = useState('');
  function setYourUserName() {
  
   }
  return (
    <section id="userList">
      <ul> <p id="userTyped">Dessa har skrivit</p>
        <li>grfeg</li>
        <li>grfeg</li>
        <li>grfeg</li>
        <li>grfeg</li>
      </ul>
    </section>
  );
}