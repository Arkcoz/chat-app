import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Chat from '../components/Chat';
import socket from '../socket';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
`;

const UserOnline = styled.p`
    width: 40%;
    min-width: 300px;
    text-align: right;
`;


const Main = () => {
    const [userCount, setUserCount] = useState(0);
    const [username, setUsername] = useState('');

    useEffect(() => {
        socket.on('user count', (count) => {
            setUserCount(count);
        });

        socket.on('username', (username) => {
            setUsername(username);
        });

        return () => {
            socket.off('user count');
        };
    }, []);

    return (
        <Container>
            <h1>Chat App {username ? ` - ${username}` : ''}</h1>
            <UserOnline>Users online: {userCount}</UserOnline>
            <Chat username={username} />
        </Container>
    );
};

export default Main;
