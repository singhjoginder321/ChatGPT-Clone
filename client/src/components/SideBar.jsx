import { useEffect, useRef, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { BiPlus, BiSolidUserCircle } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { FaTrash } from "react-icons/fa6";
import {
  deleteAllChats,
  deleteChatsByTitle,
  fetchChatsByTitle,
  renameChatTitle,
} from "../services/apiService"; // Import the API functions
import "../style/Sidebar.css";
import ConfirmationCard from "./ConfirmationCard"; // Import the ConfirmationCard

const SideBar = ({
  handleRename,
  setCurrentTitle,
  setPreviousChats,
  uniqueTitles,
  localUniqueTitles,
  createNewChat,
  isShowSidebar,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [isRenaming, setIsRenaming] = useState(false); // New state for renaming
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [adjustedPosition, setAdjustedPosition] = useState({ top: 0, left: 0 });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const popupRef = useRef(null);

  const clearConversations = async () => {
    try {
      await deleteAllChats(); // Call the API to delete all chats
      localStorage.clear(); // Optionally clear local storage
      window.location.reload(); // Reload the page to reflect changes
    } catch (error) {
      console.error("Failed to clear conversations:", error);
    }
  };

  const deleteChat = async (title) => {
    try {
      await deleteChatsByTitle(title); // Call the API to delete the chat by title
      setPreviousChats((prev) => prev.filter((chat) => chat.title !== title));
      window.location.reload(); // Reload to reflect changes
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  const handleMenuClick = (title, event) => {
    setSelectedChat(title);
    setShowPopup(true);
    const { top, left, height } = event.currentTarget.getBoundingClientRect();
    setPopupPosition({ top: top + height, left });
  };

  const handleOutsideClick = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setShowPopup(false);
      setIsRenaming(false); // Reset renaming state
    }
  };

  const handleClearConversationsClick = () => {
    setShowConfirmation(true);
  };

  const handleClearConfirmed = () => {
    clearConversations();
    setShowConfirmation(false);
  };

  const handleCancelClear = () => {
    setShowConfirmation(false);
  };

  const backToHistoryPrompt = async (uniqueTitle) => {
    try {
      const chats = await fetchChatsByTitle(uniqueTitle);
      setPreviousChats(chats);
      setCurrentTitle(uniqueTitle);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const handleRenameChat = async (event) => {
    if (event.key === "Enter" && newTitle) {
      try {
        await renameChatTitle(selectedChat, newTitle);
        handleRename(selectedChat, newTitle); // Update local state in App
        setShowPopup(false);
        setSelectedChat(null);
        setIsRenaming(false);
        setNewTitle("");
      } catch (error) {
        console.error("Failed to rename chat:", error);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const checkPopupPosition = () => {
      const popupElement = popupRef.current;
      const { innerHeight } = window;

      if (popupElement) {
        const popupBottom = popupPosition.top + popupElement.offsetHeight;

        if (popupBottom > innerHeight) {
          setAdjustedPosition({
            top: popupPosition.top - popupElement.offsetHeight, // Show above
            left: popupPosition.left,
          });
        } else {
          setAdjustedPosition(popupPosition); // Keep original position
        }
      }
    };

    checkPopupPosition();
  }, [popupPosition, showPopup]);

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
                <li key={idx} className="chat-item">
                  {isRenaming && selectedChat === uniqueTitle ? (
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onKeyDown={handleRenameChat}
                      placeholder="New title..."
                      autoFocus
                    />
                  ) : (
                    <>
                      <span
                        className="chat-button"
                        onClick={() => backToHistoryPrompt(uniqueTitle)}
                      >
                        {uniqueTitle}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering the parent onClick
                          handleMenuClick(uniqueTitle, e);
                        }}
                        className="menu-button"
                      >
                        <BsThreeDots size={20} />
                      </button>
                    </>
                  )}
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
                <li key={idx} className="chat-item">
                  {isRenaming && selectedChat === uniqueTitle ? (
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onKeyDown={handleRenameChat}
                      placeholder="New title..."
                      autoFocus
                    />
                  ) : (
                    <>
                      <span
                        className="chat-button"
                        onClick={() => backToHistoryPrompt(uniqueTitle)}
                      >
                        {uniqueTitle}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering the parent onClick
                          handleMenuClick(uniqueTitle, e);
                        }}
                        className="menu-button"
                      >
                        <BsThreeDots size={20} />
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <div className="sidebar-info">
        <div
          onClick={handleClearConversationsClick}
          className="sidebar-info-upgrade"
        >
          <FaTrash size={20} />
          <span>Delete Conversations</span>
        </div>
        <div className="sidebar-info-user">
          <BiSolidUserCircle size={20} />
          <p>User</p>
        </div>
      </div>

      {showConfirmation && (
        <>
          <div className="confirmation-overlay" />
          <ConfirmationCard
            message="Do you really want to delete these records? This process cannot be undone."
            onConfirm={handleClearConfirmed}
            onCancel={handleCancelClear}
          />
        </>
      )}

      {showPopup && (
        <div
          className="popup-menu"
          ref={popupRef}
          style={{
            top: adjustedPosition.top,
            left: adjustedPosition.left,
          }}
        >
          <ul>
            <li onClick={() => deleteChat(selectedChat)}>Delete</li>
            <li
              onClick={() => {
                setNewTitle(selectedChat); // Set the new title to current title
                setIsRenaming(true); // Set renaming state
                setShowPopup(false); // Close popup
              }}
            >
              Rename
            </li>
            <li>Archive</li>
            <li>Share</li>
          </ul>
        </div>
      )}
    </section>
  );
};

export default SideBar;
