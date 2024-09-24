import React, { useRef, useEffect, useState } from "react";

const PopupMenu = ({ popupRef, popupPosition, selectedChat, deleteChat }) => {
  const [adjustedPosition, setAdjustedPosition] = useState(popupPosition);

  useEffect(() => {
    const checkPopupPosition = () => {
      const popupElement = popupRef.current;
      const { innerHeight } = window;

      // Calculate bottom position of the popup
      const popupBottom = popupPosition.top + popupElement.offsetHeight;

      // Check if it overflows the viewport
      if (popupBottom > innerHeight) {
        // Adjust to show above the three dots
        setAdjustedPosition({
          top: popupPosition.top - popupElement.offsetHeight, // Show above
          left: popupPosition.left,
        });
      } else {
        // Keep original position if it fits
        setAdjustedPosition(popupPosition);
      }
    };

    checkPopupPosition();
  }, [popupPosition, popupRef]);

  return (
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
  );
};

export default PopupMenu;
