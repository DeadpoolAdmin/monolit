import React, { useEffect } from "react";
import { useChatOpened } from "../hooks/useChatOpened";
import { usePolyfillSearchParams } from "@hotel-smarters/polyfill-search-params";
import MessagesHeader from "../components/MessagesHeader";
import MessageBody from "../components/MessageBody";
import { useGetFrontDeskMessages } from "../hooks/useGetFrontDeskMessages";

const Messages = () => {
  const searchParam = usePolyfillSearchParams();

  const sessionId = searchParam.get("departmentId");

  const { chatOpened, chatClosed } = useChatOpened();

  const { frontDeskMessages, isLoading } = useGetFrontDeskMessages();

  useEffect(() => {
    if (!sessionId) return;

    chatOpened();

    return () => {
      chatClosed();
      console.log("Cleaning up chat opened/closed listeners");
    };
  }, [sessionId]);

  return <div className="messages">
    <MessagesHeader />
    <MessageBody isLoading={isLoading} frontDeskMessages={frontDeskMessages} />
  </div>;
};

export default Messages;
