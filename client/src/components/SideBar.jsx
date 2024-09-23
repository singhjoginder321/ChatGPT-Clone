// SideBar.jsx
import { BiPlus, BiSolidUserCircle } from "react-icons/bi";
import { FaTrash } from "react-icons/fa6";

const SideBar = ({
  uniqueTitles,
  localUniqueTitles,
  createNewChat,
  backToHistoryPrompt,
  isShowSidebar,
}) => {
  const clearConversations = () => {
    localStorage.clear(); // Clear local storage
    window.location.reload(); // Reload the page
  };

  return (
    <section className={`sidebar ${isShowSidebar ? "open" : ""}`}>
      <div className="sidebar-header" onClick={createNewChat} role="button">
        <BiPlus size={20} />
        <button>New Chat</button>
      </div>
      <div className="sidebar-history">
        {uniqueTitles.length > 0 && (
          <>
            <p>Ongoing</p>
            <ul>
              {uniqueTitles.map((uniqueTitle, idx) => (
                <li key={idx} onClick={() => backToHistoryPrompt(uniqueTitle)}>
                  {uniqueTitle}
                </li>
              ))}
            </ul>
          </>
        )}
        {localUniqueTitles.length > 0 && (
          <>
            <p>Previous</p>
            <ul>
              {localUniqueTitles.map((uniqueTitle, idx) => (
                <li key={idx} onClick={() => backToHistoryPrompt(uniqueTitle)}>
                  {uniqueTitle}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <div className="sidebar-info">
        <div onClick={clearConversations} className="sidebar-info-upgrade">
          <FaTrash size={20} />
          <span>Clear Conversation</span>
        </div>
        <div className="sidebar-info-user">
          <BiSolidUserCircle size={20} />
          <p>User</p>
        </div>
      </div>
    </section>
  );
};

export default SideBar;
