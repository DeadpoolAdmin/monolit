import React, { memo } from "react";
import { Button } from "@/shared/components/Button/Button";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { useResolution } from "@hotel-smarters/resolution-hook";

type WindowControlType = 'curtain' | 'blind';

interface WindowControlsProps {
  type: WindowControlType;
  rootControl: string;
  onUp: () => void;
  onBack: () => void;
  onRightFromClose: () => void;
  onLeftFromOpen: () => void;
  onRightFromOpen: () => void;
  onClose: () => void;
  onOpen: () => void;
  stop: boolean;
  stopClose: boolean;
}

const CONTROL_STATES = {
  curtain: {
    open: ROOT_CONTROL.ROOM_CONTROL_CURTAIN_OPEN,
    close: ROOT_CONTROL.ROOM_CONTROL_CURTAIN_CLOSE,
  },
  blind: {
    open: ROOT_CONTROL.ROOM_CONTROL_BLIND_OPEN,
    close: ROOT_CONTROL.ROOM_CONTROL_BLIND_CLOSE,
  },
};

export const WindowControls: React.FC<WindowControlsProps> = memo(({
  type,
  rootControl,  
  onUp,
  onBack,
  onRightFromClose,
  onLeftFromOpen,
  onClose,
  onOpen,
  onRightFromOpen,
  stop,
  stopClose,
}) => {
  const deviceType = useResolution().getDeviceType();
  const controlStates = CONTROL_STATES[type];

  return (
    <div className="room_control__content__buttons">
      <Button
        isActive={rootControl === controlStates.close && deviceType === 'TV'}
        className="secondary"
        maxWidth="23"
        up={onUp}
        back={onBack}
        down={onBack}
        left={onLeftFromOpen}
        right={onRightFromClose}
        ok={onClose}
      >
        <span className="button-text">{stopClose ? 'Stop' : 'Close'}</span>
      </Button>

      <Button
        maxWidth="23"
        isActive={rootControl === controlStates.open && deviceType === 'TV'}
        className="primary"
        back={onBack}
        left={onLeftFromOpen}
        right={onRightFromOpen}
        up={onUp}
        down={onBack}
        ok={onOpen}
      >
        <span className="button-text">{stop ? 'Stop' : 'Open'}</span>
      </Button>
    </div>
  );
});

