// Chat.jsx
import { useState } from "react";
import { BiSend, BiSolidUserCircle } from "react-icons/bi";
import { FaRobot } from "react-icons/fa";
import "../style/Chat.css";

const Chat = ({
  currentChat,
  text,
  setText,
  isResponseLoading,
  submitHandler,
  errorText,
  scrollToLastItem,
}) => {
  const [isLoading, setIsLoading] = useState(false); // New state for loading

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text) return;

    // Immediately show the user message
    setIsLoading(true);
    submitHandler(e);
    // Call the submit handler to make the API request
  };

  return (
    <section className="main">
      {!currentChat.length && (
        <div className="empty-chat-container">
          <FaRobot size={45} />
          <h1>Chat GPT Clone</h1>
          <h3>How can I help you today?</h3>
        </div>
      )}

      <div className="main-header">
        <ul>
          {currentChat.map((chatMsg, idx) => {
            const isUser = chatMsg.role === "user";
            const isBotLoading = isLoading && chatMsg.role === "bot"; // Check if the bot is loading

            return (
              <li
                key={idx}
                ref={scrollToLastItem}
                className={isUser ? "user-message" : "bot-message"}
              >
                {!isUser && !isBotLoading && (
                  <div className="bot-icon">
                    <FaRobot size={23} />
                  </div>
                )}
                <div
                  className={
                    isUser ? "user-message-content" : "bot-message-content"
                  }
                >
                  <p>{chatMsg.content}</p>
                </div>
                {isUser && (
                  <div className="user-icon">
                    <BiSolidUserCircle size={23} />
                  </div>
                )}
                {isBotLoading && (
                  <div className="loading-indicator">
                    <p>....</p> {/* Show loading dots */}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="main-bottom">
        {errorText && <p className="errorText">{errorText}</p>}
        <form className="form-container" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Send a message."
            spellCheck="false"
            value={isResponseLoading ? "Processing..." : text}
            onChange={(e) => setText(e.target.value)}
            readOnly={isResponseLoading}
          />
          {!isResponseLoading && (
            <button type="submit">
              <BiSend size={25} />
            </button>
          )}
        </form>
      </div>
    </section>
  );
};

export default Chat;
