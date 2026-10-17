import { setRootControl } from '@/slices/RootControlSlice';
import React from 'react'
import { FaBackspace, FaLevelUpAlt } from 'react-icons/fa';
import { MdOutlineKeyboardReturn } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { InoKeyboard, KeyboardKey } from 'smarters-ino-ui-tv'
import { useResolution } from '@hotel-smarters/resolution-hook';
import 'smarters-ino-ui-tv/dist/main.css'

interface KeyboardProps {
  isOpen: boolean;
  onClose?: () => void;
  setIsOpen?: (value: boolean) => void;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  maxLength?: number;
}

const Keyboard = ({
  isOpen,
  onClose,
  setIsOpen,
  value,
  onChange,
  onSubmit,
  maxLength = 100
}: KeyboardProps) => {

  const dispatch = useDispatch();
  const { getDeviceType } = useResolution();
  const deviceType = getDeviceType();

  const prevRootControl = useSelector((state: any) => state.rootControl.prevRootControl);
   
  const keyboardLayout: KeyboardKey[][] = [
    [
      { label: "1", value: "1" },
      { label: "2", value: "2" },
      { label: "3", value: "3" },
      { label: "4", value: "4" },
      { label: "5", value: "5" },
      { label: "6", value: "6" },
      { label: "7", value: "7" },
      { label: "8", value: "8" },
      { label: "9", value: "9" },
      { label: "0", value: "0" },
      { label: "=", value: "=" },
      { label: <FaBackspace />, value: "delete", action: "delete" },
    ],
    [
      { label: "q", value: "q" },
      { label: "w", value: "w" },
      { label: "e", value: "e" },
      { label: "r", value: "r" },
      { label: "t", value: "t" },
      { label: "y", value: "y" },
      { label: "u", value: "u" },
      { label: "i", value: "i" },
      { label: "o", value: "o" },
      { label: "p", value: "p" },
      { label: "-", value: "-" },
      { label: "_", value: "_" },
      { label: "+", value: "+" },
    ],
    [
      { label: "a", value: "a" },
      { label: "s", value: "s" },
      { label: "d", value: "d" },
      { label: "f", value: "f" },
      { label: "g", value: "g" },
      { label: "h", value: "h" },
      { label: "j", value: "j" },
      { label: "k", value: "k" },
      { label: "l", value: "l" },
      { label: ";", value: ";" },
      { label: ":", value: ":" },
      { label: <MdOutlineKeyboardReturn />, value: "submit", action: "submit" },
    ],
    [
      { label: <FaLevelUpAlt />, value: "shift", action: "shift" },
      { label: "z", value: "z" },
      { label: "x", value: "x" },
      { label: "c", value: "c" },
      { label: "v", value: "v" },
      { label: "b", value: "b" },
      { label: "n", value: "n" },
      { label: "m", value: "m" },
      { label: ".", value: "." },
      { label: "@", value: "@" },
    ],
    [
      { label: "⎵", value: "space", action: "space", width: 6 },
      { label: "Clear", value: "clear", action: "clear" },
    ],
  ];

  
  const handleClose = () => {
    onClose?.();
    setIsOpen?.(false);
    dispatch(setRootControl(prevRootControl!))
  };

  return (
    <InoKeyboard
      isOpen={isOpen}
      onClose={handleClose}
      onChange={onChange}
      initialValue={value}
      maxLength={maxLength}
      withPortal={true}
      infinite={false}
      onSubmit={(finalText) => {
        onChange(finalText);
        onSubmit?.(finalText);
        handleClose();
      }}
      classNames={`keyboard ${deviceType === 'TV' ? 'keyboard--tv' : ''}`}
      customLayout={keyboardLayout}
    />
  )
}

export { Keyboard }