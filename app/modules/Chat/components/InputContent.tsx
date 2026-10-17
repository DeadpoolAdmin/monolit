import React, { memo, useEffect } from 'react'
import { IoSend } from 'react-icons/io5'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useContentInputControl } from '../hooks/useContentInputControl';
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL';
import { setRootControl } from '@/slices/RootControlSlice';
import { useSendButtonControl } from '../hooks/useSendButtonControl';
import { useResolution } from '@hotel-smarters/resolution-hook';
import { useTranslate } from '@/shared/hooks/languages/useI18';

interface InputContentProps {
    setIsOpen: (value: boolean) => void;
    message: string;
    setMessage: (value: string) => void;
    sendMessage: () => void;
}

const InputContent = ({ setIsOpen, message, setMessage, sendMessage }: InputContentProps) => {
    const dispatch = useDispatch();
    const rootControl = useSelector((state : any) => state.rootControl.rootControl);

    const { contentInputRef } = useContentInputControl({ setIsOpen });

    useSendButtonControl({ sendMessage, message, contentInputRef });

    const quickMessage = useSelector((state : any) => state.messagesSlice.quickMessage);

    const deviceType = useResolution().getDeviceType();

    const { t } = useTranslate();

    // Use shared message state with fallback to quick message
    const displayValue = message || quickMessage?.message || "";

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    }

    const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        // Always blur the input when it tries to focus
        e.target.blur();
    }

    const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
        // Prevent focus and blur if somehow focused
        e.preventDefault();
        if (contentInputRef.current) {
            contentInputRef.current.blur();
        }
    }

    // Ensure input is always blurred
    useEffect(() => {
        if (contentInputRef.current) {
            contentInputRef.current.blur();
        }
    }, []);

    // Blur input when message control changes
    useEffect(() => {
        if (contentInputRef.current && rootControl !== ROOT_CONTROL.TYPE_MESSAGE) {
            contentInputRef.current.blur();
        }
    }, [rootControl]);

    const handleSendButtonClick = () => {
        sendMessage();
        setIsOpen(false);
        dispatch(setRootControl(ROOT_CONTROL.CHAT_SEND));
    };

    return (
        <>
            <div className={`content__input ${deviceType === 'TV' && rootControl === ROOT_CONTROL.TYPE_MESSAGE ? 'active' : ''}`}>
                <input
                    ref={contentInputRef}
                    value={displayValue}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onClick={handleInputClick}
                    type="text"
                    placeholder={t('writeAMessage') + '...'}
                />
            </div>

            <div className={`content__send__icon ${rootControl === ROOT_CONTROL.CHAT_SEND ? 'active' : ''}`} onClick={handleSendButtonClick}>
                <IoSend />
            </div>
        </>

    )
}

export default memo(InputContent)