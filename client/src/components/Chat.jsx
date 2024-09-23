// Chat.jsx
import { BiSend, BiSolidUserCircle } from "react-icons/bi";
import { FaRobot } from "react-icons/fa";

const Chat = ({
  currentChat,
  text,
  setText,
  isResponseLoading,
  submitHandler,
  errorText,
  scrollToLastItem,
}) => {
  return (
    <section className="main">
      {!currentChat.length && (
        <div className="empty-chat-container">
          {/* <img
            src="images/chatgpt-logo.svg"
            width={45}
            height={45}
            alt="ChatGPT"
          /> */}
          <FaRobot size={45} />
          <h1>Chat GPT Clone</h1>
          <h3>How can I help you today?</h3>
        </div>
      )}

      <div className="main-header">
        <ul>
          {currentChat.map((chatMsg, idx) => {
            const isUser = chatMsg.role === "user";

            return (
              <li key={idx} ref={scrollToLastItem}>
                {isUser ? (
                  <div>
                    <BiSolidUserCircle size={23} />
                  </div>
                ) : (
                  //   <img src="images/chatgpt-logo.svg" alt="ChatGPT" />
                  <FaRobot size={23} />
                )}
                <div>
                  <p className="role-title">{isUser ? "You" : "ChatGPT"}</p>
                  <p>{chatMsg.content}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="main-bottom">
        {errorText && <p className="errorText">{errorText}</p>}
        {errorText && <p id="errorTextHint">Backend is not working Properly</p>}
        <form className="form-container" onSubmit={submitHandler}>
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
