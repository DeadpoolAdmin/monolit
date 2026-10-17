import React from "react";
import { Outlet } from "react-router-dom";

import "@/modules/Chat/styles/index.scss";

const ChatContainer = () => {
  return (
    <div className="chat__conatiner">
      <Outlet />
    </div>
  );
};

export default ChatContainer;
