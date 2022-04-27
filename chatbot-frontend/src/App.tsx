import React, { useEffect, useState } from 'react';
import LoginContainer from './components/LoginContainer';
import ChatContainer from './components/ChatContainer';

import socketIOClient from "socket.io-client";
import TempContainer from './components/TemporaryContainer';

const ENDPOINT = "http://localhost:8001/";
const socket = socketIOClient(ENDPOINT);

function App() {
  
  const [socketsInitialized, setSocketsInitialized] = useState(false)

  useEffect(() => {
    if (socket && !socketsInitialized) {
      setSocketsInitialized(true)

      socket.on("connected", () => {
        console.log("Connected to backend.");
      })
    }}, [])

  return (
    <div className= "App">
      <LoginContainer/>
      <ChatContainer/>
      {/* <ChatContainer socket={socket }/> */}
    </div>
  );
}

export default App;
 