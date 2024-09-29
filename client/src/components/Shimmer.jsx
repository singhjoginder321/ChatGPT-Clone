import React from "react";
import "../style/Shimmer.css"; // Shimmer styles will go here

const ShimmerChat = () => {
  return (
    <div className="shimmer-chat-container">
      {/* Sidebar section - 30% width */}
      <div className="shimmer-sidebar">
        <div className="shimmer-sidebar-item"></div>
        <div className="shimmer-sidebar-item"></div>
        <div className="shimmer-sidebar-item"></div>
        <div className="shimmer-sidebar-item"></div>
        <div className="shimmer-sidebar-item"></div>
        <div className="shimmer-sidebar-item"></div>
        <div className="shimmer-sidebar-item"></div>
      </div>

      {/* Chat section - 70% width */}
      <div className="shimmer-chat">
        <div className="shimmer-message">
          <div className="shimmer-avatar"></div>
          <div className="shimmer-content">
            <div className="shimmer-bubble"></div>
            <div className="shimmer-bubble short"></div>
          </div>
        </div>
        <div className="shimmer-message">
          <div className="shimmer-avatar"></div>
          <div className="shimmer-content">
            <div className="shimmer-bubble"></div>
            <div className="shimmer-bubble short"></div>
          </div>
        </div>
        <div className="shimmer-message">
          <div className="shimmer-avatar"></div>
          <div className="shimmer-content">
            <div className="shimmer-bubble"></div>
            <div className="shimmer-bubble short"></div>
          </div>
        </div>
        <div className="shimmer-message">
          <div className="shimmer-avatar"></div>
          <div className="shimmer-content">
            <div className="shimmer-bubble"></div>
            <div className="shimmer-bubble short"></div>
          </div>
        </div>
        <div className="shimmer-message">
          <div className="shimmer-avatar"></div>
          <div className="shimmer-content">
            <div className="shimmer-bubble"></div>
            <div className="shimmer-bubble short"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShimmerChat;
