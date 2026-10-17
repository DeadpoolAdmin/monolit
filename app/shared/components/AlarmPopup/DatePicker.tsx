
import React, { useEffect, useRef, useState } from 'react';

import '@shared/styles/Alarm/alarm__popup.scss'
import { getLocale } from '@/shared/functions/getLocale';
import { useTranslate } from '@shared/hooks/languages/useI18';

const DatePicker: React.FC = () => {

    const { language } = useTranslate();
    const hourInputRef = useRef<HTMLInputElement>(null);
    const minutesInputRef = useRef<HTMLInputElement>(null);

    const [hour, setHour] = useState<string>('00');
    const [minute, setMinute] = useState<string>('00');
    const [date, setDate] = useState<string>('Mon Sep 25');

    const selectedAlarmDateTime = localStorage.getItem('selectedAlarmDateTime');

    useEffect(() => {
        if (selectedAlarmDateTime) {
            const parsedDateTime = JSON.parse(selectedAlarmDateTime);
            setHour(parsedDateTime.hours);
            setMinute(parsedDateTime.minutes);
            setDate(parsedDateTime.date);
        }
    }, [selectedAlarmDateTime]);

    return (
        <div className="select-time-picker">
            <div className="time-group">
                <div className="hours">
                    <input
                        disabled
                        ref={hourInputRef}
                        type="number"
                        value={hour}
                        min={0}
                        max={23}
                        onChange={() => {}}
                        style={{
                            color: 'var(--card-text-color, var(--initial-card-text-color))'
                        }}

                    />
                </div>
                
                <p>
                :
                </p>
                

                <div className="hours">
                    <input
                        type="number"
                        value={minute}
                        min={0}
                        max={59}
                        disabled
                        onChange={()=>{}}
                        ref={minutesInputRef}
                        style={{
                            color: 'var(--card-text-color, var(--initial-card-text-color))'
                        }}
                    />
                </div>

                <div className="hours">
                    <div
                        className={`date`}
                        style={{
                            color: 'var(--card-text-color, var(--initial-card-text-color))'
                        }}
                    >
                        {`${new Date(date).toLocaleDateString(getLocale(language), {
                            weekday: 'short'
                        }).replace(/[<>]/g, '')} ${new Date(date).toLocaleDateString(getLocale(language), {
                            month: 'short',
                            day: 'numeric'
                        }).replace(/[<>]/g, '')}`}

                    </div>
                </div>
            </div>
        </div>
    );
};


export default DatePicker