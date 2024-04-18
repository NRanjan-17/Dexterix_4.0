import React, { useState } from 'react';
import './navbar.css';

function Navbar() {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    
    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    const sendMessage = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:3000/api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });
            document.getElementById("message").value = ''

            const data = await response.json();
            setResponse(data.response.result); // Assuming your server returns the response in the format { response: 'response message' }
        } catch (error) {
            console.error('Error sending message:', error);
            // Handle error here
        } finally {
            setLoading(false);
            setMessage('');
        }
    };

    return (
        <div className='mainz'>
            <div className="view new-chat-view">
                <div className="logo">
                    NERD
                </div>
            </div>
            <div className="chat-sec">
                {loading && <div className="message sending">Sending...</div>}
                {message && !loading && (
                    <div className="message-user">
                        <div className='user-message-cont'><span id="pb-4" className='user-font  '>YOU:</span></div>
                        <div className="user-message">
                            
                            {message}</div>
                    </div>
                )}
                {response && !loading && (
                    <div className="message-bot">
                        <div className='bot-message-cont'><span className="bot-font pb-5 font-bold">NERD:</span></div>
                        <div className="bot-message">{response}</div>

                    </div>
                )}
            </div>
            <div id="message-form rounded-sm px-0 shadow-transparent " className='message-area  px-0 '>
                <div className="message-wrapper">
                    <textarea
                        id="message"
                        rows="1"
                        placeholder="Send a message"
                        value={message}
                        onChange={handleMessageChange}
                    ></textarea>
                    <button className="send-button" onClick={sendMessage}><i className="fa fa-paper-plane">Send</i></button>
                </div>
                {/* <div className="disclaimer"></div> */}
            </div>
        </div>
    );
}

export default Navbar;
