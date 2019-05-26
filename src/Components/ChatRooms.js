// ChatRooms =====================================================================================================================
import React, { useState, setState } from 'react';
// React Router - ES6 modules
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import { ChatWindow } from './ChatWindow.js';
import { updateChatRoom } from './store';
export let ChatRoom1 = () => {
    updateChatRoom('chatRoom-1');
    return (
        <section id="mainContentContainer">
            <ChatWindow/>
        </section>
    );
}
  export let ChatRoom2 = () => {
    updateChatRoom('chatRoom-2');
    return (
        <section id="mainContentContainer">
            <ChatWindow/>
        </section>
    );
  }
  export let ChatRoom3 = () => {
    updateChatRoom('chatRoom-3');
    return (
        <section id="mainContentContainer">
            <ChatWindow/>
        </section>
    );
  }