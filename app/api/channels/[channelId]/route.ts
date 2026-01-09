import { CurrentProfile } from "@/lib/current-profile";
import { MemberRole } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ channelId: string }> },
) {
    try {
        const profile = await CurrentProfile();
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId") as string;
        const { channelId } = await params;
        if (!profile) {
            return new NextResponse("unauthenticated", { status: 400 });
        }
        if (!searchParams) {
            return new NextResponse("unable to get server id", { status: 401 });
        }
        if (!channelId) {
            return new NextResponse("unable to get channelId", { status: 401 });
        }

        const server = await prisma.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                        },
                    },
                },
            },
            data: {
                channels: {
                    delete: {
                        id: channelId,
                        name: {
                            not: "general",
                        },
                    },
                },
            },
        });
        return NextResponse.json(server);
    } catch (error) {
        console.log("unable to delete server", error);
        return new NextResponse("internal server error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ channelId: string }> },
) {
    try {
        const profile = await CurrentProfile();
        const { name, type } = await req.json();
        const { searchParams } = new URL(req.url);
        const { channelId } = await params;

        const serverId = searchParams.get("serverId");
        if (!profile) return new NextResponse("unauthorized", { status: 401 });
        if (!serverId)
            return new NextResponse("serverId is missing", { status: 400 });
        if (name === "general") {
            return new NextResponse("channel name cannot be general", {
                status: 401,
            });
        }
        const server = await prisma.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                        },
                    },
                },
            },
            data: {
                channels: {
                    update: {
                        where: {
                            id: channelId,
                            NOT: {
                                name: "genera",
                            },
                        },
                        data: {
                            name,
                            type,
                        },
                    },
                },
            },
        });
        return NextResponse.json(server);
    } catch (error) {
        console.log("CHANNEL_CREATE", error);
        return new NextResponse("internal server error", { status: 500 });
    }
}
