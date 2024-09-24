import React from "react";
import { CgDanger } from "react-icons/cg"; // Import the icon
import "../style/ConfirmationCard.css"; // Ensure styles are applied

const ConfirmationCard = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirmation-card">
      <CgDanger size={40} color="red" />
      <h2>Are you Sure?</h2>
      <p>
        {message ||
          "Do you really want to delete these records? This process cannot be undone."}
      </p>
      <div className="button-group">
        <button className="clear-button" onClick={onConfirm}>
          Delete
        </button>
        <button className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ConfirmationCard;
