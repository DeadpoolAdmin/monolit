import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL'
import { setRootControl } from '@/slices/RootControlSlice'
import { useKeydown } from '@hotel-smarters/use-key-down-control'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import 'smarters-ino-ui-tv/dist/main.css'

import { Button } from '@/shared/components/Button/Button'
import TimePopupDatePicker from '../components/TimePopupDatePicker'
import { useNavigate } from 'react-router-dom'
import { useTranslate } from '@/shared/hooks/languages/useI18'


const days = [
    "Everyday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
]

function getNextDatesForDays(
    days: string[],
    [hour, minute]: [number, number]
): Date[] {
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    const todayDayIndex = today.getDay(); // 0 (Sun) to 6 (Sat)


    // If "Everyday" is present, use all days of week
    const effectiveDays = days.includes("Everyday") ? dayNames : days;

    return effectiveDays.map((day) => {
        const targetDayIndex = dayNames.indexOf(day);
        if (targetDayIndex === -1) console.log(`Invalid day name: ${day}`);

        let daysToAdd = (targetDayIndex - todayDayIndex + 7) % 7;

        // If today and time has passed, schedule for next week
        if (
            daysToAdd === 0 &&
            (today.getHours() > hour || (today.getHours() === hour && today.getMinutes() >= minute))
        ) {
            daysToAdd = 7;
        }

        const date = new Date(today);
        date.setDate(today.getDate() + daysToAdd);
        date.setHours(hour, minute, 0, 0);

        return date;
    });
}



const SelectTime = () => {
    const rootControl = useSelector((state: any) => state.rootControl.rootControl);

    const alarmTimes = useSelector((state: any) => state.alarmSlice.alarmTimes);

    const dispatch = useDispatch();

    const [index, setIndex] = useState<number>(0);

    const { t } = useTranslate();

    const onOk = (item: string) => {
        window.dispatchEvent(new CustomEvent('selectTime', {
            detail: {
                time: item
            }
        }));
    }

    const navigate = useNavigate();

    const onGetNextDatesForDays = () => {
        // Set up event listener first, then dispatch the request
        const handleTimeValues = (event: any) => {
            const { hour, minute, date: currentDate } = event.detail;

            // Save selected date and time to localStorage
            const selectedDateTime = {
                hours: hour,
                minutes: minute,
                date: currentDate.toISOString(),
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('selectedAlarmDateTime', JSON.stringify(selectedDateTime));

            const dates = getNextDatesForDays(alarmTimes, [hour, minute]);

            const storageItemKey = 'alarm-days';
            const stored = localStorage.getItem(storageItemKey);

            // Convert dates to ISO strings for comparison
            const newDates = dates.map((date: Date) => new Date(date));

            let storedDates: Date[] = [];
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    if (Array.isArray(parsed)) {
                        storedDates = parsed.map((date: any) => new Date(date));
                    }
                } catch {
                    storedDates = [];
                }
            }

            // Compare arrays
            const arraysAreEqual =
                storedDates.length === newDates.length &&
                storedDates.every((date, idx) => date === newDates[idx]);

            if (!arraysAreEqual) {
                localStorage.setItem(storageItemKey, JSON.stringify(newDates));
            }

            window.dispatchEvent(new CustomEvent('updateAlarmDays'));
            window.dispatchEvent(new CustomEvent('showAlarmIcon'));
            window.dispatchEvent(new CustomEvent('toastAlarm'));

            // Clean up event listener
            window.removeEventListener('currentTimeValues', handleTimeValues);
        };

        // Add listener first, then dispatch the request
        window.addEventListener('currentTimeValues', handleTimeValues);
        window.dispatchEvent(new CustomEvent('getCurrentTimeValues'));
    }



    const controls = {
        isActive: rootControl === ROOT_CONTROL.ALARM_SELECT_DAY,
        id: 'days-control',
        down: () => {
            const lastIndex = days.indexOf(days[days.length - 1]);
            const firstSectionLastIndex = lastIndex % 2 == 0 ? lastIndex : lastIndex - 1

            const secondSectionLastIndex = lastIndex;

            if (firstSectionLastIndex !== index && secondSectionLastIndex !== index) {
                setIndex(prev => prev + 2)
            }
            else {
                dispatch(setRootControl(ROOT_CONTROL.ALARM_SELECT_TIME_BUTTON))
            }
        },
        up: () => {
            const firstSectionFirstIndex = 0;
            const secondSectionFirstIndex = 1;

            if (index !== firstSectionFirstIndex && index !== secondSectionFirstIndex) {
                setIndex(prev => prev - 2);
            } else {
                dispatch(setRootControl(ROOT_CONTROL.ALARM_SELECT_TIME))
            }
        },
        right: () => {
            const pairedIndex = index % 2 == 0;

            if (!pairedIndex) return;

            setIndex(prev => prev + 1)
        },
        left: () => {
            if (index % 2 === 0) return;

            setIndex(prev => prev - 1);
        },
        ok: () => {
            onOk(days[index])
        }
    }

    useKeydown(controls)





    return (
        <div className='select__time'>
            <div className="select__time__header">
                <span> {t('selectTimeAndDate')}</span>
            </div>

            <TimePopupDatePicker />

            <Button
                minWidth='38'
                maxWidth='41'
                isActive={rootControl === ROOT_CONTROL.ALARM_SELECT_TIME_BUTTON}
                ok={onGetNextDatesForDays}
                style={{
                    marginTop: '5rem',
                    transition: '0.1s',
                    border: '0.2rem solid transparent',
                    borderColor: rootControl === ROOT_CONTROL.ALARM_SELECT_TIME_BUTTON ? 'var(--active-color)' : 'transparent',
                }}
                up={() => dispatch(setRootControl(ROOT_CONTROL.ALARM_SELECT_TIME))}
                back={() => navigate('/menu/alarm')}
            >
                <span className="button-text">{t('confirm')}</span>
            </Button>

        </div>
    )
}

export default SelectTime