import './Chat.css';

import React, { useEffect, useState } from "react";

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';
import io from "socket.io-client";
import queryString from 'query-string';

const ENDPOINT = 'https://vasizebronchat.herokuapp.com/';

let socket;

const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);

        socket = io(ENDPOINT);

        setRoom(room);
        setName(name)

        socket.emit('join', { name, room }, (error) => {
            if (error) {
                socket.emit('disconnected', name);
                socket.emit('join', { name, room }, () => {

                })
            }
        });

        return () => {
            socket.emit('disconnected');
            socket.off();
        }
    }, [location.search]);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        });

        socket.on("roomData", ({ users }) => {
            setUsers(users);
        });
    }, [messages]);

    const sendMessage = (event) => {
        event.preventDefault();
        if (message) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    const removeUser = () => {
        socket.emit('disconnected', name);
    }

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room} removeUser={removeUser} />
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
        </div>
    );
}

export default Chat;