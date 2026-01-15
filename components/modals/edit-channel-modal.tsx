"use client"

import { useForm } from 'react-hook-form'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import qs from "query-string"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Spinner } from '../ui/spinner'
import { useModal } from '@/hooks/use-mode-store'
import { ChannelType } from '@/lib/generated/prisma/enums'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { useEffect } from 'react'


const formSchema = z.object({
    name: z.string().min(1, { message: "Channel name is required" }).refine(name => name.toLowerCase() !== "general", {
        message: "Channel name cannot be 'general'"
    }),
    type: z.nativeEnum(ChannelType)
})


const EditChannelModal = () => {
    const router = useRouter()

    const { isOpen, onClose, type, data } = useModal()
    const { channel, server } = data;

    const isModalOpen = isOpen && type == "editChannel"

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: channel?.type || ChannelType.TEXT
        }
    })
    const loading = form.formState.isSubmitting;

    useEffect(() => {
        if (channel && channel.name && channel.type) {
            form.setValue("name", channel.name)
            form.setValue("type", channel.type)
        }
    }, [form, channel])

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const loadingId = toast.loading("Updating channel...")
        try {
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id
                }
            })
            await axios.patch(url, values)
            form.reset();
            onClose();
            toast.success("Channel updated successfully!", {
                id: loadingId
            })
            router.refresh()
        } catch (error) {
            console.log("unable to update channel", error)
            toast.error("Something went wrong. Please try again.", {
                id: loadingId
            })
        }
    }

    const handleClose = () => {
        form.reset();
        onClose()
    }
    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-background text-foreground p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">Edit channel</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            className="uppercase text-xs font-bold text-muted-foreground"
                                        >
                                            Channel name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                className="bg-secondary/50 border-0 focus-visible:ring-0 text-foreground focus-visible:ring-offset-0"
                                                placeholder="Enter channel name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='type'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Channel Type</FormLabel>
                                        <Select
                                            disabled={loading}
                                            value={field.value}
                                            onValueChange={(val) => field.onChange(val)}
                                        >
                                            <FormControl>
                                                <SelectTrigger className='border-0 focus:ring-0 ring-offset-0 focus:ring-offset-0 capitalize outline-none'>
                                                    <SelectValue placeholder={"Select channel type"} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(ChannelType).map((t) => (
                                                    <SelectItem key={t} value={t} className='capitalize'>{t.toLowerCase()}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="bg-muted/50 px-6 py-4">
                            <Button disabled={loading} variant="primary">
                                {loading ? <Spinner /> : "Update"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default EditChannelModal