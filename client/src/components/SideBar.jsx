import { useEffect, useRef, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { BiPlus, BiSolidUserCircle } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { FaTrash } from "react-icons/fa6";
import archiveIcon from "../assets/archive icon.svg";
import kanerikaLogo from "../assets/logo-kanerika.png";
import ArchiveCard from "../components/ArchiveCard"; // Import the ArchiveCard
import ShareCard from "../components/ShareCard";
import {
  archiveChat,
  deleteAllChats,
  deleteChatsByChatId,
  fetchAllChatTitles,
  fetchArchivedChats,
  fetchChatsByChatId,
  renameChatTitle,
  unarchiveChat,
} from "../services/apiService"; // Import the API functions
import "../style/Sidebar.css";
import ConfirmationCard from "./ConfirmationCard"; // Import the ConfirmationCard

const SideBar = ({
  setUniqueTitles,
  previousChats,
  setLocalChats,
  setCurrentChatId,
  currentChatId,
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
  const [isRenaming, setIsRenaming] = useState(false); // State for renaming
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [adjustedPosition, setAdjustedPosition] = useState({ top: 0, left: 0 });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // New state for delete confirmation
  const [isHovered, setIsHovered] = useState(false); //for hover on archive chats button
  const [chatToDelete, setChatToDelete] = useState(null); // Chat ID for deletion
  const popupRef = useRef(null);
  const [showArchiveCard, setShowArchiveCard] = useState(false); // State for showing the ArchiveCard
  const [archivedChats, setArchivedChats] = useState([]);
  const [showShareCard, setShowShareCard] = useState(false);
  const [shareChatId, setShareChatId] = useState(null);

  const handleArchiveIconClick = async () => {
    try {
      const fetchedArchivedChats = await fetchArchivedChats(); // Await the fetch

      if (!fetchedArchivedChats || fetchedArchivedChats.length === 0) {
        setArchivedChats([]);
        setShowArchiveCard(true);
        console.log("No archived chats available.");
      } else {
        setArchivedChats(fetchedArchivedChats); // Set fetched chats
        console.log("Archived Chats:", fetchedArchivedChats);
      }

      setShowArchiveCard(true); // Show the archive card
    } catch (error) {
      console.error("Error fetching archived chats:", error);
      setShowArchiveCard(true);
      setArchivedChats([]);
    }
  };

  const handleUnarchive = async (chatId) => {
    try {
      await unarchiveChat(chatId);
      setArchivedChats((prev) =>
        prev.filter((chat) => chat.chat_id !== chatId)
      );
      const chats = await fetchAllChatTitles();
      setLocalChats(chats);
    } catch (error) {
      console.error("Error while fetching the Archive chats", error);
    }
  };

  // Close the archive card
  const closeArchiveCard = () => {
    setShowArchiveCard(false);
  };

  const handleArchiveChat = async (chatId) => {
    try {
      await archiveChat(chatId); // Call the API to archive the chat
      // const chats = await fetchAllChatTitles();
      const chatExists = uniqueTitles.some((chat) => chat.chat_id === chatId);

      setUniqueTitles((prev) => prev.filter((chat) => chat.chat_id !== chatId));
      setLocalChats((prev) => prev.filter((chat) => chat.chat_id !== chatId));
      if (chatExists) {
        setPreviousChats([]);
      }
      const fetchedArchivedChats = await fetchArchivedChats(); // Fetch updated archived chats
      setArchivedChats(fetchedArchivedChats);
    } catch (error) {
      console.error("Failed to archive chat:", error);
    }
  };

  const clearConversations = async () => {
    try {
      await deleteAllChats(); // Call the API to delete all chats
      localStorage.clear(); // Optionally clear local storage
      window.location.reload(); // Reload the page to reflect changes
    } catch (error) {
      console.error("Failed to clear conversations:", error);
    }
  };

  // New function to handle delete chat click
  const handleDeleteChatClick = (chat_id) => {
    setChatToDelete(chat_id);
    setShowDeleteConfirmation(true);
    setShowPopup(false); // Close the popup when confirming deletion
  };

  // Confirm deletion of the selected chat
  const handleDeleteConfirmed = async () => {
    if (chatToDelete) {
      await deleteChatsByChatId(chatToDelete); // Call the delete function
      setChatToDelete(null); // Reset the chat to delete
      setShowDeleteConfirmation(false); // Close confirmation card
      window.location.reload();
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false); // Close confirmation card
    setChatToDelete(null); // Reset the chat to delete
  };

  const handleMenuClick = (chat, event) => {
    setCurrentTitle(chat.title);
    // console.log("current title", chat.title);
    setNewTitle(chat.title);
    // console.log("new title", chat.title);
    setCurrentChatId(chat.chat_id);
    setSelectedChat(chat.chat_id);
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

  const backToHistoryPrompt = async (title, chat_id) => {
    try {
      if (chat_id) {
        const chats = await fetchChatsByChatId(chat_id);
        setCurrentChatId(chats.chatId);
        // setLocalChats(chats);
        setPreviousChats(chats);
        setUniqueTitles([{ chat_id: chat_id, title: title }]);
        // console.log("chats inside backtohistprom", chats);
        // console.log("Prevchats inside backtohistprom", previousChats);
        setCurrentTitle(title); // This sets the title after fetching
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  // useEffect(() => {
  //   console.log("Updated previousChats:", previousChats);
  // }, [previousChats]); // This runs every time previousChats changes

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
    console.log();
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
      <div className="sidebar-info-user-1">
        <img src={kanerikaLogo} alt="User" className="user-image" />
        <div className="archive-button-container">
          <img
            src={archiveIcon}
            alt="archive"
            className="archive-icon"
            onClick={handleArchiveIconClick} // Change this to handle click
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
          {isHovered && <div className="popup">Archive Chats</div>}
        </div>
        {showArchiveCard && (
          <ArchiveCard
            archivedChats={archivedChats}
            onUnarchive={handleUnarchive}
            onClose={closeArchiveCard}
          />
        )}
      </div>
      <div className="sidebar-header" onClick={createNewChat} role="button">
        <BiPlus size={20} />
        <button>New Chat</button>
      </div>
      <div className="sidebar-history">
        {uniqueTitles.length > 0 && (
          <>
            <p>Ongoing</p>
            <ul>
              {uniqueTitles.map((chat, idx) => (
                <li key={idx} className="chat-item-ongoing">
                  {isRenaming && selectedChat === chat.chat_id ? (
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
                        onClick={() =>
                          backToHistoryPrompt(chat.title, chat.chat_id)
                        }
                      >
                        {chat.title}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMenuClick(chat, e);
                        }}
                        className="menu-button"
                      >
                        <BsThreeDots className="white-icon" size={20} />
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
        {/* {uniqueTitles && (
          <>
            <p>Ongoing</p>
            <ul>
              <li className="chat-item">
                {isRenaming && selectedChat === uniqueTitles.chat_id ? (
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
                      onClick={() =>
                        backToHistoryPrompt(
                          uniqueTitles.title,
                          uniqueTitles.chat_id
                        )
                      }
                    >
                      {uniqueTitles.title}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuClick(uniqueTitles.chat_id, e);
                      }}
                      className="menu-button"
                    >
                      <BsThreeDots size={20} />
                    </button>
                  </>
                )}
              </li>
            </ul>
          </>
        )} */}

        {localUniqueTitles.length > 0 && (
          <>
            <p>Previous</p>
            <ul>
              {localUniqueTitles.map((chat, idx) => (
                <li key={idx} className="chat-item">
                  {isRenaming && selectedChat === chat.chat_id ? (
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
                        onClick={() =>
                          backToHistoryPrompt(chat.title, chat.chat_id)
                        } // Use chat_id for fetching
                      >
                        {chat.title}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering the parent onClick
                          handleMenuClick(chat, e);
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
      {/* Confirmation for deleting a single chat */}
      {showDeleteConfirmation && (
        <>
          <div className="confirmation-overlay" />
          <ConfirmationCard
            message="Do you really want to delete this chat? This process cannot be undone."
            onConfirm={handleDeleteConfirmed}
            onCancel={handleDeleteCancel}
          />
        </>
      )}
      {showShareCard && (
        <ShareCard
          chatId={shareChatId}
          onClose={() => {
            setShowShareCard(false); // Close ShareCard
            setShareChatId(null); // Reset chatId
          }}
        />
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
            <li onClick={() => handleDeleteChatClick(selectedChat)}>Delete</li>
            <li
              onClick={() => {
                setIsRenaming(true); // Set renaming state
                setShowPopup(false); // Close popup
              }}
            >
              Rename
            </li>
            <li
              onClick={() => {
                handleArchiveChat(selectedChat); // Call archive function
                setShowPopup(false); // Close popup after archiving
              }}
            >
              Archive
            </li>
            <li
              onClick={() => {
                setShareChatId(selectedChat); // Set chatId for sharing
                setShowShareCard(true); // Show ShareCard
                setShowPopup(false); // Close popup
              }}
            >
              Share
            </li>
          </ul>
        </div>
      )}
    </section>
  );
};

export default SideBar;
