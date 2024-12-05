import React from 'react';
import './ConfirmDelete.css';

const ConfirmDeleteModal = ({ show, onClose, onConfirm, Name }) => {
  if (!show) {
    return null;
  }

  return (
    <div>
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-content">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete {Name}?</p>
            <div className="modal-actions">
              <button className="modal-button" onClick={onConfirm}>Delete</button>
              <button className="modal-button" onClick={onClose}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
