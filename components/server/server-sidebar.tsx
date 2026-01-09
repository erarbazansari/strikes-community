import { CurrentProfile } from '@/lib/current-profile'
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ChannelType } from '@/lib/generated/prisma/enums';
import ServerHeader from './server-header';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { HashIcon, Video, Volume2 } from 'lucide-react';
import ServerSearch from './server-search';
import ServerSection from './server-section';
import ServerChannel from './server-channel';
import ServerMember from './server-member';
import { roleIconMap } from '@/constants/roleIconMap';

const iconMap = {
    [ChannelType.AUDIO]: <Volume2 className='mr-2 h-4 w-4' />,
    [ChannelType.TEXT]: <HashIcon className='mr-2 h-4 w-4' />,
    [ChannelType.VIDEO]: <Video className='mr-2 h-4 w-4' />
}

const ServerSidebar = async ({ serverId }: { serverId: string }) => {
    const profile = await CurrentProfile();
    if (!profile) {
        return redirect("/sign-in")
    }

    const server = await prisma.server.findUnique({
        where: {
            id: serverId
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc"
                }
            },
            members: {
                include: {
                    profile: true
                },
                orderBy: {
                    role: "asc"
                }
            }
        }
    })
    if (!server) {
        return redirect("/sign-in")
    }

    const userMember = await prisma.member.findFirst({
        where: {
            serverId: serverId,
            profileId: profile.id
        },
        select: {
            role: true
        }
    })


    const textChannels = server.channels.filter((channel) => channel.type === ChannelType.TEXT)
    const audioChannels = server.channels.filter((channel) => channel.type === ChannelType.AUDIO)
    const videoChannels = server.channels.filter((channel) => channel.type === ChannelType.VIDEO)
    const members = server.members.filter((user) => user.profileId !== profile.id)
    const role = server.members.find((member) => member.profileId === profile.id)?.role
    return (
        <div className='flex flex-col h-full text-primary w-full bg-secondary border-r'>
            <ServerHeader server={server} role={userMember?.role} />


            <ScrollArea className='flex px-3'>
                <div className='my-2'>
                    <ServerSearch
                        serverId={serverId}
                        data={[
                            {
                                label: "Text Channels",
                                type: "channel",
                                data: textChannels?.map((channel) => (
                                    {
                                        id: channel.id,
                                        name: channel.name,
                                        icon: iconMap[channel.type]
                                    }
                                ))
                            },
                            {
                                label: "Voice Channels",
                                type: "channel",
                                data: audioChannels?.map((channel) => (
                                    {
                                        id: channel.id,
                                        name: channel.name,
                                        icon: iconMap[channel.type]
                                    }
                                ))
                            }
                            ,
                            {
                                label: "Video Channels",
                                type: "channel",
                                data: videoChannels?.map((channel) => (
                                    {
                                        id: channel.id,
                                        name: channel.name,
                                        icon: iconMap[channel.type]
                                    }
                                ))
                            },
                            {
                                label: "Members",
                                type: "member",
                                data: server.members?.map((member) => ({
                                    id: member.id,
                                    name: member.profile.name,
                                    icon: roleIconMap[member.role]
                                }))
                            }
                        ]}
                    />
                </div>
                <Separator />

                <div className='mt-2'>
                    {textChannels.length > 0 && (
                        <>
                            <ServerSection
                                sectionType='channels'
                                channelType={ChannelType.TEXT}
                                role={role}
                                label='Text Channels'
                            />
                            {textChannels.map((channel) => (
                                <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
                            ))}
                        </>
                    )}
                </div>
                <div className='mt-2'>
                    {audioChannels.length > 0 && (
                        <>
                            <ServerSection
                                sectionType='channels'
                                channelType={ChannelType.AUDIO}
                                role={role}
                                label='Audio Channels'
                            />
                            {audioChannels.map((channel) => (
                                <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
                            ))}
                        </>
                    )}
                </div>
                <div className='mt-2'>
                    {videoChannels.length > 0 && (
                        <>
                            <ServerSection
                                sectionType='channels'
                                channelType={ChannelType.VIDEO}
                                role={role}
                                label='Video Channels'
                            />
                            {videoChannels.map((channel) => (
                                <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
                            ))}
                        </>
                    )}
                </div>

                <div className='mt-2'>
                    {!!members && members.length > 0 && (
                        <>
                            <ServerSection
                                sectionType='members'
                                role={role}
                                label='Members'
                                server={server}
                            />
                            {members.map((member) => (
                                <ServerMember key={member.id} server={server} member={member} />
                            ))}
                        </>
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}

export default ServerSidebar