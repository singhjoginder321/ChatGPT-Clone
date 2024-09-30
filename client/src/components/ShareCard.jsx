import React from "react";
import { toast } from "react-toastify";
import "../style/ShareCard.css"; // You can add styles in this CSS file

const ShareCard = ({ chatId, onClose }) => {
  const shareLink = `http://localhost:3000/fetch-chat?chat_id=${chatId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success("Link copied to clipboard!", {
      autoClose: 3000, // Toast will auto-close after 3 seconds
    });
  };

  return (
    <div className="share-card-overlay" onClick={onClose}>
      <div className="share-card" onClick={(e) => e.stopPropagation()}>
        <h2>Share this Chat</h2>
        <p>{shareLink}</p>
        <button onClick={handleCopy}>Copy Link</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ShareCard;
