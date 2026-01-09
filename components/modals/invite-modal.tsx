"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useModal } from '@/hooks/use-mode-store'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'
import { useOrigin } from '@/hooks/use-origin'

const InviteModal = () => {
    const { isOpen, onClose, type, data } = useModal()
    const origin = useOrigin();

    const inviteLink = origin + "/invite/" + data.server?.inviteCode as string;
    const isModalOpen = isOpen && type == "invite"

    const copyInviteCode = () => {
        navigator.clipboard.writeText(inviteLink)
        toast.success("Invite link copied!")
    }
    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-background text-foreground p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">Invite User</DialogTitle>
                    <DialogDescription className="text-center text-muted-foreground">
                        You can invite different users by using the below information.
                    </DialogDescription>
                </DialogHeader>
                <div className='p-6'>
                    <Label>Server Invite Link</Label>
                    <div className=' flex items-center mt-2 gap-x-2'>
                        <Input
                            readOnly
                            className='focus-visible:ring-0 focus-visible:ring-offset-0'
                            value={inviteLink}
                        />
                        <Button size={'icon'} onClick={copyInviteCode}><Copy size="w-4 h-4" /></Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default InviteModal