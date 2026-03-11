import { CurrentProfile } from "@/lib/current-profile";
import { prisma } from "@repo/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ serverId: string }> },
) {
    try {
        const { serverId } = await params;
        const profile = await CurrentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!serverId) {
            return new NextResponse("Server ID is missing", { status: 400 });
        }

        // Verify the user is the admin of the server
        const server = await prisma.server.findFirst({
            where: {
                id: serverId,
                profileId: profile.id,
            },
        });

        if (!server) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Generate new invite code
        const newInviteCode = uuidv4();

        // Update the server with new invite code
        const updatedServer = await prisma.server.update({
            where: {
                id: serverId,
            },
            data: {
                inviteCode: newInviteCode,
            },
        });

        return NextResponse.json({
            inviteCode: updatedServer.inviteCode,
            message: "Invite code regenerated successfully",
        });
    } catch (error) {
        console.error("Error regenerating invite code:", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
