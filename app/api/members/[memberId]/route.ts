import { CurrentProfile } from "@/lib/current-profile";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ memberId: string }> },
) {
    try {
        const profile = await CurrentProfile();
        const { memberId } = await params;
        const { searchParams } = new URL(req.url);
        const { role } = await req.json();
        const serverId = searchParams.get("serverId");

        if (!profile) {
            return new NextResponse("unauthorize", { status: 401 });
        }
        if (!serverId) {
            return new NextResponse("server id is missing", { status: 400 });
        }
        const sid = serverId as string;
        if (!memberId) {
            return new NextResponse("member id is missing", { status: 400 });
        }
        // Ensure the server belongs to the current profile (owner)
        const serverRecord = await prisma.server.findUnique({
            where: { id: sid },
            select: { id: true, profileId: true },
        });

        if (!serverRecord || serverRecord.profileId !== profile.id) {
            return new NextResponse("unauthorized", { status: 401 });
        }

        // Update the member's role but prevent changing the requester's own role
        await prisma.member.updateMany({
            where: {
                id: memberId,
                serverId: sid,
                profileId: { not: profile.id },
            },
            data: {
                role,
            },
        });

        // Return the server with updated members
        const server = await prisma.server.findUnique({
            where: { id: sid },
            include: {
                members: {
                    include: { profile: true },
                    orderBy: { role: "asc" },
                },
            },
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("unable to update user role", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ memberId: string }> },
) {
    try {
        const { memberId } = await params;
        const profile = await CurrentProfile();
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");

        if (!serverId)
            return new NextResponse("server id is missing", { status: 400 });

        const sid = serverId as string;

        if (!profile) {
            return new NextResponse("unauthorize", { status: 401 });
        }

        if (!memberId)
            return new NextResponse("member id required", { status: 400 });

        // Ensure the requester owns the server
        const serverRecord = await prisma.server.findUnique({
            where: { id: sid },
            select: { id: true, profileId: true },
        });

        if (!serverRecord)
            return new NextResponse("server not found", { status: 404 });
        if (serverRecord.profileId !== profile.id)
            return new NextResponse("forbidden", { status: 403 });

        // Delete the member (but prevent deleting the owner's own membership)
        await prisma.member.deleteMany({
            where: {
                id: memberId,
                serverId: sid,
                profileId: { not: profile.id },
            },
        });

        const server = await prisma.server.findUnique({
            where: { id: sid },
            include: {
                members: {
                    include: { profile: true },
                    orderBy: { role: "asc" },
                },
            },
        });

        return NextResponse.json(server);
    } catch (error) {
        console.error("MEMBER_ID_DELETE", error);
        return new NextResponse("internal server error", { status: 500 });
    }
}
