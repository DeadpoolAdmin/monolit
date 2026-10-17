import React from 'react'
import Channels from '../Channels/Channels'
import { IChannels, IXtreamChannels } from '../../types/channels.interface'

const FilteredChannels = ({ channels, onBack, activeIndex, setActiveIndex }: { channels: IChannels[] | IXtreamChannels[], onBack?: () => void, activeIndex?: number, setActiveIndex?: (index: number) => void }) => {
    return (
        <div className='filtered__channels'>
            <Channels channels={channels} onBack={onBack} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
        </div>
    )
}

export default FilteredChannels