import React, { useState } from "react";
import "../../styles/CustomerSupport.css";
import { getChatResponse } from "../../services/chatService";

const CustomerSupport = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello 👋 Welcome to Customer Support. How can I help you?"
    }
  ]);

  const [input, setInput] = useState("");

  const sendMessage = async () => {
  if (!input.trim()) return;

  const userMessage = {
    sender: "user",
    text: input,
  };

  setMessages((prev) => [...prev, userMessage]);

  const currentInput = input;
  setInput("");

  const botReply = await getChatResponse(currentInput);

  const botMessage = {
    sender: "bot",
    text: botReply,
  };

  setMessages((prev) => [...prev, botMessage]);
};

  return (
    <div className="support-container">
      <h2>Customer Support Bot</h2>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.sender === "user"
                ? "user-message"
                : "bot-message"
            }
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default CustomerSupport;