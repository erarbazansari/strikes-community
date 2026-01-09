"use client"

import Image from "next/image"
import { useParams, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import ActionTooltip from '../action-tooltip'


interface navigationItemProps {
    id: string,
    imageUrl: string,
    name: string
}

const NavigationItems = ({ id, imageUrl, name }: navigationItemProps) => {
    const params = useParams()
    const router = useRouter()

    const onClick = () => {
        router.push(`/servers/${id}`)
    }

    return (
        <ActionTooltip side='right' align='center' label={name}>
            <button onClick={onClick} className='group relative flex items-center'>
                <div className={cn(
                    "absolute left-0 bg-primary rounded-r-full transition-all w-1",
                    params?.serverId !== id && "group-hover:h-5",
                    params?.serverId === id ? "h-9" : "h-1"
                )} />
                <div className={cn(
                    "relative group flex mx-4 h-10 w-10 rounded-[24px] group-hover:rounded-3xl transition-all overflow-hidden border border-primary/10",
                    params?.serverId === id && "bg-primary/10 text-primary rounded-3xl"
                )}>
                    <Image
                        fill
                        src={imageUrl}
                        alt="Channel"
                    />
                </div>
            </button>
        </ActionTooltip>
    )
}

export default NavigationItems