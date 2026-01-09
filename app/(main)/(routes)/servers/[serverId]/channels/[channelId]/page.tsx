import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-client";
import { CurrentProfile } from "@/lib/current-profile";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const ChannelPage = async ({ params }: { params: Promise<{ channelId: string, serverId: string }> }) => {
  const { channelId, serverId } = await params;
  const profile = await CurrentProfile()
  if (!profile) {
    redirect("/sign-in")
  }

  const channel = await prisma.channel.findUnique({
    where: {
      id: channelId
    }
  })

  const member = await prisma.member.findFirst({
    where: {
      serverId: serverId,
      profileId: profile.id
    }
  })
  if (!channel || !member) {
    redirect("/")
  }


  return (
    <div className="flex flex-col h-screen">
      <ChatHeader name={channel.name} serverId={channel.serverId} type="channel" />
      {channel.type === "TEXT" && (
        <>
          <div className='flex-1 overflow-y-auto'>

            <ChatMessages
              member={member}
              chatId={channelId}
              name={channel.name}
              type="channel"
              apiUrl="/api/messages"
              socketUrl="/api/socket/messages"
              socketQuery={{ channelId: channelId, serverId: serverId }}
              paramKey="channelId"
              paramValue={channelId}
            />
          </div>
          <div className='border-t bg-secondary p-4'>
            <ChatInput
              name={channel.name}
              type={"channel"}
              apiUrl={"/api/socket/messages"}
              query={{
                channelId: channel.id,
                serverId: serverId
              }}
            />
          </div>
        </>
      )}

      {
        channel.type === "AUDIO" && (
          <MediaRoom
            chatId={channel.id}
            video={false}
            audio={true}
          />
        )
      }
      {
        channel.type === "VIDEO" && (
          <MediaRoom
            chatId={channel.id}
            video={true}
            audio={true}
          />
        )
      }
    </div>
  )
}

export default ChannelPage