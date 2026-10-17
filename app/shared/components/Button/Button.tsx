import React, { memo, useCallback } from 'react';
import { useKeydown } from 'smarters-ino-ui-tv';


import '@/shared/styles/Button/button.scss';

type PButton = {
  isActive: boolean;
  ok?: () => void;
  back?: () => void;
  right?: () => void;
  left?: () => void;
  down?: () => void;
  up?: () => void;
  width?: string;
  height?: string;
  maxWidth?: string;
  minWidth?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  className?: string;
  ref?: React.RefObject<HTMLButtonElement>;
  onClick?: () => void;
};

const Button: React.FC<PButton> = memo(
  ({
    isActive,
    ref,
    ok,
    back,
    right,
    left,
    down,
    up,
    children,
    style,
    className = 'primary',
    maxWidth,
    minWidth,
    onClick,
  }) => {
    const handleOk = useCallback(() => {
      if (ok) {
        ok();
      }
    }, [ok]);

    const handleBack = useCallback(() => {
      if (back) {
        back();
      }
    }, [back]);

    const handleRight = useCallback(() => {
      if (right) {
        right();
      }
    }, [right]);

    const handleLeft = useCallback(() => {
      if (left) {
        left();
      }
    }, [left]);

    const handleDown = useCallback(() => {
      if (down) {
        down();
      }
    }, [down]);

    const handleUp = useCallback(() => {
      if (up) {
        up();
      }
    }, [up]);

    const controls = {
      isActive,
      ok: handleOk,
      back: handleBack,
      right: handleRight,
      left: handleLeft,
      down: handleDown,
      up: handleUp,
    };

    useKeydown(controls);

    return (
      <button
        ref={ref}
        style={{...style, maxWidth: maxWidth ? maxWidth + 'rem' : undefined, minWidth: minWidth ? minWidth + 'rem' : undefined}}
        className={`app_button ${className}  ${isActive ? 'active' : ''}`} 
        onClick={onClick ? onClick : handleOk}
      >
        {children}
      </button>
    );
  }
);

export { Button };
