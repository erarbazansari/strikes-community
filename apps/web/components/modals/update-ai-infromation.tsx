"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import qs from "query-string";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { useModal } from "@/hooks/use-mode-store";
import { useRouter } from "next/navigation";
import { ChannelType } from "@repo/db";
import { Spinner } from "../ui/spinner";
import { Zap, MessageSquare, CheckCircle2 } from "lucide-react";

const formSchema = z.object({
    channelId: z.string().min(1, { message: "Please select a channel" }),
    enableAiResponses: z.boolean().default(false),
    enableAutoModeration: z.boolean().default(false),
    enableContentAnalysis: z.boolean().default(false),
});

const UpdateAiInfo = () => {
    const router = useRouter();
    const { isOpen, onClose, type, data } = useModal();
    const { server } = data;

    const [channels, setChannels] = useState<any[]>([]);
    const [isLoadingChannels, setIsLoadingChannels] = useState(false);

    const isModalOpen = isOpen && type == "update-ai-info";

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            channelId: "",
            enableAiResponses: false,
            enableAutoModeration: false,
            enableContentAnalysis: false,
        },
    });

    const isLoading = form.formState.isSubmitting;

    useEffect(() => {
        if (isModalOpen && server?.id) {
            const fetchChannels = async () => {
                setIsLoadingChannels(true);
                try {
                    const response = await axios.get(
                        `/api/channels/${server.id}`
                    );
                    const textChannels = response.data.filter(
                        (channel: any) => channel.type === ChannelType.TEXT
                    );
                    setChannels(textChannels);
                } catch (error) {
                    console.error("Failed to fetch channels", error);
                    toast.error("Failed to load channels");
                } finally {
                    setIsLoadingChannels(false);
                }
            };
            fetchChannels();
        }
    }, [isModalOpen, server?.id]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const loadingId = toast.loading("Configuring AI settings...");
        try {
            const url = qs.stringifyUrl({
                url: `/api/channels/${values.channelId}/ai`,
                query: {
                    serverId: server?.id,
                },
            });
            await axios.patch(url, {
                enableAiResponses: values.enableAiResponses,
                enableAutoModeration: values.enableAutoModeration,
                enableContentAnalysis: values.enableContentAnalysis,
            });

            form.reset();
            onClose();
            toast.success("AI configuration updated successfully!", {
                id: loadingId,
            });
            router.refresh();
        } catch (error) {
            console.error("Failed to update AI settings", error);
            toast.error("Failed to save AI configuration. Please try again.", {
                id: loadingId,
            });
        }
    };

    const handleClose = () => {
        form.reset();
        onClose();
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-background text-foreground p-0 overflow-hidden max-w-2xl">
                <DialogHeader className="pt-8 px-6">
                    <div className="flex items-center gap-2">
                        <Zap className="w-6 h-6 text-yellow-500" />
                        <DialogTitle className="text-2xl font-bold">
                            AI Configuration
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-base mt-2">
                        Enable and customize AI features for your channels to enhance
                        communication and moderation
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div className="space-y-6 px-6">
                            {/* Channel Selection */}
                            <FormField
                                control={form.control}
                                name="channelId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-muted-foreground">
                                            Select Channel
                                        </FormLabel>
                                        <Select
                                            disabled={isLoading || isLoadingChannels}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-secondary/50 border-0 focus:ring-2 focus:ring-offset-0">
                                                    <SelectValue placeholder="Choose a text channel" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {isLoadingChannels ? (
                                                    <div className="p-3 text-sm text-muted-foreground flex items-center gap-2">
                                                        <Spinner className="w-3 h-3" />
                                                        Loading channels...
                                                    </div>
                                                ) : channels.length > 0 ? (
                                                    channels.map((channel) => (
                                                        <SelectItem
                                                            key={channel.id}
                                                            value={channel.id}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <MessageSquare className="w-4 h-4" />
                                                                {channel.name}
                                                            </div>
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <div className="p-3 text-sm text-muted-foreground">
                                                        No text channels available
                                                    </div>
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* AI Features */}
                            <div className="space-y-4 pt-4">
                                <div className="pb-4 border-b border-secondary">
                                    <h3 className="uppercase text-xs font-bold text-muted-foreground mb-4">
                                        AI Features
                                    </h3>

                                    {/* AI Responses Feature */}
                                    <FormField
                                        control={form.control}
                                        name="enableAiResponses"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors mb-3">
                                                <div className="flex flex-col gap-1">
                                                    <FormLabel className="text-sm font-semibold cursor-pointer">
                                                        AI Responses
                                                    </FormLabel>
                                                    <p className="text-xs text-muted-foreground">
                                                        Enable AI-powered responses in this channel
                                                    </p>
                                                </div>
                                                <FormControl>
                                                    <input
                                                        type="checkbox"
                                                        checked={field.value}
                                                        onChange={field.onChange}
                                                        disabled={isLoading}
                                                        className="w-4 h-4 cursor-pointer accent-blue-500"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Auto Moderation Feature */}
                                    <FormField
                                        control={form.control}
                                        name="enableAutoModeration"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors mb-3">
                                                <div className="flex flex-col gap-1">
                                                    <FormLabel className="text-sm font-semibold cursor-pointer">
                                                        Auto Moderation
                                                    </FormLabel>
                                                    <p className="text-xs text-muted-foreground">
                                                        Automatically moderate harmful content
                                                    </p>
                                                </div>
                                                <FormControl>
                                                    <input
                                                        type="checkbox"
                                                        checked={field.value}
                                                        onChange={field.onChange}
                                                        disabled={isLoading}
                                                        className="w-4 h-4 cursor-pointer accent-blue-500"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Content Analysis Feature */}
                                    <FormField
                                        control={form.control}
                                        name="enableContentAnalysis"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                                                <div className="flex flex-col gap-1">
                                                    <FormLabel className="text-sm font-semibold cursor-pointer">
                                                        Content Analysis
                                                    </FormLabel>
                                                    <p className="text-xs text-muted-foreground">
                                                        Analyze and summarize channel content
                                                    </p>
                                                </div>
                                                <FormControl>
                                                    <input
                                                        type="checkbox"
                                                        checked={field.value}
                                                        onChange={field.onChange}
                                                        disabled={isLoading}
                                                        className="w-4 h-4 cursor-pointer accent-blue-500"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Info Box */}
                            <div className="flex gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-foreground/80">
                                    AI features are powered by advanced language models. All
                                    configurations are saved per channel.
                                </p>
                            </div>
                        </div>

                        <DialogFooter className="bg-secondary/30 px-6 py-4">
                            <Button
                                variant="ghost"
                                onClick={handleClose}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled={isLoading || !form.watch("channelId")}
                                className="gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Spinner className="w-4 h-4" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Configuration"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateAiInfo;
