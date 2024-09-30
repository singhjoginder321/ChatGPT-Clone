import { useEffect, useRef, useState } from "react";
import ailogo from "../assets/ai-icon.svg";
import userIcon from "../assets/user-icon2.svg";
import { fetchChatsByChatId } from "../services/apiService"; // Adjust the path as necessary
import "../style/Chat.css";

const SharedChat = () => {
  const [currentChat, setCurrentChat] = useState([]);
  const [isResponseLoading, setIsResponseLoading] = useState(true);
  const chatEndRef = useRef(null);

  // Function to fetch chat messages based on chat_id from query parameters
  const fetchChatById = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const chatId = urlParams.get("chat_id");

    if (!chatId) {
      console.error("chat_id is required.");
      setIsResponseLoading(false);
      return;
    }

    try {
      const chatData = await fetchChatsByChatId(chatId); // Use the imported function
      setCurrentChat(chatData);
      setIsResponseLoading(false);
    } catch (error) {
      console.error("Error fetching chat:", error);
      setIsResponseLoading(false);
    }
  };

  useEffect(() => {
    fetchChatById();
  }, []);

  // Scroll to the bottom of the chat whenever messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentChat]);

  return (
    <section className="main">
      {isResponseLoading && (
        <div className="loading-indicator">
          <p>Loading...</p>
        </div>
      )}

      {!currentChat.length && !isResponseLoading && (
        <div className="empty-chat-container">
          <img
            className="ai-logo"
            src={ailogo}
            alt="AI Logo"
            style={{ width: "45px", height: "45px" }}
          />
          <h1>No chat messages found.</h1>
        </div>
      )}

      <div className="main-header">
        <ul>
          {currentChat.map((chatMsg, idx) => {
            const isUser = chatMsg.role === "user";
            return (
              <li key={idx} className={isUser ? "user-message" : "bot-message"}>
                {!isUser && (
                  <div className="bot-icon">
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
                </div>
                {isUser && (
                  <div className="user-icon">
                    <img
                      className="user-logo"
                      src={userIcon}
                      alt="User Icon"
                      style={{ width: "23px", height: "23px" }}
                    />
                  </div>
                )}
              </li>
            );
          })}
          <div ref={chatEndRef} />
        </ul>
      </div>
    </section>
  );
};

export default SharedChat;
