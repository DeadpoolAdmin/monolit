import React, { useEffect } from 'react'
import './styles/index.scss'
import { useChannels } from './hooks/useChannels'
import { useCategories } from './hooks/useCategroies'
import { useDispatch } from 'react-redux'
import QueryWrapper from '@/shared/components/QueryWrapper'
import { useSelector } from 'react-redux'
import Sidebar from './components/Sidebar'
import { setSelectedChannel } from '@/slices/LiveTV/selectedChannel'
import { setRootControl } from '@/slices/RootControlSlice'
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL'
import LiveTvVideoPlayer from './components/LiveTvVideoPlayer/LiveTvVideoPlayer'
import { setActiveTab } from '@/slices/LiveTV/liveTvTabs'
import { TABS } from './types/livetv.tabs'


const LiveTV = () => {

  const { channels, isLoading: channelsLoading } = useChannels()

  const { categories, isLoading: categoriesLoading } = useCategories(channels)


  const dispatch = useDispatch();

  const selectedChannel = useSelector((state: any) => state.selectedChannel.selectedChannel);

  // Initialize tab to CHANNELS when component mounts
  useEffect(() => {
    dispatch(setActiveTab(TABS.CHANNELS));
  }, [dispatch]);

  useEffect(() => {
    if (selectedChannel) {
        dispatch(setSelectedChannel(selectedChannel))
        dispatch(setRootControl(ROOT_CONTROL.LIVETV_CONTENT))
    }
}, [selectedChannel, dispatch])

  return (
    <QueryWrapper
      isLoading={channelsLoading || categoriesLoading}
      isEmpty={!channels || channels.length === 0}
    >
      <div className='livetv'>
          <Sidebar categories={categories!} channels={channels!} />
          <LiveTvVideoPlayer />
      </div>
    </QueryWrapper>
  )
}

export default LiveTV