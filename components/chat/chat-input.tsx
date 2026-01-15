"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from "zod"
import { Form, FormControl, FormField, FormItem } from '../ui/form'
import { Plus, Send, Loader2 } from 'lucide-react'
import qs from "query-string"
import axios from 'axios'
import { useModal } from '@/hooks/use-mode-store'
import EmojiPicker from '../emoji-picker'

interface ChatInputProps {
    apiUrl: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: Record<string, any>,
    name: string,
    type: "conversation" | "channel"
}

const formSchema = z.object({
    content: z.string().min(1)
})

const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
    const { onOpen } = useModal()
    const form = useForm<z.infer<typeof formSchema>>(
        {
            resolver: zodResolver(formSchema),
            defaultValues: {
                content: ""
            }
        }
    )
    const isLoading = form.formState.isSubmitting

    const onSubmit = async (value: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl,
                query,
            })
            const response = await axios.post(url, value)
            if (response) {
                form.reset()
            }
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
                <FormField control={form.control} name='content' render={({ field }) => (
                    <FormItem className='w-full'>
                        <FormControl>
                            <div className='relative flex items-center gap-2 w-full'>
                                <button type='button' className='h-10 w-10 rounded-md bg-card flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition border' onClick={() => onOpen("messageFile", { apiUrl, query })}>
                                    <Plus className='text-zinc-500 dark:text-zinc-400' />
                                </button>
                                <input type="text" className='bg-card p-2 rounded-md h-10 w-full text-zinc-600 dark:text-zinc-200 border' placeholder={`Message ${type === "conversation" ? name : "#" + name}`} {...field} disabled={isLoading} autoComplete="off" />
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className='absolute h-8 w-8 right-13 flex items-center justify-center rounded-md cursor-pointer hover:bg-zinc-300/10 transition text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300'
                                >
                                    {isLoading ? (
                                        <Loader2 className='h-5 w-5 animate-spin' />
                                    ) : (
                                        <Send className='h-5 w-5' />
                                    )}
                                </button>
                                <EmojiPicker onChange={(emoji: string) => field.onChange(`${field.value} ${emoji}`)} />
                            </div>
                        </FormControl>
                    </FormItem>
                )} />
            </form>
        </Form>
    )
}

export default ChatInput