import inspiration_morning from '@assets/inspiration_morning.png'
import birds from '@assets/birds.png'
import morning_touch from '@assets/morning_touch.png'
import brand_new_day from '@assets/brand_new_day.png'
import summer_jumping from '@assets/summer_jump.png'
import classic from '@assets/classic.png'
import { useEffect, useState } from 'react'

const mediaLibraryHost = process.env.REACT_APP_API_HOST + '/media-library';

// Use local audio files for standalone operation
const birdsSound = mediaLibraryHost + '/birds.sound.mp3';
const classicSound = mediaLibraryHost + '/piano.mp3';
const brandNewDaySound = mediaLibraryHost + '/new_day.mp3';
const morningTouchSound = mediaLibraryHost + '/morning_touch.mp3';
const summerJumpingSound = mediaLibraryHost + '/jump.mp3';
const inspirationMorningSound = mediaLibraryHost + '/morning.sound.mp3';



export const alarmData = [
    {
        id: 1,
        image: inspiration_morning,
        title: 'inspirationMorning',
        sound: inspirationMorningSound,
    },
    {
        id: 2,
        image: birds,
        title: 'birdsInAForest',
        sound: birdsSound,
    },
    {
        id: 3,
        image: morning_touch,
        title: 'morningTouch',
        sound: morningTouchSound,
    },
    {
        id: 4,
        image: brand_new_day,
        title: 'brandNewDay',
        sound: brandNewDaySound,
    },
    {
        id: 5,
        image: summer_jumping,
        title: 'summerJumping',
        sound: summerJumpingSound,
    },
    {
        id: 6,
        image: classic,
        title: 'classic',
        sound: classicSound,
    }
]


export const useAlarmData = () => {

    const [data, setData] = useState<unknown>(null);

    useEffect(() => {
        setData(alarmData)
    }, [])

    return { data }
}