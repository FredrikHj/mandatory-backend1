import React, { useState, useEffect } from 'react';
import { currentRoom$ } from './store.js';

//import { tsPropertySignature } from '@babel/types';

// The headerContent ============================================================================================================================
export function Header(props) {
  const [showChatRoom, setShowChatRoom ] = useState('');

  useEffect(() => {
    let subscription = currentRoom$.subscribe((currentRoom) => { 
      if (currentRoom) {
        setShowChatRoom(' - ' + currentRoom);
      }
    });
  });
  let fixRoomName = () => {
    return showChatRoom.split('_').reverse()[0]
  }
    return (
      <p id="headLine">{'Backend Labb 1 - ' + fixRoomName()}</p>
    );
  }