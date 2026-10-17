import { useResolution } from '@hotel-smarters/resolution-hook'
import React, { useEffect, useRef, useState } from 'react'
import { IMessage } from '../types/message.interface'
import { useSendMessage } from '../hooks/useSendMessage'
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL'
import { setRootControl } from '@/slices/RootControlSlice'
import { useDispatch } from 'react-redux'
import { useContentRef } from '../hooks/useContentRef'
import MessageContent from './MessageContent'
import QuickMessage from './QuickMessage'
import InputContent from './InputContent'
import { Keyboard } from '@/shared/components/Keyboard/Keyboard'
import Scrolls from './Scrolls'

const MessageBody = ({ isLoading, frontDeskMessages }: { isLoading: boolean, frontDeskMessages: IMessage[] }) => {

    // Shared state for both input and keyboard
    const [message, setMessage] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const { getDeviceType } = useResolution();
    const deviceType = getDeviceType();

    // Get sendMessage function to pass to both components
    const { sendMessage } = useSendMessage({ externalMessage: message, setExternalMessage: setMessage });

    const footerRef = useRef<HTMLDivElement>(null)
    const scrollsRef = useRef<HTMLDivElement>(null)
    const optionsRef = useRef<HTMLDivElement>(null)
    const quickMessageRef = useRef<HTMLDivElement>(null)

    const { contentRef } = useContentRef();

    const dispatch = useDispatch();


    useEffect(() => {
       dispatch(setRootControl(ROOT_CONTROL.TYPE_MESSAGE))
    }, [])

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

    useEffect(() => {
        if (footerRef.current && optionsRef.current && scrollsRef.current && contentRef.current && quickMessageRef.current) {
            // Only set KEYBOARD_OPEN when opening, let onClose handle the closing state
            if (isOpen) {
                dispatch(setRootControl(ROOT_CONTROL.CHAT_KEYBOARD_OPEN))
            }
            footerRef.current.style.top = isOpen ? '-39rem' : '0',
                optionsRef.current.style.top = isOpen ? '-35rem' : '0',
                scrollsRef.current.style.opacity = isOpen ? '0' : '1',
                contentRef.current.style.opacity = isOpen ? '0.1' : '1',
                quickMessageRef.current.style.opacity = isOpen ? '0' : '1'
        }
    }, [isOpen, footerRef, optionsRef, scrollsRef, contentRef, quickMessageRef])

    return (
        <div className='message__body' style={{
            height: deviceType === 'TV' ? 'calc(108rem - 13.8rem)' : '100%',

        }}>
            <MessageContent ref={contentRef} isLoading={isLoading} messages={frontDeskMessages} />
            <div className='message__body__options' ref={optionsRef} style={{
                position: 'relative',
                top: deviceType !== 'TV' ? '-1rem' : '0'
            }}>
                <QuickMessage ref={quickMessageRef} />
                <Scrolls ref={scrollsRef} />
            </div>
            <div className="body__footer" ref={footerRef}>
                <div className="footer__content" onClick={() => !isOpen && setIsOpen(true)}>
                    <InputContent
                        setIsOpen={setIsOpen}
                        message={message}
                        setMessage={setMessage}
                        sendMessage={sendMessage}
                    />
                    <Keyboard
                        value={message}
                        onChange={setMessage}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        onSubmit={sendMessage}
                        maxLength={1000}
                    />
                </div>
            </div>
        </div>
    )
}

export default MessageBody
