import React from 'react'
import styled from 'styled-components';
import Chat from '../components/Chat';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    width: 100vw;
`;



const Main = () => {
    return (
        <Container>
            <h1>Chat App</h1>
            <Chat />
        </Container>
    );
};

export default Main