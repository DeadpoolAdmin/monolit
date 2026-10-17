import React, { useRef } from 'react'
import ICategories from '../types/categories.interface';
import { IChannels, IXtreamChannels } from '../types/channels.interface';
import { useOnSidebar } from '../hooks/useOnSidebar';
import { useChooseChannel } from '../hooks/useChooseChannel';
import Header from './Header';
import Content from './Content';


const Sidebar = React.memo(({ categories, channels }: { categories: ICategories[], channels: IChannels[] | IXtreamChannels[] }) => {
    const sidebarRef = useRef<HTMLDivElement>(null)

    useOnSidebar(sidebarRef)

    // Auto-select first channel when channels are loaded
    useChooseChannel(channels);

    return (
        <div className='sidebar' ref={sidebarRef}>
            <Header />
            <Content categories={categories} channels={channels} />
        </div>
    )
})

export default Sidebar