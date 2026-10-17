import { useGenerateUrl } from '@hotel-smarters/generatefileurl'
import React from 'react'
import { useSelector } from 'react-redux'
import not_found from '@/assets/smarters.png'
import { IChannels } from '../../types/channels.interface'
import Back from '@/layout/Header/components/Back/Back'
import { useResolution } from '@hotel-smarters/resolution-hook'

const BasicControl = React.forwardRef<HTMLDivElement>((props, ref) => {
    const selectedChannel = useSelector((state: any) => state.selectedChannel.selectedChannel);

    const { getUrl } = useGenerateUrl(process.env.REACT_APP_API_HOST!);

    const sidebarShow = useSelector((state: any) => state.sidebarShow.sidebarShow)

    const deviceType = useResolution().getDeviceType();

    const onClickBack = () => {
        window.dispatchEvent(new CustomEvent('showSidebar'))
    }

    return (
        <div className='control' ref={ref} style={{ display: sidebarShow ? 'none' : 'flex' }}>
            {
                deviceType === 'TABLET' && (
                    <Back isActive={false} onClick={onClickBack} style={{
                        position: 'absolute',
                        top: '-83.5rem',
                        left: '-2rem',
                    }} />
                )
            }
            
            <div className="channel__info">
                <div className="channel__info_icon">
                    <img
                        onError={(e) => { e.currentTarget.src = not_found }}
                        src={selectedChannel?.icon.includes('http') || selectedChannel?.icon.includes('https') ? selectedChannel?.icon : getUrl(selectedChannel?.icon)}
                        alt=""
                    />
                </div>

                <div className="channel__info_name">
                    <span>{(selectedChannel as IChannels)?.name}</span>
                </div>
            </div>
            <div className="channel__control">
                <div className="progress__bar"></div>
            </div>
        </div>
    )
})

BasicControl.displayName = 'BasicControl';

export default BasicControl