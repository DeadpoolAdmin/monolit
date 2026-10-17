import { useResolution } from '@hotel-smarters/resolution-hook';
import React, { useState } from 'react'

import { GridView } from 'smarters-ino-ui-tv'
import 'smarters-ino-ui-tv/dist/main.css'

import sound from '@/assets/sound.png'
import { useSelector, useDispatch } from 'react-redux';

import { FaCheckCircle } from "react-icons/fa";
import { setPrevRootControl, setRootControl } from '@/slices/RootControlSlice';
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL';
import { setSelectedSound } from '@/slices/Alarm/alarmSlice';
import { useNavigate } from 'react-router-dom';
import { useKeydown } from '@hotel-smarters/use-key-down-control';
import { useTranslate } from '@/shared/hooks/languages/useI18';


type PData = {
    data: {
        id: number,
        image: string,
        title: string,
    }[]
}

const AlarmList: React.FC<PData> = ({ data }) => {
    const { getDeviceType } = useResolution();

    const deviceType = getDeviceType();

    const rootControl = useSelector((state: any) => state.rootControl.rootControl);

    const selectedItem = useSelector((state: any) => state.alarmSlice.selected);

    const isSelectedSound = localStorage.getItem('alarm-sound');

    const selectedSound = useSelector((state: any) => state.alarmSlice.selectedSound);

    const dispatch = useDispatch();

    const { t } = useTranslate();

    const [activeIndex, setActiveIndex] = useState(0);

    const navigate = useNavigate();

    const onUp = () => {
       dispatch(setPrevRootControl(rootControl));

       dispatch(setRootControl(ROOT_CONTROL.HEADER_BACK));
    }

    const onOk = async (item: any) => {
        const selected = data.find((i) => i.id === item.id) as { id: number, image: string, title: string, sound: string };

        localStorage.setItem('alarm-sound', selected.sound);
        localStorage.setItem('alarm-img', selected.image);

        dispatch(setSelectedSound(selected.sound));

        const audioElement = document.querySelector('#alarm-audio') as HTMLAudioElement;

        if (audioElement) {
            audioElement.src = selected.sound;

            await audioElement.play().catch((error) => {
                console.error('Error playing audio:', error);
            });
        }


    }

    const controls = {
        isActive: rootControl === ROOT_CONTROL.ALARM,
        id: 'alarm-list',
        back: () => {
            if(activeIndex === 0) {
                navigate('/menu')
            }
            else {
                setActiveIndex(0);
            }
        }
    }

    useKeydown(controls)


    return (

        <GridView
            id='alarm'
            data={data}
            isActive={rootControl === ROOT_CONTROL.ALARM}
            gap={2}
            rowGap={3}
            initialActiveIndex={0}
            nativeControle={true}
            bufferStart={5}
            rowItemsCount={3}
            onDown={() => isSelectedSound ? dispatch(setRootControl(ROOT_CONTROL.ALARM_BUTTON)) : {}}
            onUp={onUp}
            onOk={(item) => onOk(item)}
            itemWidth={40.93}
            itemHeight={37.1}
            onIndexChange={(index) => setActiveIndex(index)}
            renderItem={({ item, style, isActive, key }) => (
                <div onClick={() => onOk(item)} key={key} className={`alarm__item ${isActive && deviceType === 'TV' ? 'active' : ''} ${selectedItem && selectedItem.id === item.id ? 'selected' : ''}`} style={style}>
                    <img style={{ width: '35rem', height: 26 + 'rem', objectFit: 'contain', padding: '7rem' }} src={item.image} alt="" className='alarm__item__image' />
                    {
                        ((selectedSound && selectedSound === item.sound) || (isSelectedSound && isSelectedSound === item.sound)) ? <FaCheckCircle className='alarm__item__selected' /> : null
                    }
                    <div className="sound__icon">
                        <img src={sound} alt="" className='sound__ico' />
                    </div>
                    <div className='alarm__item__title'>{t(item.title)}</div>
                </div>
            )}
        />



    )
}

export default AlarmList