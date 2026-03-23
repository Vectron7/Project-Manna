import React from 'react';

const MoodPopup = ({ onSelect }) => {
  const options = [
    { id: 'happy', label: 'Feliz', icon: '😊' },
    { id: 'neutral', label: 'Neutro', icon: '😐' },
    { id: 'sad', label: 'Triste', icon: '😟' }
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Como você está hoje?</h3>
        <div className="mood-grid">
          {options.map(opt => (
            <button key={opt.id} onClick={() => onSelect(opt.id)}>
              <span>{opt.icon}</span> {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodPopup;