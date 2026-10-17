import React, { useEffect, useState } from 'react';
// import AlarmIcon from './AlarmIcon';
// import RoomInfo from './RoomInfo';
import RoomInfo from './RoomInfo';
import AlarmIcon from './AlarmIcon';
import { useAlarm } from '@/shared/hooks/useAlarm';
import DateComponent from '../DateComponent/DateComponent';
import { DATE_FORMAT_OPTIONS } from '@/shared/types/date/date';
import { useTranslate } from '@shared/hooks/languages/useI18';
import { getLocale } from '@/shared/functions/getLocale';

interface DateSectionProps {
    // showAlarmIcon: boolean;
    roomNumber: string | null;
    ref?: React.RefObject<HTMLDivElement>;
}

const DateSection: React.FC<DateSectionProps> = ({
    roomNumber,
    ref,
}) => {
    const { language } = useTranslate();
    const { alarmDay } = useAlarm();
    const [showAlarmIcon, setShowAlarmIcon] = useState(false);

    useEffect(() => {
        const selectedAlarmDateTime = localStorage.getItem('selectedAlarmDateTime');
        setShowAlarmIcon(selectedAlarmDateTime !== null);
    }, []);

    useEffect(() => {
        setShowAlarmIcon(Boolean(alarmDay));
    }, [alarmDay]);

    useEffect(() => {
        const handleHideIcon = () => {
            setShowAlarmIcon(false);
        };

        const handleShowIcon = () => {
            setShowAlarmIcon(true);
        };

        window.addEventListener('hideIcon', handleHideIcon);
        window.addEventListener('showIcon', handleShowIcon);

        return () => {
            window.removeEventListener('hideIcon', handleHideIcon);
            window.removeEventListener('showIcon', handleShowIcon);
        };
    }, []);


    return (
        <div ref={ref} className="date__etc">
            <AlarmIcon
                showAlarmIcon={showAlarmIcon}
            />

            <RoomInfo
                roomNumber={roomNumber}
            />

            <DateComponent
                options={
                    DATE_FORMAT_OPTIONS
                }
                locale={getLocale(language)}
            />

        </div>
    );
};

export default DateSection;
