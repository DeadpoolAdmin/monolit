import { useGenerateUrl } from '@hotel-smarters/generatefileurl'
import React, { useCallback, useEffect } from 'react'
import { IChannels } from '../../types/channels.interface';
import ResizeImage from '@/shared/components/ResizeImage/ResizeImage';

import not_found from '@assets/smarters.png'
import { useOnTransformImage } from '../../hooks/useOnTransformImage';
import { useSelector } from 'react-redux';
import { useLazyGetChannelUrlsQuery } from '@/services/Media/Backend/MediaApi';

const ChannelItem = ({ style, item, isActive, onClick }: {
    style: React.CSSProperties,
    item: IChannels,
    isActive: boolean,
    onClick: () => void
}) => {
    const { getUrl } = useGenerateUrl(process.env.REACT_APP_API_HOST!);


    useOnTransformImage();

    const selectedChannel = useSelector((state: any) => state.selectedChannel.selectedChannel);


    return (
        <div onClick={onClick} style={style} className={`channels__item ${isActive ? 'active' : ''} ${selectedChannel?.id === item.id ? 'selected' : ''}`}>
            <div className='channels__item_icon'>
                <ResizeImage successCb={() => { }} errorCb={() => { }} src={item.icon.includes('https') || item.icon.includes('http') ? item.icon : getUrl(item.icon)} width={5} height={5} alt="channel" placeholder={not_found} quality={0.5} />
            </div>

            <div className='divider'></div>

            <div className='channels__item_name'>
                <span>{item.name}</span>
            </div>
        </div>
    )
}

export default ChannelItem