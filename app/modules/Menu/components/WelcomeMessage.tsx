import React from "react";
import { PWelcomeMesage } from "../types/WelcomeMessageProps";
import { setFontSize } from "@/shared/functions/setFontSize";

const WelcomeMessage: React.FC<PWelcomeMesage> = ({
  welcome_subMessage,
  welcome__message,
  subMessageFontSize,
  messageFontSize,
  guestName,
}) => {


  return (
    <div className="welcome__message">
      <div
        className="welcome__subMessage"
        style={{ fontSize: setFontSize(messageFontSize), marginTop: '2rem' }}
      >
        {welcome__message?.replace(`{{guest.name}}`, guestName) || ''}
      </div>
      <div
        className="welcome__subMessage"
        style={{ fontSize: setFontSize(subMessageFontSize) }}
      >
        {welcome_subMessage?.replace(`{{guest.name}}`, guestName) || ''}
      </div>
    </div>
  );
};

export default WelcomeMessage;
