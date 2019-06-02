import React, { useState, useEffect } from 'react';
import { tsPropertySignature } from '@babel/types';

// The headerContent ============================================================================================================================
export function Header(props) {
    return (
      <p id="headLine">{'Backend Labb 1 - Rum ' + props.chatroom}</p>
    );
  }