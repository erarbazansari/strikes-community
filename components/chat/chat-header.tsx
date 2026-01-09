import { Hash } from 'lucide-react'
import MobileToggle from '../mobile-toggle'
import UserAvatar from '../user-avatar'
import { SocketIndicator } from '../socket-indicator'
import { ChatVideoButton } from './chat-video-button'

interface ChatHeaderProps {
    serverId: string,
    name: string,
    type: "channel" | "conversation",
    imageUrl?: string
}

const ChatHeader = ({ serverId, name, type, imageUrl }: ChatHeaderProps) => {
    return (
        <div className='text-md font-semibold  px-3 flex items-center border-b h-12 bg-secondary border-primary/10'>
            <MobileToggle serverId={serverId} />
            {type === "channel" && (
                <>
                    <Hash className='w-6 h-5 mr-1' />
                </>
            )}
            {type === "conversation" && (
                <>
                    <UserAvatar src={imageUrl} className='w-6 h-6 mr-2' />
                </>
            )}
            <p className='font-semibold text-md'>{name}</p>
            <div className='ml-auto flex items-center'>
                {type === "conversation" && (
                    <ChatVideoButton />
                )}
                <SocketIndicator />
            </div>
        </div>
    )
}

export default ChatHeader