import React from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import "../style/ArchiveCard.css";

const ArchiveCard = ({ archivedChats, onUnarchive, onClose }) => {
  return (
    <div className="archive-card-overlay">
      <div className="archive-card">
        <button className="close-button" onClick={onClose}>
          <AiFillCloseCircle size={20} />
        </button>
        <h2>Archived Chats</h2>
        {archivedChats.length === 0 ? (
          <p className="no-archived-chats">No archived chats here.</p>
        ) : (
          <ul>
            {archivedChats.map((chat) => (
              <li key={chat.chat_id} className="archived-chat-item">
                <span>{chat.title}</span>
                <button
                  className="unarchive-btn"
                  onClick={() => onUnarchive(chat.chat_id)}
                >
                  Unarchive
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ArchiveCard;
