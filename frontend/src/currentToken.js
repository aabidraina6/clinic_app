import React, { useEffect, useState } from "react";
import "./App.css";
import './ScratchCard.css'
import useWebSocket from 'react-use-websocket';
const WS_URL = 'ws://localhost:4001';



export default function CurrentToken() {
const [token  , setToken] = useState('')
const [latest , setLatest] = useState('')

const ws = new WebSocket("ws://localhost:4001");

ws.onopen = () => {
  console.log("WebSocket connection established.");
};

ws.onmessage = (message) =>{
  console.log("message ", message)
  setLatest(message)
}
  useEffect(()=>{
    // console.log(latest)
    // if(latest)
setToken(latest.data)
  } , [latest])

  return (
    <div
      className="scratch-card-container"

    >
      <div style={{backgroundColor : 'lightgreen'}} className="scratch-card-text">
      <h1 className="">Token Number</h1>
      <h1 className="">{token}</h1>


         
        </div>
    </div>
  );
}
