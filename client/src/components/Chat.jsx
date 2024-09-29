import { useEffect, useRef } from "react";
import { BiSend, BiSolidUserCircle } from "react-icons/bi";
import { FaRobot } from "react-icons/fa";
import ailogo from "../assets/ai-icon.svg";
import userIcon from "../assets/user-icon2.svg";
import "../style/Chat.css";

const Chat = ({
  currentChat,
  text,
  setText,
  isResponseLoading,
  submitHandler,
  errorText,
}) => {
  const chatEndRef = useRef(null);

  // Scroll to the bottom of the chat whenever messages change or a loading state is triggered
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentChat, isResponseLoading]);

  return (
    <section className="main">
      {!currentChat.length && (
        <div className="empty-chat-container">
          {/* <FaRobot size={45} /> */}
          <img
            className="ai-logo"
            src={ailogo}
            alt="AI Logo"
            style={{ width: "45px", height: "45px" }}
          />
          <h1>Kanerika GPT</h1>
          <h3>How can I help you today?</h3>
        </div>
      )}

      <div className="main-header">
        <ul>
          {currentChat.map((chatMsg, idx) => {
            const isUser = chatMsg.role === "user";
            const isBotLoading = isResponseLoading && chatMsg.role === "bot";

            return (
              <li key={idx} className={isUser ? "user-message" : "bot-message"}>
                {!isUser && !isBotLoading && (
                  <div className="bot-icon">
                    {/* <FaRobot size={23} /> */}
                    <img
                      className="ai-logo"
                      src={ailogo}
                      alt="AI Logo"
                      style={{ width: "23px", height: "23px" }}
                    />
                  </div>
                )}
                <div
                  className={
                    isUser ? "user-message-content" : "bot-message-content"
                  }
                >
                  <p>{chatMsg.content}</p>
                  {isBotLoading && (
                    <div className="loading-indicator">
                      <p>...</p>
                    </div>
                  )}
                </div>
                {isUser && (
                  <div className="user-icon">
                    {/* <BiSolidUserCircle size={23} /> */}
                    <img
                      className="user-logo"
                      src={userIcon}
                      alt="AI Logo"
                      style={{ width: "23px", height: "23px" }}
                    />
                  </div>
                )}
              </li>
            );
          })}

          {isResponseLoading && (
            <li className="bot-message">
              <div className="bot-icon">
                {/* <FaRobot size={23} /> */}
                <img
                  className="ai-logo"
                  src={ailogo}
                  alt="AI Logo"
                  style={{ width: "23px", height: "23px" }}
                />
              </div>
              <div className="bot-message-content">
                <p>....</p>
              </div>
            </li>
          )}
          {/* This ref helps in scrolling to the bottom */}
          <div ref={chatEndRef} />
        </ul>
      </div>
      <div className="main-bottom">
        {errorText && <p className="errorText">{errorText}</p>}
        <form className="form-container" onSubmit={submitHandler}>
          <input
            type="text"
            placeholder={
              isResponseLoading ? "Processing..." : "Send a message."
            }
            spellCheck="false"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit">
            <BiSend size={25} />
          </button>
        </form>
      </div>
    </section>
  );
};

export default Chat;
