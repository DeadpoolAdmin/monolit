import React, { memo, useMemo } from 'react'
import { useResolution } from '@hotel-smarters/resolution-hook';
import { useSelector } from 'react-redux';
import { IMessage } from '../types/message.interface';
import { Load } from '@/shared/components/Loading/Loader';

const MessageContent = ({ messages, isLoading, ref }: { messages: IMessage[], isLoading: boolean, ref: React.RefObject<HTMLDivElement> }) => {

    const { getDeviceType } = useResolution();

    const isTranslated = useSelector((state : any) => state.messagesSlice.isTranslated);

    const deviceType = useMemo(() => {
        return getDeviceType() === 'TABLET' ? getDeviceType().toLowerCase() : getDeviceType();
    }, [getDeviceType])

    return (
        <div className="body__content" ref={ref} style={{
            height: deviceType === 'TV' ? '73rem' : '70%',
        }}>
            {isLoading ? (
                <Load />
            ) : (
                messages && messages.length ?
                    messages?.map((message: IMessage, key: number) => (

                        <div key={key} className={`content__message ${message?.guestId === message?.sender ? 'sender' : 'receiver'}`}>
                            <div className="message__text">
                                <span>
                                    {isTranslated && message?.translatedText ? message?.translatedText : message?.content}
                                </span>
                            </div>
                            <div className="content__timestamp">
                                <span>{new Date(message?.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                    ))

                    :
                    <></>
            )}
        </div>
    )
}

export default memo(MessageContent) 