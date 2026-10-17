import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export const useAlarm = () => {
    const alarmTimeout = useRef<NodeJS.Timeout | null>(null);
    const [openAlarmPopup, setOpenAlarmPopup] = useState(false);

    const [openAlarmCancelPopup, setOpenAlarmCancelPopup] = useState(false);

    const alarmTimeFromStorage = useMemo(() => {
        const stored = localStorage.getItem('selectedAlarmDateTime');
        return stored ? JSON.parse(stored) : {};
    }, [])

    const [alarmDay, setAlarmDay] = useState(alarmTimeFromStorage.date || '');

    const onUpdateAlarmDays = useCallback(() => {
        const selectedAlarmDateTime = JSON.parse(localStorage.getItem('selectedAlarmDateTime') as string) || {};

        setAlarmDay(selectedAlarmDateTime.date)
    }, []);


    const removeAlarmItem = useCallback(() => {
        if (!alarmDay) {
            window.dispatchEvent(new CustomEvent('hideIcon'))
        }

        setAlarmDay('') // Fix: Set to empty string instead of invalid object

        window.dispatchEvent(new CustomEvent('hideIcon'))
    }, [alarmDay]);


    useEffect(() => {
        if (alarmTimeout.current) {
            clearTimeout(alarmTimeout.current);
        }

        if (!alarmDay) { return };

        const alarmTime = new Date(alarmDay).getTime();
        const now = Date.now();
        const timeUntilAlarm = alarmTime - now;

        if (timeUntilAlarm > 0) {
            alarmTimeout.current = setTimeout(() => {
                ringAlarm();
            }, timeUntilAlarm)
        }
    }, [alarmDay])

    const ringAlarm = useCallback(() => {
        window.dispatchEvent(new CustomEvent('alarmTriggered'));
        setOpenAlarmPopup(true);

        const audioElement = document.getElementById('alarm-audio') as HTMLAudioElement;

        if (audioElement && audioElement.src) {
            console.log(audioElement.src)
            audioElement.play().catch((error) => {
                console.error('Error playing alarm sound:', error);
            });
        }

        removeAlarmItem();
    }, [alarmDay, removeAlarmItem]);

    useEffect(() => {
        window.addEventListener('updateAlarmDays', onUpdateAlarmDays);

        return () => {
            window.removeEventListener('updateAlarmDays', onUpdateAlarmDays);
        }
    }, [onUpdateAlarmDays])

    const onOpenAlarmCancelPopup = useCallback(() => {
        setOpenAlarmCancelPopup(true);
    }, [setOpenAlarmCancelPopup]);

    const onCloseAlarmCancelPopup = useCallback(() => {
        setOpenAlarmCancelPopup(false);
    }, [setOpenAlarmCancelPopup]);


    useEffect(() => {
        window.addEventListener('openCancelAlarmPopup', onOpenAlarmCancelPopup);

        return () => {
            window.removeEventListener('openCancelAlarmPopup', onOpenAlarmCancelPopup);
        }
    }, [onOpenAlarmCancelPopup])

    return {
        alarmDay,
        onUpdateAlarmDays,
        setAlarmDay,
        removeAlarmItem,
        ringAlarm,
        openAlarmPopup,
        setOpenAlarmPopup,
        openAlarmCancelPopup,
        setOpenAlarmCancelPopup,
        onOpenAlarmCancelPopup,
        onCloseAlarmCancelPopup
    }
}