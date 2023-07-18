"use client";

import { FC, useEffect, useRef, useState } from "react";
import { Message } from "@/lib/validations/message";
import { cn, toPusherKey } from "@/lib/utils";
import { format } from "date-fns";
import { pusherClient } from "@/lib/pusher";
import Image from "next/image";

interface MessagesProps {
  chatId: string;
  initialMessages: Message[];
  sessionId: string;
  sessionImg: string | null | undefined;
  partnerImg: string | null | undefined;
}

const Messages: FC<MessagesProps> = ({
  chatId,
  initialMessages,
  sessionId,
  sessionImg,
  partnerImg,
}) => {
  const scrollDownRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`chat:${chatId}`));

    const messageHandler = (message: Message) => {
      setMessages((prev) => [message, ...prev]);
    };

    pusherClient.bind("incoming_message", messageHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`));
      pusherClient.unbind("incoming_message", messageHandler);
    };
  }, [chatId]);

  const formatTimeStamp = (timestamp: number) => {
    return format(timestamp, "HH:mm");
  };

  return (
    <div
      id="messages"
      className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      <div ref={scrollDownRef}>
        {messages.map((message, index) => {
          const isCurrentUser = sessionId === message.senderId;

          const hasNextMessageFromSameUser =
            messages[index - 1]?.senderId === messages[index]?.senderId;

          return (
            <div
              className="chat-message"
              key={`${message.senderId}-${message.timestamp}`}
            >
              <div
                className={cn("flex items-end", {
                  "justify-end": isCurrentUser,
                })}
              >
                <div
                  className={cn(
                    "flex flex-col space-y-2 text-base max-w-xs mx-2",
                    {
                      "order-1 items-end": isCurrentUser,
                      "order-2 items-start": !isCurrentUser,
                    }
                  )}
                >
                  <span
                    className={cn("px-4 py-2 rounded-lg inline-block", {
                      "bg-indigo-600 text-white": isCurrentUser,
                      "bg-gray-200 text-gray-900": !isCurrentUser,
                      "rounded-br-none":
                        !hasNextMessageFromSameUser && isCurrentUser,
                      "rounded-bl-none":
                        !hasNextMessageFromSameUser && !isCurrentUser,
                    })}
                  >
                    {message.text}{" "}
                    <span className="ml-2 text-xs text-gray-400">
                      {formatTimeStamp(message.timestamp)}
                    </span>
                  </span>
                </div>

                <div>
                  <Image
                    fill
                    src={
                      isCurrentUser
                        ? (sessionImg as string)
                        : (partnerImg as string)
                    }
                    referrerPolicy="no-referrer"
                    alt="profile picture"
                    className="rounded-full"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Messages;
