import React, { useEffect } from 'react'

import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { usePolyfillSearchParams } from '@hotel-smarters/polyfill-search-params'
import { Button } from '@/shared/components/Button/Button'
import { setRootControl } from '@/slices/RootControlSlice'
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL'
import AlarmList from '../components/AlarmList'
import { useAlarmData } from '../hooks/useAlarmData'
import { PData } from '../types/alarm.type'
import { useTranslate } from '@/shared/hooks/languages/useI18'

const Alarm: React.FC = () => {
    const dispatch = useDispatch();

    const rootControl = useSelector((state: any) => state.rootControl.rootControl);

    const selectedSound = useSelector((state: any) => state.alarmSlice.selectedSound);

    const selected = useSelector((state: any) => state.alarmSlice.selected);

    const audio = React.useRef<HTMLAudioElement>(null);

    const navigate = useNavigate();

    const searchParams = usePolyfillSearchParams();

   const { data } = useAlarmData() as { data: PData['data'] }

    const { t } = useTranslate();


    useEffect(() => {
        dispatch(setRootControl(ROOT_CONTROL.ALARM))
    }, [])

    const playAudio = async (audio: HTMLAudioElement) => {
        if (audio) {
            try {
                await audio.play();
            } catch (error) {
                console.error('Error playing audio:', error);
            }
        }
    }

    useEffect(() => {
        const alarmAudio = document.querySelector('#alarm-audio') as HTMLAudioElement;

        if (selectedSound && alarmAudio) {
            localStorage.setItem('alarm-sound', selectedSound);
            // localStorage.setItem('alarm-img', JSON.stringify(selected.image));

            


            alarmAudio.src = localStorage.getItem('alarm-sound') as string;

            playAudio(alarmAudio).catch((error) => {
                console.error('Error playing audio:', error);
            }
            );
        }
        else {
            try {
                alarmAudio.pause();
                alarmAudio.currentTime = 0;
            }
            catch (e) {
                console.log(e)
            }

        }

        return () => {
            try {
                alarmAudio.pause();
            }
            catch (e) {
                console.log(e)
            }
        }

    }, [selectedSound])


    return (
        data && data.length &&
        <div className='alarm__content'>
            <div className='alarm'>
                <audio ref={audio} autoPlay={selectedSound && selected} style={{ display: 'none' }}></audio>
                <AlarmList data={data as PData['data']} />
                <div className="alarm__btn">
                    {
                        <Button
                            minWidth='38'
                            maxWidth='41'
                            up={() => dispatch(setRootControl('alarm'))}
                            ok={() => {
                                const search = searchParams.toString();
                                navigate(`/menu/alarm/selectTime${search ? `?${search}` : ''}`);
                            }}
                            style={{
                                position: 'relative',
                                border: '0.2rem solid transparent',
                                borderColor: rootControl === ROOT_CONTROL.ALARM_BUTTON ? 'var(--active-color, white)' : 'transparent',
                            }} isActive={rootControl === ROOT_CONTROL.ALARM_BUTTON}>
                            <span className="button-text">{t('selectTime')}</span>
                        </Button>
                    }

                </div>

            </div>
        </div>
    )
}

export default Alarm