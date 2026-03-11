"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-mode-store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useOrigin } from "@/hooks/use-origin";
import { useState, useEffect } from "react";
import axios from "axios";

const InviteModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const [inviteCode, setInviteCode] = useState("");
    const [regenerating, setRegenerating] = useState(false);
    const origin = useOrigin();

    // Sync inviteCode state when modal opens or server data changes
    useEffect(() => {
        if (isOpen && data.server?.inviteCode) {
            setInviteCode(data.server.inviteCode);
        }
    }, [isOpen, data.server?.inviteCode]);

    const inviteLink = (origin +
        "/invite/" +
        inviteCode) as string;
    const isModalOpen = isOpen && type == "invite";

    const copyInviteCode = () => {
        navigator.clipboard.writeText(inviteLink);
        toast.success("Invite link copied!");
    };

    const onRegenerateInviteCode = async () => {
        try {
            setRegenerating(true);
            const response = await axios.patch(
                `/api/servers/${data.server?.id}/invite`,
            );
            setInviteCode(response.data.inviteCode);
            toast.success("Invite link regenerated successfully!");
        } catch (error) {
            console.error("Failed to regenerate invite code:", error);
            toast.error("Failed to regenerate invite code. Please try again.");
        } finally {
            setRegenerating(false);
        }
    };
    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-background text-foreground p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Invite User
                    </DialogTitle>
                    <DialogDescription className="text-center text-muted-foreground">
                        You can invite different users by using the below
                        information.
                    </DialogDescription>
                </DialogHeader>
                <div className="p-6">
                    <Label>Server Invite Link</Label>
                    <div className=" flex items-center mt-2 gap-x-2">
                        <Input
                            readOnly
                            className="focus-visible:ring-0 focus-visible:ring-offset-0"
                            value={inviteLink}
                        />
                        <Button size={"icon"} onClick={copyInviteCode}>
                            <Copy size="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="flex gap-1.5 items-center mt-1">
                        <p
                            onClick={onRegenerateInviteCode}
                            className="text-xs text-zinc-500 underline hover:text-zinc-600 dark:hover:text-zinc-400 hover:cursor-pointer"
                        >
                            Regenerate New
                        </p>
                        {regenerating && (
                            <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InviteModal;
