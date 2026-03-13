import React from 'react';

interface ChatMessageProps {
    message: {
        sender: 'user' | 'bot';
        text: string;
        time: string;
        isError?: boolean;
    };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    return (
        <div className={`message ${message.sender} ${message.isError ? 'error' : ''}`}>
            <div className="message-content">
                <span className="avatar">
                    {message.sender === 'bot' ? '🤖' : '👤'}
                </span>
                <div className="message-bubble">
                    <div className="message-text">{message.text}</div>
                    <span className="message-time">{message.time}</span>
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;