import React, { useRef, useState, useMemo, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { IChannels, IXtreamChannels } from '../../types/channels.interface'
import { useInputControl } from '../../hooks/useInputControl'
import Input from '../Input/Input'
import FilteredChannels from '../FilteredChannels/FilteredChannels'
import { Keyboard } from '@/shared/components/Keyboard/Keyboard'
import { setRootControl } from '@/slices/RootControlSlice'
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL'

const Search = React.memo(({ channels, onBack, activeIndex, setActiveIndex }: { channels: IChannels[] | IXtreamChannels[], onBack?: () => void, activeIndex?: number, setActiveIndex?: (index: number) => void }) => {
    const [search, setSearch] = useState('')

    const [isOpen, setIsOpen] = useState(false)

    const inputRef = useRef<HTMLInputElement>(null)

    const { onClickInput } = useInputControl(inputRef.current!, isOpen, setIsOpen);

    const dispatch = useDispatch();

    // Listen for closeKeyboard event from promotion
    useEffect(() => {
        const handleCloseKeyboard = () => {
            setIsOpen(false);
        };

        window.addEventListener('closeKeyboard', handleCloseKeyboard);

        return () => {
            window.removeEventListener('closeKeyboard', handleCloseKeyboard);
        };
    }, []);

    // Filter channels based on search term
    const filteredChannels = useMemo((): IChannels[] | IXtreamChannels[] => {
        if (!search.trim()) {
            return channels
        }

        return channels.filter((channel: IChannels | IXtreamChannels) =>
            channel.name?.toLowerCase().includes(search.toLowerCase())
        ) as IChannels[] | IXtreamChannels[]
    }, [channels, search])

    return (
        <div className='livetv__search'>
            <Input onClickInput={onClickInput} ref={inputRef} value={search} onChange={setSearch} />
            <FilteredChannels onBack={onBack} activeIndex={activeIndex} setActiveIndex={setActiveIndex} channels={filteredChannels} />
            <Keyboard
                isOpen={isOpen}
                onClose={() => { setIsOpen(false); dispatch(setRootControl(ROOT_CONTROL.LIVETV_SEARCH)); window.keyboard_open = false; }}
                value={search}
                onChange={setSearch}
            />
        </div>
    )
})

export default Search