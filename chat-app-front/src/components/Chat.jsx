import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import io from 'socket.io-client';


const socket = io('http://localhost:4000', {
    withCredentials: true,
    extraHeaders: {
        "Access-Control-Allow-Origin": "http://localhost:5173"
    }
});

const ChatContainer = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid black;
    width: 80%;
    height: 80%;
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(100% - 40px);
    overflow-y: auto;

    .special {
        color: #1cc51c;
    }
`;

const InputContainer = styled.form`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 40px;

    input {
        width: 90%;
    }

    button {
        width: 10%;
    }
`;

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');

    useEffect(() => {
        socket.on('chat message', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        return () => {
            socket.off('chat message');
        };
    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (inputMessage.trim() !== '') {
            socket.emit('chat message', { text: inputMessage });
            setInputMessage('');
        }
    };

    return (
        <ChatContainer>
            <Content>
                {messages.map((msg, index) => (
                    <div key={index} className={msg.special ? 'special' : ''}>
                        <strong>{msg.user}</strong> ({msg.time}): {msg.text}
                    </div>
                ))}
            </Content>
            <InputContainer onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                />
                <button type="submit">Send</button>
            </InputContainer>
        </ChatContainer>
    )
}

export default Chat