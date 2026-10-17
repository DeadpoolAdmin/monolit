import React, { useMemo } from 'react';
import { useKeydown } from '@hotel-smarters/use-key-down-control';

import { PopupProps } from './types';

import '@shared/styles/Popup/Popup.scss';

const Popup: React.FC<PopupProps> = ({
  children,
  isOpen,
  onClose,
  className = '',
  contentClassName = '',
  contentStyle = {},
  width,
  height,
  showOverlay = true,
  overlayOpacity = 0.5,
  zIndex = 9999,
  closable = true,
  keyboardControls,
}) => {
  // Default keyboard controls if not provided
  const defaultControls = useMemo(() => ({
    isActive: isOpen,
    id: 'shared-popup-controls',
    back: () => {
      if (closable && onClose) {
        onClose();
      }
    },
  }), [isOpen, closable, onClose]);

  // Use custom keyboard controls if provided, otherwise use default
  const controls = keyboardControls || defaultControls;

  useKeydown(controls);

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closable && onClose && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Don't render if not open
  if (!isOpen) {
    return null;
  }

  // Combine custom styles with default styles
  const finalContentStyle: React.CSSProperties = {
    width: width || '150rem',
    height: height || 'auto',
    ...contentStyle,
  };

  return (
    <div 
      className={`shared-popup ${className}`}
      style={{ zIndex }}
      onClick={handleOverlayClick}
    >
      {showOverlay && (
        <div 
          className="shared-popup__overlay"
          style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
        />
      )}
      <div 
        className={`shared-popup__content ${contentClassName}`}
        style={finalContentStyle}
      >
        {children}
      </div>
    </div>
  );
};

export default Popup;

