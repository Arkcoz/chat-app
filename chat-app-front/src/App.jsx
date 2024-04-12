import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000', {
  withCredentials: true, // Allow credentials like cookies
  extraHeaders: {
    "Access-Control-Allow-Origin": "http://localhost:5173"
  }
});

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    // Écouter les messages du serveur
    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]); // Utilisation de la fonction de mise à jour pour éviter les problèmes avec les dépendances de useEffect
    });

    return () => {
      // Nettoyage de l'écouteur de messages lorsque le composant se démonte
      socket.off('chat message');
    };
  }, []); // Utilisation d'une dépendance vide pour n'ajouter l'écouteur qu'une seule fois

  const sendMessage = () => {
    // Envoyer un message au serveur
    socket.emit('chat message', inputMessage);
    setInputMessage('');
  };

  return (
    <div>
      <h1>Chat App</h1>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;