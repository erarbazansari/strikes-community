import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@repo/db";

export const initialProfile = async () => {
    const user = await currentUser();

    if (!user) {
        return redirect("/sign-in");
    }

    // Use upsert to reduce database queries from 2 to 1
    const profile = await prisma.profile.upsert({
        where: {
            userId: user.id,
        },
        update: {},
        create: {
            userId: user.id,
            email: user.emailAddresses[0].emailAddress,
            name: `${user.firstName} ${user.lastName}`,
            imageUrl: user.imageUrl,
        },
    });

    return profile;
};
