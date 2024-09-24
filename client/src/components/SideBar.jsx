import { useEffect, useRef, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { BiPlus, BiSolidUserCircle } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { FaTrash } from "react-icons/fa6";
import "../style/Sidebar.css";
import ConfirmationCard from "./ConfirmationCard"; // Import the ConfirmationCard

const SideBar = ({
  uniqueTitles,
  localUniqueTitles,
  createNewChat,
  backToHistoryPrompt,
  isShowSidebar,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [adjustedPosition, setAdjustedPosition] = useState({ top: 0, left: 0 });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const popupRef = useRef(null);

  const clearConversations = () => {
    localStorage.clear();
    window.location.reload();
  };

  const deleteChat = (title) => {
    const updatedUniqueTitles = uniqueTitles.filter((t) => t !== title);
    const updatedLocalUniqueTitles = localUniqueTitles.filter(
      (t) => t !== title
    );

    localStorage.setItem("uniqueTitles", JSON.stringify(updatedUniqueTitles));
    localStorage.setItem(
      "localUniqueTitles",
      JSON.stringify(updatedLocalUniqueTitles)
    );
    window.location.reload();
  };

  const handleMenuClick = (title, event) => {
    setSelectedChat(title);
    const { top, left, height } = event.currentTarget.getBoundingClientRect();
    setPopupPosition({ top: top + height, left: left });
    setShowPopup((prev) => !prev);
  };

  const handleOutsideClick = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setShowPopup(false);
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
                  <span onClick={() => backToHistoryPrompt(uniqueTitle)}>
                    {uniqueTitle}
                  </span>
                  <button
                    onClick={(e) => handleMenuClick(uniqueTitle, e)}
                    className="menu-button"
                  >
                    <BsThreeDots size={20} />
                  </button>
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
                  <span onClick={() => backToHistoryPrompt(uniqueTitle)}>
                    {uniqueTitle}
                  </span>
                  <button
                    onClick={(e) => handleMenuClick(uniqueTitle, e)}
                    className="menu-button"
                  >
                    <BsThreeDots size={20} />
                  </button>
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
          <span>Clear Conversation</span>
        </div>
        <div className="sidebar-info-user">
          <BiSolidUserCircle size={20} />
          <p>User</p>
        </div>
      </div>

      {/* Confirmation Card */}
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

      {/* Popup Menu */}
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
            <li>Rename</li>
            <li>Archive</li>
            <li>Share</li>
          </ul>
        </div>
      )}
    </section>
  );
};

export default SideBar;
