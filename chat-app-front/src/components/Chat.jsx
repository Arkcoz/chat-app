import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import socket from '../socket';

const ChatContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 40%;
    min-width: 300px;
    height: 80%;
    background-color: var(--second-bg);
    border-radius: 10px;
    transition: all 0.3s;

    &:hover {
        box-shadow: 10px 10px 0px rgba(0, 0, 0, 0.1);
    }
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(100% - 40px);
    overflow-y: auto;
    padding: 20px;
    border-radius: 10px;
    
    &::-webkit-scrollbar {
        background-color: transparent;
        width: 8px;
        scrollbar-width: thin;
    }
    &::-webkit-scrollbar-thumb {
        background-color: var(--accent);
        border-radius: 5px;
        
        cursor: pointer;
    }
`;

const InputContainer = styled.form`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 40px;
    border-radius: 10px;
    margin-top: 10px;

    input {
        width: 90%;
        padding: 0 20px;
        height: 100%;
        outline: none;
        border: none;
        border-radius: 0 0 0 10px;
    }

    button {
        width: 10%;
        color: white;
        border: none;
        cursor: pointer;
        height: 40px;
        transition: all 0.3s;
        border-radius: 0 0 10px 0;
        background-color: var(--accent);
        color: var(--second-bg);
        font-weight: bold;
        font-size: 1rem;

        &:hover {
            background-color: var(--accent);
        }
    }
`;

const Message = styled.div`
    width: 100%;   
    overflow-wrap: break-word;
`

const Chat = ({ username }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const contentRef = useRef();

    useEffect(() => {
        socket.on('chat message', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        return () => {
            socket.off('chat message');
        };
    }, []);

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (inputMessage.trim() !== '') {
            socket.emit('chat message', { text: inputMessage });
            setInputMessage('');
        }
    };

    return (
        <ChatContainer>
            <Content ref={contentRef}>
                {messages.map((msg, index) => (
                    <div key={index} className={msg.special ? 'special' : ''}>
                        {msg.special ? (
                            <Message>
                                ({msg.time}): {msg.text}
                            </Message>
                        ) : (
                            <Message>
                                <span className='accent-color'>
                                    <strong>{msg.user === username ? 'Me' : msg.user}</strong> ({msg.time}):
                                </span> {msg.text}
                            </Message>
                        )}
                    </div>
                ))}
                <div ref={contentRef}></div>
            </Content>
            <InputContainer onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={`Type a message...`}
                />
                <button type="submit">SEND</button>
            </InputContainer>
        </ChatContainer>
    )
}

export default Chat;
