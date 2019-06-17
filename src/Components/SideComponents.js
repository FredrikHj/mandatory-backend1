// SideComponents =====================================================================================================================
import React from 'react';

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
       {(props.userTyped.length !== 0) ?
          props.userTyped.map((obj, count) => {
            return(
              <li key={ count }>{ obj.name }</li>
            );
          }) : 'Listan laddas ...'
        }
      </ul>
    </section>
  );
}