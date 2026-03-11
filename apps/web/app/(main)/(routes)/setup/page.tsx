import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";
import { prisma } from "@repo/db";
import InitialModal from "@/components/modals/initial-modal";

const Setup = async () => {
    const profile = await initialProfile();

    // Optimized: Query Member table directly and only fetch serverId
    // This is much faster than the nested query on Server
    const member = await prisma.member.findFirst({
        where: {
            profileId: profile.id,
        },
        select: {
            serverId: true,
        },
    });

    if (member) {
        return redirect(`/servers/${member.serverId}`);
    }

    return <InitialModal />;
};
export default Setup;
