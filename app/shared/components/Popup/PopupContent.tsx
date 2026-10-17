import React from 'react';
import { PopupContentProps } from './types';

/**
 * PopupContent - A helper component for structured popup content
 * Provides consistent layout for title, subtitle, icon, body content, and buttons
 */
const PopupContent: React.FC<PopupContentProps> = ({
  title,
  subtitle,
  icon,
  children,
  buttons,
  customContent,
}) => {
  // If customContent is provided, render it directly
  if (customContent) {
    return <>{customContent}</>;
  }

  return (
    <>
      {/* Header section */}
      {(icon || title || subtitle) && (
        <div className="shared-popup__header">
          {icon && (
            <div className="shared-popup__icon">
              {icon}
            </div>
          )}
          {title && (
            <div className="shared-popup__title">
              {typeof title === 'string' ? <span>{title}</span> : title}
            </div>
          )}
          {subtitle && (
            <div className="shared-popup__subtitle">
              {typeof subtitle === 'string' ? <span>{subtitle}</span> : subtitle}
            </div>
          )}
        </div>
      )}

      {/* Body section */}
      {children && (
        <div className="shared-popup__body">
          {children}
        </div>
      )}

      {/* Footer section with buttons */}
      {buttons && (
        <div className={`shared-popup__footer ${React.Children.count(buttons) === 1 ? 'shared-popup__footer--single' : 'shared-popup__footer--multiple'}`}>
          {buttons}
        </div>
      )}
    </>
  );
};

export default PopupContent;

