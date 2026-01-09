"use client"

import { useUser } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { LiveKitRoom, VideoConference } from "@livekit/components-react"
import "@livekit/components-styles"

interface MediaRoomProps {
    chatId: string,
    video: boolean,
    audio: boolean
}

export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
    const { user } = useUser()
    const [token, setToken] = useState('')

    useEffect(() => {
        if (!user?.firstName || !user?.lastName) return

        const name = user?.firstName + " " + user?.lastName;

        const wrapper = async () => {
            try {
                const resp = await fetch(`/api/livekit?room=${chatId}&username=${name}`)
                const data = await resp.json()
                setToken(data.token)
            } catch (e) {
                console.log(e)
            }
        }
        wrapper();
    }, [user?.firstName, user?.lastName, chatId])

    if (token === "") {
        return (
            <div className="flex items-center justify-center flex-1 flex-col">
                <Loader2 className="h-7 w-7 animate-spin my-4" />
                <p className="text-xs">Loading...</p>
            </div>
        )
    }

    return (
        <LiveKitRoom
            data-lk-theme="default" // we can set this light and dark.
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            token={token}
            connect={true}
            video={video}
            audio={audio}
        >
            <VideoConference />
        </LiveKitRoom>
    )
}