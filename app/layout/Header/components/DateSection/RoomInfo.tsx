import React from 'react';

interface RoomInfoProps {
    roomNumber: string | null;
}

import { BsDoorOpenFill } from "react-icons/bs";


const RoomInfo: React.FC<RoomInfoProps> = ({ roomNumber }) => {
    if (!roomNumber) return null;

    return (
        <div className="room">
            <div className="room__icon">
                <BsDoorOpenFill style={{
                    fontSize: '3.7rem',
                }} color='var(--paragraph-text-color)' />
            </div>
            <div className="room__nuumber">{roomNumber}</div>
        </div>
    );
};

export default RoomInfo;
