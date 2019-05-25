// ChatRoom =====================================================================================================================
import React, { useState, setState } from 'react';
// React Router - ES6 modules
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";

export function UserTyped() {
    const [userName, setUserName ] = useState('');
  function setYourUserName() {
  
   }
  return (
    <section id="userList">
      <ul>
        <li>grfeg</li>
        <li>grfeg</li>
        <li>grfeg</li>
        <li>grfeg</li>
      </ul>
    </section>
  );
}