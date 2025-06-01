/*
import {useState, useEffect, createContext, useContext} from 'react';
import queryString from "query-string";
import io from "socket.io-client";
const ENDPOINT = "http://localhost:5000";
let socket;

import { useSelector } from "react-redux";

const MessageContext = createContext();

export function useMessage() {
    return useContext(MessageContext);
}

const MessageProvider = ({children}) => {  


  useEffect(() => {
    socket.on("connect", () => {
    //const transport = socket.io.engine.transport.name; // in most cases, "polling"
    //console.log(transport);
    socket.io.engine.on("upgrade", () => {
      const upgradedTransport = socket.io.engine.transport.name; // in most cases, "websocket"
      console.log(upgradedTransport);
    });
    });
  })

  useEffect(() => {
    const addPlus = "+";
    var { phone, room } = queryString.parse(location.search);
    if(phone) {
      if(phone.startsWith(" ")) {
        phone = addPlus.concat(phone.trim());
        console.log(phone);
      } 
    }
    setRoom(room);
    setPhone(phone);
    console.log(phone, room);
    socket.emit("join", { id: _id, sender: phone, room: room }, () => {});

  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages([...messages, message]);
    }, [messages])
  })

  // function for sending Message
  async function sendMessage(e) {
    e.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, () => setMessage('') );
    }
  }

  console.log();
  
  const value = {
    message: message,
    setMessage: setMessage,
    sendMessage: sendMessage,
    room: room,
    messages: messages,
    id: _id,
    setMessages: setMessages
  }

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
}




export default MessageProvider;*/
/*
import {useState, useEffect, createContext, useContext} from 'react';
import queryString from "query-string";
import io from "socket.io-client";
const ENDPOINT = "http://localhost:5000";
let socket;

import { useSelector } from "react-redux";

const MessageContext = createContext();

export function useMessage() {
    return useContext(MessageContext);
}

const MessageProvider = ({children}) => {  


  useEffect(() => {
    socket.on("connect", () => {
    //const transport = socket.io.engine.transport.name; // in most cases, "polling"
    //console.log(transport);
    socket.io.engine.on("upgrade", () => {
      const upgradedTransport = socket.io.engine.transport.name; // in most cases, "websocket"
      console.log(upgradedTransport);
    });
    });
  })

  useEffect(() => {
    const addPlus = "+";
    var { phone, room } = queryString.parse(location.search);
    if(phone) {
      if(phone.startsWith(" ")) {
        phone = addPlus.concat(phone.trim());
        console.log(phone);
      } 
    }
    setRoom(room);
    setPhone(phone);
    console.log(phone, room);
    socket.emit("join", { id: _id, sender: phone, room: room }, () => {});

  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages([...messages, message]);
    }, [messages])
  })

  // function for sending Message
  async function sendMessage(e) {
    e.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, () => setMessage('') );
    }
  }

  console.log();
  
  const value = {
    message: message,
    setMessage: setMessage,
    sendMessage: sendMessage,
    room: room,
    messages: messages,
    id: _id,
    setMessages: setMessages
  }

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
}




export default MessageProvider;*/