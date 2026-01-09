import { CurrentProfile } from "@/lib/current-profile";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ serverId: string }> },
) {
    try {
        const profile = await CurrentProfile();
        if (!profile) {
            return new NextResponse("unauthorized", { status: 400 });
        }
        const { serverId } = await params;
        if (!serverId) {
            return new NextResponse("server id is missing", { status: 401 });
        }

        const server = await prisma.server.update({
            where: {
                id: serverId,
                profileId: {
                    not: profile.id,
                },
                members: {
                    some: {
                        profileId: profile.id,
                    },
                },
            },
            data: {
                members: {
                    deleteMany: {
                        profileId: profile.id,
                    },
                },
            },
        });
        return NextResponse.json(server);
    } catch (error) {
        console.log("unable to leave server", error);
        return new NextResponse("internal server error", { status: 500 });
    }
}
