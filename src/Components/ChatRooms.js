// ChatRooms =====================================================================================================================
import React, { useState, setState } from 'react';
// React Router - ES6 modules
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import { ChatWindow } from './ChatWindow.js';
import { updateChatRoom } from './store';
export let ChatRoom = () => {
    updateChatRoom('chatRoom-1');
    return (
        <section id="mainContentContainer">
            <ChatWindow/>
        </section>
    );
}
