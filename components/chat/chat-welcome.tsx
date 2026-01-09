"use client"

import { Hash, User } from 'lucide-react'

const ChatWelcome = ({ type, name }: { type: "channel" | "conversation", name: string }) => {
    const isChannel = type === "channel"
    const title = isChannel ? `Welcome to #${name}` : name
    const subtitle = isChannel
        ? `This is the start of the #${name} channel. Start the conversation by sending a message.`
        : `This is the start of your conversation with #${name}.`

    return (
        <div className='flex flex-col items-center justify-center space-y-4 px-6 py-8'>
            <div className='h-20 w-20 rounded-full bg-card flex items-center justify-center shadow-sm'>
                {isChannel ? <Hash className='h-12 w-12 text-primary' /> : <User className='h-12 w-12 text-primary' />}
            </div>

            <p className='text-lg md:text-2xl font-semibold text-center'>{title}</p>

            <p className='text-sm text-neutral-500 dark:text-neutral-400 text-center max-w-md'>
                {subtitle}
            </p>

        </div>
    )
}

export default ChatWelcome