import { useResolution } from '@hotel-smarters/resolution-hook'
import React, { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ListView } from 'smarters-ino-ui-tv'
import 'smarters-ino-ui-tv/dist/main.css'
import { IChannels, IXtreamChannels } from '../../types/channels.interface'
import { setSelectedChannel } from '@/slices/LiveTV/selectedChannel'
import { TABS } from '../../types/livetv.tabs'
import { setRootControl } from '@/slices/RootControlSlice'
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL'
import ChannelItem from './ChannelItem'
import ScrollView from '@/shared/components/ScrollView/ScrollView'


const ListStyles = {
    width: 63,
    height: 15,
    gap: 3
}

const Channels = ({ channels, onBack, activeIndex, setActiveIndex }: { channels: IChannels[] | IXtreamChannels[], onBack?: () => void, activeIndex?: number, setActiveIndex?: (index: number) => void }) => {
    const dispatch = useDispatch()

    const { getDeviceType } = useResolution()

    const deviceType = getDeviceType()

    const chosenChannel = useSelector((state: any) => state.selectedChannel.selectedChannel);

    const activeTab = useSelector((state: any) => state.liveTvTabs.selectedTab)


    const rootControl = useSelector((state: any) => state.rootControl.rootControl)

    const chooseChannel = useCallback((item: IChannels) => {
        dispatch(setSelectedChannel(item));
    }, [dispatch]);

    // Memoize callback functions to prevent unnecessary re-renders
    const handleUp = useCallback(() => {
        if (activeTab === TABS.SEARCH) {
            dispatch(setRootControl(ROOT_CONTROL.LIVETV_SEARCH))
            return
        }
        dispatch(setRootControl(ROOT_CONTROL.LIVETV_HEADER))
    }, [dispatch, activeTab]);

    const handleOk = useCallback((item: IChannels | IXtreamChannels) => {
        // Check if this is the selected channel (handle case where chosenChannel might be null initially)
        const isCurrentlySelected = chosenChannel
            ? (chosenChannel as IChannels)?.id === item.id
            : channels.length > 0 && channels[0].id === item.id;

        if (isCurrentlySelected) {
            window.dispatchEvent(new CustomEvent('hideSidebar'))
            dispatch(setRootControl(ROOT_CONTROL.LIVETV_PLAYER))
            return
        }

        chooseChannel(item as IChannels);
    }, [chooseChannel, chosenChannel, channels]);

    const handleLeft = useCallback(() => {
        if (onBack) {
            onBack();
        }
    }, [onBack]);

    const handleRight = useCallback(() => { }, []);

    // Memoize renderItem to prevent unnecessary re-renders
    const renderItem = useCallback(({ style, item, isActive, key }: any) => {
        // If no channel is selected yet, select the first channel (index 0)

        return (
            <ChannelItem
                style={style}
                item={item}
                isActive={isActive}
                key={key}
                onClick={() => handleOk(item)}
            />
        )
    }, [chosenChannel, channels]);

    // Memoize ListView props object
    const listViewProps = useMemo(() => ({
        data: channels,
        isActive: rootControl === ROOT_CONTROL.LIVETV_CONTENT,
        id: "live-tv-channels",
        uniqueKey: "live-tv-channels",
        listType: 'vertical' as const,
        nativeControle: true,
        itemsCount: 6,
        itemsTotal: channels.length,
        buffer: 5,
        itemWidth: ListStyles.width,
        itemHeight: ListStyles.height,
        initialActiveIndex: 0,
        onBackScrollIndex: null,
        startScrollIndex: 0,
        direction: "ltr" as const,
        onBack,
        gap: 5,
        rowGap: 5,
        onUp: handleUp,
        onOk: handleOk,
        onLeft: handleLeft,
        onRight: handleRight,
        renderItem: renderItem,
    }), [channels, rootControl, handleUp, handleOk, handleLeft, handleRight, renderItem, activeIndex]);

    return deviceType === 'TV' ? (
        <ListView {...listViewProps} onIndexChange={(index) => setActiveIndex?.(index)} activeIndex={activeIndex} />
    ) : (
        <ScrollView
          data={channels as IChannels[]}
          width={100}
          style={{
            height: '90%'
          }}
          dimension={"rem"}
          listType={"grid"}
          type={"gird-movies"}
          renderItem={({ style, item, isActive, key }) => {
            return (
              <ChannelItem
                style={{...style, width: ListStyles.width + 'rem', height: ListStyles.height + 'rem', margin: '1rem 0'}}
                item={item}
                isActive={isActive}
                key={key}
                onClick={() => handleOk(item)}
              />
            )
          }}
        />
    );
}

export default React.memo(Channels)