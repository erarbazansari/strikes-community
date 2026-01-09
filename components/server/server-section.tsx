"use client"
import { ChannelType, MemberRole } from '@/lib/generated/prisma/enums';
import { ServerWithMembersWithProfile } from '@/types/types';
import ActionTooltip from '../action-tooltip';
import { Plus, Settings } from 'lucide-react';
import { useModal } from '@/hooks/use-mode-store';

interface ServerSection {
    label: string,
    role?: MemberRole,
    sectionType: "channels" | "members",
    channelType?: ChannelType,
    server?: ServerWithMembersWithProfile
}

const ServerSection = ({ label, role, sectionType, channelType, server }: ServerSection) => {
    const { onOpen } = useModal()
    return (
        <div className='flex item-center justify-between py-2'>
            <p className='text-xs uppercase font-semibold'>{label}</p>
            {role !== MemberRole.GUEST && sectionType === "channels" && (
                <ActionTooltip label='Create Channel' side='top'>
                    <button onClick={() => onOpen("createChannel", { channelType })}><Plus className='h-4 w-4' /></button>
                </ActionTooltip>
            )}
            {role == MemberRole.ADMIN && sectionType === "members" && (
                <ActionTooltip label='Manage members' side='top'>
                    <button onClick={() => onOpen("members", { server })}><Settings className='h-4 w-4' /></button>
                </ActionTooltip>
            )}
        </div>
    )
}

export default ServerSection