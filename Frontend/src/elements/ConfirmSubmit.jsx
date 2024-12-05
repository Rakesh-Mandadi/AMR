import React from 'react';
import PropTypes from 'prop-types';
import './ConfirmDelete.css';

const ConfirmSubmit = ({ show, onClose, onConfirm, Name }) => {
  if (!show) {
    return null;
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick} role="dialog" aria-labelledby="confirm-submit-dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-content">
          <h3 id="confirm-submit-dialog">Confirm Submission</h3>
          <p>Are you sure you want to submit the below details?</p>
          <div className='detailsDiv'>
            <p className='details' style={{ whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{ __html: Name.replace(/\n/g, '<br />') }} />
          </div>
          <div className="modal-actions">
            <button className="modal-button confirm-button" onClick={onConfirm}>Confirm</button>
            <button className="modal-button cancel-button" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

ConfirmSubmit.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  Name: PropTypes.string.isRequired,
};

export default ConfirmSubmit;





/*
import React from 'react';
import './ConfirmDelete.css';

const ConfirmSubmitModal = ({ show, onClose, onConfirm, Name }) => {
  if (!show) {
    return null;
  }

  return (
    <div>
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-content">
            <h3>Confirm Submission</h3>
            <p>Are you sure you want to submit the below details?</p>
            <div className='detailsDiv'>
              <p className='details' style={{ whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{ __html: Name.replace(/\n/g, '<br />') }} />
            </div>
            <div className="modal-actions">
              <button className="modal-button" onClick={onConfirm}>Confirm</button>
              <button className="modal-button" onClick={onClose}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSubmitModal;
*/