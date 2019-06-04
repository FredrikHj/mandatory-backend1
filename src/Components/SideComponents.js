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
export function UserTyped(props) {
  return (
    <section id="userList">
      <ul> <p id="userTyped">Dessa har skrivit</p>
       {
          props.userTyped.map(userTyped => {
            console.log(userTyped)
            return(
              <li key={ '1' }>{ userTyped.name }</li>
            );
          })
        }
      </ul>
    </section>
  );
}