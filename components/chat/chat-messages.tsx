"use client";

import {
    type Member,
    type Message,
    type Profile,
} from "@/lib/generated/prisma/client";
import ChatWelcome from "./chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader2, ServerCrash, ChevronUp } from "lucide-react";
import { Fragment, useRef, ElementRef } from "react";
import ChatItem from "./chat-item";
import { format } from "date-fns";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import { Button } from "@/components/ui/button";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

interface ChatMessagesProps {
    name: string;
    member: Member;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, string>;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
    type: "channel" | "conversation";
}

type MessageWithMemberProfile = Message & {
    member: Member & {
        profile: Profile;
    };
};

const ChatMessages = ({
    name,
    member,
    chatId,
    apiUrl,
    socketUrl,
    socketQuery,
    paramKey,
    paramValue,
    type,
}: ChatMessagesProps) => {
    const queryKey = `chat:${chatId}`;
    const addKey = `chat:${chatId}:messages`;
    const updateKey = `chat:${chatId}:messages:update`;

    const chatRef = useRef<ElementRef<"div">>(null);
    const bottomRef = useRef<ElementRef<"div">>(null);
    const topRef = useRef<ElementRef<"div">>(null);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
        useChatQuery({ apiUrl, paramKey, paramValue, queryKey });

    useChatSocket({ queryKey, addKey, updateKey });
    useChatScroll({
        bottomRef: bottomRef as React.RefObject<HTMLDivElement>,
        chatRef: chatRef as React.RefObject<HTMLDivElement>,
        topRef: topRef as React.RefObject<HTMLDivElement>,
        count: data?.pages?.[0].items.length ?? 0,
        loadMore: fetchNextPage,
        shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    });

    if (status === "pending") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className="h-6 w-6 animate-spin my-4" />
            </div>
        );
    }
    if (status === "error") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <ServerCrash className="h-6 w-6 my-4" />
                <p className="text-xs">Something went wrong!</p>
            </div>
        );
    }

    return (
        <div
            ref={chatRef}
            className="flex flex-1 flex-col py-4 overflow-y-auto">
            <div className="flex-1">
                {!hasNextPage && <ChatWelcome type={type} name={name} />}
                {hasNextPage && (
                    <div ref={topRef} className="flex justify-center mb-4">
                        <Button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            variant="ghost"
                            size="sm"
                            className="gap-2">
                            {isFetchingNextPage ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Loading messages...</span>
                                </>
                            ) : (
                                <>
                                    <ChevronUp className="h-4 w-4" />
                                    <span>Load previous messages</span>
                                </>
                            )}
                        </Button>
                    </div>
                )}
                {/* messages */}
                <div className="flex flex-col-reverse mt-auto">
                    {data?.pages?.map((group, i) => (
                        <Fragment key={i}>
                            {group.items.map(
                                (message: MessageWithMemberProfile) => (
                                    <ChatItem
                                        key={message.id}
                                        id={message.id}
                                        content={message.content}
                                        currentMember={member}
                                        fileUrl={message.fileUrl}
                                        deleted={message.deleted}
                                        timestamp={format(
                                            new Date(message.createdAt),
                                            DATE_FORMAT,
                                        )}
                                        isUpdated={
                                            new Date(
                                                message.createdAt,
                                            ).getTime() !==
                                            new Date(
                                                message.updatedAt,
                                            ).getTime()
                                        }
                                        socketUrl={socketUrl}
                                        socketQuery={socketQuery}
                                        member={message.member}
                                    />
                                ),
                            )}
                        </Fragment>
                    ))}
                </div>
            </div>
            <div ref={bottomRef} />
        </div>
    );
};

export default ChatMessages;
