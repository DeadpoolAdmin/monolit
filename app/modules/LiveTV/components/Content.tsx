import React, { useMemo, useCallback, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { IChannels, IXtreamChannels } from '../types/channels.interface'
import ICategories from '../types/categories.interface'
import { clearSelectedCategory } from '@/slices/LiveTV/selectedCategory'
import { TABS } from '../types/livetv.tabs'
import Channels from './Channels/Channels'
import Categories from './Categories/Categories'
import Search from './Search/Search'


const Content = React.memo(({ channels, categories }: { channels: IChannels[] | IXtreamChannels[], categories: ICategories[] }) => {
    const dispatch = useDispatch()
    const activeTab = useSelector((state: any) => state.liveTvTabs.selectedTab)
    const selectedCategory = useSelector((state: any) => state.selectedCategory.selectedCategory)

    const navigate = useNavigate();

    const [activeIndex, setActiveIndex] = useState(0);

    // Filter channels by selected category when a category is selected
    const filteredChannels = useMemo((): IChannels[] | IXtreamChannels[] => {
        if (!selectedCategory || !selectedCategory.category_id) {
            return channels
        }

        return channels.filter((channel: IChannels | IXtreamChannels) =>
            channel.category_id === selectedCategory.category_id
        ) as IChannels[] | IXtreamChannels[]
    }, [channels, selectedCategory])

    // Handle back navigation from category channels to categories list
    const handleBackToCategories = useCallback(() => {
        dispatch(clearSelectedCategory())
    }, [dispatch])

    const handleBackToChannels = useCallback(() => {
        if (activeIndex === 0) {

            if(window.Android) {
                window.Android.destroyPlayer();
            }

            navigate('/menu');

        } else {
            setActiveIndex(0);
        }
    }, [activeIndex])

    return (
        <div className='sidebar__content'>
            {
                activeTab === TABS.CHANNELS ? (
                    <Channels activeIndex={activeIndex} setActiveIndex={setActiveIndex} onBack={handleBackToChannels} channels={channels} />
                )
                    :
                    activeTab === TABS.CATEGORIES ? (
                        // Show channels for selected category, or categories list
                        selectedCategory ? (
                            <Channels channels={filteredChannels} onBack={handleBackToCategories} />
                        ) : (
                            <Categories categories={categories as ICategories[]} />
                        )
                    )
                        :
                        activeTab === TABS.SEARCH && (
                            <Search onBack={handleBackToChannels} activeIndex={activeIndex} setActiveIndex={setActiveIndex} channels={channels} />
                        )
            }
        </div>
    )
})

export default Content