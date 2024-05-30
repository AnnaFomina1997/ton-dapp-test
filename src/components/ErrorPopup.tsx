// src/components/ErrorPopup.tsx
import React from 'react';

interface ErrorPopupProps {
    message: string;
    onClose: () => void;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ message, onClose }) => {
    return (
        <div className="error-popup">
            <div className="error-popup-content">
                <span className="error-popup-close" onClick={onClose}>&times;</span>
                <p>{message}</p>
            </div>
        </div>
    );
};

export default ErrorPopup;
