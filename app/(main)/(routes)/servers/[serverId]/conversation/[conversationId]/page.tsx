import ChatHeader from '@/components/chat/chat-header';
import ChatInput from '@/components/chat/chat-input';
import ChatMessages from '@/components/chat/chat-messages';
import { MediaRoom } from '@/components/media-client';
import { getOrCreateConversation } from '@/lib/conversation';
import { CurrentProfile } from '@/lib/current-profile'
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

interface ConversationPageProps {
    params: Promise<{ conversationId: string, serverId: string }>;
    searchParams: Promise<{ video?: boolean }>;
}

const ConversationPage = async (props: ConversationPageProps) => {
    const params = await props.params;
    const searchParams = await props.searchParams;

    const profile = await CurrentProfile();
    if (!profile) {
        redirect("/sign-in")
    }
    const { serverId, conversationId } = params;
    const currentMember = await prisma.member.findFirst({
        where: {
            serverId: serverId,
            profileId: profile.id
        },
        include: {
            profile: true
        }
    })
    if (!currentMember) {
        return redirect(`/servers/${serverId}`)
    }
    const conversation = await getOrCreateConversation(currentMember.id, conversationId)
    if (!conversation) {
        return redirect(`/servers/${serverId}`)
    }
    const { memberOne, memberTwo } = conversation;
    const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne

    return (
        <div className='flex flex-col h-screen'>
            <ChatHeader
                imageUrl={otherMember.profile.imageUrl}
                name={otherMember.profile.name}
                serverId={serverId}
                type='conversation'
            />

            {searchParams.video && (
                <MediaRoom chatId={conversation.id}
                    video={true}
                    audio={true}
                />
            )}

            {!searchParams.video && (
                <>
                    <div className='flex-1 overflow-y-auto'>
                        <ChatMessages
                            member={currentMember}
                            name={otherMember.profile.name}
                            chatId={conversation.id}
                            type="conversation"
                            apiUrl="/api/direct-messages"
                            paramKey="conversationId"
                            paramValue={conversation.id}
                            socketUrl="/api/socket/direct-messages"
                            socketQuery={{ conversationId: conversation.id }}
                        />
                    </div>

                    <div className='border-t bg-secondary p-4'>
                        <ChatInput
                            name={otherMember.profile.name}
                            type={"conversation"}
                            apiUrl={"/api/socket/direct-messages"}
                            query={{
                                conversationId: conversation.id
                            }}
                        />
                    </div>
                </>
            )}
        </div>
    )
}

export default ConversationPage