import { CurrentProfile } from "@/lib/current-profile";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ serverId: string }> },
) {
    try {
        const { name, imageUrl } = await req.json();
        const { serverId } = await params;
        if (!serverId) {
            return new NextResponse("server id not found", { status: 400 });
        }
        const profile = await CurrentProfile();
        if (!profile) {
            return new NextResponse("unauthorized", { status: 401 });
        }
        const server = await prisma.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            },
            data: {
                name,
                imageUrl,
            },
        });
        return NextResponse.json(server);
    } catch (error) {
        console.log("unable to update the information", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
