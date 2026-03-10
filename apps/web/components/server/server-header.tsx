"use client";
import { MemberRole } from "@repo/db";
import { ServerWithMembersWithProfile } from "@/types/types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
    ChevronDown,
    X,
    UserPlus,
    Settings,
    Users,
    LogOut,
    PlusCircle,
    Trash,
} from "lucide-react";
import { useModal } from "@/hooks/use-mode-store";

const ServerHeader = ({
    server,
    role,
}: {
    server: ServerWithMembersWithProfile;
    role?: MemberRole;
}) => {
    const isAdmin = role === MemberRole.ADMIN;
    const isModerator = isAdmin || role === MemberRole.MODERATOR;
    const { onOpen } = useModal();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none" asChild>
                <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-b border-primary/10 group bg-secondary hover:bg-secondary/10 cursor-pointer">
                    <span className="truncate">{server.name}</span>
                    <ChevronDown className="h-5 w-5 ml-auto transition-transform group-hover:rotate-180 md:group-data-[state=open]:hidden" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-0.5">
                {isModerator && (
                    <DropdownMenuItem
                        onClick={() => onOpen("invite", { server })}
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-accent"
                    >
                        Invite People
                        <UserPlus className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => onOpen("editServer", { server })}
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-accent"
                    >
                        Server Settings
                        <Settings className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => onOpen("members", { server })}
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-accent"
                    >
                        Manage Members
                        <Users className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isModerator && (
                    <DropdownMenuItem
                        onClick={() => onOpen("createChannel")}
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-accent"
                    >
                        Create New Channel
                        <PlusCircle className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isModerator && (
                    <DropdownMenuItem
                        onClick={() => onOpen("update-ai-info")}
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-accent"
                    >
                        Update AI Information
                        <PlusCircle className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isModerator && <DropdownMenuSeparator />}
                {isAdmin && (
                    <DropdownMenuItem
                        variant="destructive"
                        className="px-3 py-2 text-sm cursor-pointer"
                        onClick={() => onOpen("deleteServer", { server })}
                    >
                        Delete Server
                        <Trash className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {!isAdmin && (
                    <DropdownMenuItem
                        variant="destructive"
                        className="px-3 py-2 text-sm cursor-pointer"
                        onClick={() => onOpen("leaveServer", { server })}
                    >
                        Leave Server
                        <LogOut className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ServerHeader;
