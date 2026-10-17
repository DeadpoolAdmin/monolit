import { ReactNode, CSSProperties } from 'react';

export interface PopupProps {
  // Content to display inside the popup
  children: ReactNode;
  
  // Whether the popup is visible
  isOpen: boolean;
  
  // Callback when popup should close
  onClose?: () => void;
  
  // Custom class name for the popup wrapper
  className?: string;
  
  // Custom class name for the popup content container
  contentClassName?: string;
  
  // Custom styles for the popup content
  contentStyle?: CSSProperties;
  
  // Width of the popup content (default: 150rem)
  width?: string;
  
  // Height of the popup content (optional)
  height?: string;
  
  // Whether to show background overlay (default: true)
  showOverlay?: boolean;
  
  // Custom overlay opacity (default: 0.5)
  overlayOpacity?: number;
  
  // Z-index for the popup (default: 9999)
  zIndex?: number;
  
  // Whether the popup can be closed by clicking overlay or back button (default: true)
  closable?: boolean;
  
  // Custom keyboard controls configuration
  keyboardControls?: {
    isActive: boolean;
    id: string;
    back?: () => void;
    [key: string]: any;
  };
}

export interface PopupContentProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  buttons?: ReactNode;
  customContent?: ReactNode;
}

