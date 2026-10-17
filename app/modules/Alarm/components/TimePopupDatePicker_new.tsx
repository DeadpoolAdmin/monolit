import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL';
import { setInitialDate } from '@/slices/Alarm/alarmSlice';
import { setRootControl } from '@/slices/RootControlSlice';
import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TimeDatePicker from '@/shared/components/TimeDatePicker/TimeDatePicker';
import { useTranslate } from '@shared/hooks/languages/useI18';
import { getLocale } from '@/shared/functions/getLocale';

const TimePopupDatePicker: React.FC = () => {
    const { language } = useTranslate();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const initialDate = useSelector((state: any) => state.alarmSlice?.date);

    const getLiveTime = () => {
        const now = new Date();
        now.setSeconds(0, 0);
        now.setMinutes(now.getMinutes() + 5);
        return now;
    };

    const getInitialTime = () => {
        const liveTime = getLiveTime();
        return {
            hour: liveTime.getHours(),
            minute: liveTime.getMinutes(),
            date: liveTime,
        };
    };

    // Initialize ref with current time + 5 minutes immediately
    const initialTime = getInitialTime();
    const currentValuesRef = useRef({ 
        hour: initialTime.hour, 
        minute: initialTime.minute, 
        date: initialTime.date 
    });

    const formatDate = (date: Date) => {
        const locale = getLocale(language);
        return `${date.toLocaleDateString(locale, {
            weekday: 'short'
        }).replace(/[<>]/g, '')} ${date.toLocaleDateString(locale, {
            month: 'short',
            day: 'numeric'
        })}`;
    };

    const onConfirm = (_fullDate: Date) => {
        // Handle alarm confirmation
    };

    const onOk = (_index: number, hour: number, minute: number, date: Date) => {
        // Update current values when user confirms a selection
        currentValuesRef.current = { hour, minute, date };
        dispatch(setRootControl(ROOT_CONTROL.ALARM_SELECT_TIME_BUTTON));
    };

    const onBack = () => {
        navigate('/menu/alarm');
    };

    // Custom effects for alarm-specific logic
    const customEffects = [
        {
            effect: () => {
                const onAlarmTrigger = () => {
                    // This will trigger a re-render and update the time
                    window.dispatchEvent(new CustomEvent('updateLiveTime'));
                };

                window.addEventListener('alarmTriggered', onAlarmTrigger);
                return () => {
                    window.removeEventListener('alarmTriggered', onAlarmTrigger);
                };
            },
            dependencies: []
        },
        {
            effect: () => {
                const interval = setInterval(() => {
                    // Trigger update through custom event
                    window.dispatchEvent(new CustomEvent('updateLiveTime'));
                }, 60000 - 10000); // Update every minute

                return () => clearInterval(interval);
            },
            dependencies: [initialDate]
        },
        {
            effect: () => {
                dispatch(setRootControl(ROOT_CONTROL.ALARM_SELECT_TIME));
            },
            dependencies: []
        },
        {
            effect: () => {
                const handleGetCurrentTimeValues = () => {
                    const { hour, minute, date } = currentValuesRef.current;
                    // Create a combined Date object with selected date and time
                    const combinedDateTime = new Date(date);
                    combinedDateTime.setHours(hour, minute, 0, 0);

                    // Send current time values back to SelectTime component
                    window.dispatchEvent(new CustomEvent('currentTimeValues', {
                        detail: {
                            hour: hour,
                            minute: minute,
                            date: combinedDateTime
                        }
                    }));
                };

                window.addEventListener('getCurrentTimeValues', handleGetCurrentTimeValues);

                return () => {
                    window.removeEventListener('getCurrentTimeValues', handleGetCurrentTimeValues);
                };
            },
            dependencies: []
        }
    ];

    // Update current values ref when time/date changes
    useEffect(() => {
        const handleUpdateValues = (e: Event) => {
            const { detail } = e as CustomEvent;
            if (detail) {
                currentValuesRef.current = detail;
                dispatch(setInitialDate([detail.date, detail.hour, detail.minute]));
            }
        };

        window.addEventListener('updateTimeValues', handleUpdateValues);
        return () => window.removeEventListener('updateTimeValues', handleUpdateValues);
    }, [dispatch]);

    return (
        <TimeDatePicker
            getInitialTime={getInitialTime}
            rootControlActiveValue={ROOT_CONTROL.ALARM_SELECT_TIME}
            rootControlId="popup"
            formatDate={formatDate}
            onConfirm={onConfirm}
            onBack={onBack}
            onOk={onOk}
            customEffects={customEffects}
            minMinutesFromNow={1}
            maxDaysFromNow={7}
        />
    );
};

export default TimePopupDatePicker;
