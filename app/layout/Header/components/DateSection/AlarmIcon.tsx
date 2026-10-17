import React from 'react';
import { IoAlarmOutline } from 'react-icons/io5';

interface AlarmIconProps {
    showAlarmIcon: boolean;
}

const AlarmIcon: React.FC<AlarmIconProps> = ({ showAlarmIcon }) => {
    if (!showAlarmIcon) return null;

    return (
        <div
            className="alarm__days"
            style={{
                fontSize: '4.5rem',
                color: 'var(--paragraph-text-color)',
                marginRight: '3rem',
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
            }}
        >
            <IoAlarmOutline className="alarm__icon" />
        </div>
    );
};

export default AlarmIcon;
