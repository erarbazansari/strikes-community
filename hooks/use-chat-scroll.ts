import { useEffect, useState } from "react";

type ChatScrollProps = {
    chatRef: React.RefObject<HTMLDivElement>;
    bottomRef: React.RefObject<HTMLDivElement>;
    topRef?: React.RefObject<HTMLDivElement>; // Added for intersection observer
    shouldLoadMore: boolean;
    loadMore: () => void;
    count: number;
};

export const useChatScroll = ({
    chatRef,
    bottomRef,
    topRef,
    shouldLoadMore,
    loadMore,
    count,
}: ChatScrollProps) => {
    const [hasInitialized, setHasInitialized] = useState(false);

    useEffect(() => {
        const topDiv = topRef?.current;

        if (!topDiv || !shouldLoadMore) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                loadMore();
            }
        }, {
            root: chatRef.current,
            threshold: 0.1,
            rootMargin: "100px 0px 0px 0px" // Trigger slightly before it comes into view
        });

        observer.observe(topDiv);

        return () => {
            observer.disconnect();
        };
    }, [shouldLoadMore, loadMore, chatRef, topRef]);

    useEffect(() => {
        const bottomDiv = bottomRef?.current;
        const topDiv = chatRef?.current;

        const shouldAutoScroll = () => {
            if (!hasInitialized && bottomDiv) {
                setHasInitialized(true);
                return true;
            }
            if (!topDiv) {
                return false;
            }

            const distanceFromBottom =
                topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
            return distanceFromBottom <= 100;
        };
        if (shouldAutoScroll()) {
            setTimeout(() => {
                bottomRef.current?.scrollIntoView({
                    behavior: "smooth",
                });
            }, 100);
        }
    }, [bottomRef, chatRef, count, hasInitialized]);
};
