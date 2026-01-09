"use client"
import { Plus } from 'lucide-react'
import ActionTooltip from '../action-tooltip'
import { useModal } from '@/hooks/use-mode-store'

const NavigationAction = () => {
    const { onOpen } = useModal()

    return (
        <ActionTooltip label='Add a server' side='right' align='center'>
            <button
                onClick={() => onOpen("createServer")}
                className='group flex items-center'
                aria-label="Add a server"
            >
                <div className='flex h-12 w-12 rounded-[24px] group-hover:rounded-xl transition-all overflow-hidden items-center justify-center bg-primary-color border border-primary/10 group-hover:bg-primary-color active:scale-95'>
                    <Plus className='transition text-white' size={25} />
                </div>
            </button>
        </ActionTooltip>
    )
}

export default NavigationAction