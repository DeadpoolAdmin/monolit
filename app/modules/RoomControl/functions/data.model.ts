import light_on from '@/assets/room_control/on/light_on.png'
import masterLight_on from '@/assets/room_control/on/master_light_on.png'
import curtainsOn from '@/assets/room_control/on/curtains_on.png'


import curtains from '@/assets/room_control/curtains.png'
import disturb from '@/assets/room_control/disturb.png'
import masterLight from '@/assets/room_control/master_light.png'

import bed_light from '@/assets/room_control/bed_light.png'
import { SmartDeviceType } from '../types/room_control.enum'

import temperature from '@/assets/room_control/master_light.png'

import corridor_light from '@/assets/room_control/corridor.png'
import corridorLight_on from '@/assets/room_control/on/corridor_on.png'

interface IList {
    id: number;
    title: string;
    image: string;
    type: string;
    selected: boolean;
    on: {
        image: string;
    };
}

export const list: IList[] = [
    {
        id: 1,
        title: 'Bed Light',
        image: bed_light,
        type : SmartDeviceType.bedLight,
        selected: false,
        on: {
            image : light_on,
        }
    }, 
    {
        id: 2,
        title: 'Master Light',
        image: masterLight,
        selected: false,
        type : SmartDeviceType.masterLight,
        on: {
            image : masterLight_on,
        }
    },
    // {
    //     id: 3,
    //     title: 'Scenes',
    //     type : SmartDeviceType.led,
    //     selected: false,
    //     image: scenes,
    //     on: {
    //         image : masterLight_on,
    //     }
    // },
    {
        id: 3,
        type : SmartDeviceType.curtain,
        title: 'Curtains',
        selected: false,
        image: curtains,
        on: {
            image : curtainsOn,
        }
    },
    {
        id: 4,
        title: 'DND',
        type : SmartDeviceType.dnd,
        selected: false,
        image: disturb,
        on: {
            image : null
        }
    },
    {
        id: 5,
        title: 'Corridor Light',
        type : SmartDeviceType.corridorLight,
        selected: false,
        image: corridor_light,
        on: {
            image : corridorLight_on
        }
    },
    // {
    //     id: 6,
    //     title: 'Temperature',
    //     type : SmartDeviceType.airConditioning,
    //     selected: false,
    //     image: temperature,
    //     on: {
    //         image : null
    //     }
    // }
    // {
    //     id: 7,
    //     title: 'Open door',
    //     type : 'door',
    //     image: door,
    //     selected: false,
    //     on: {
    //         image : doorOn
    //     }
    // },
    // {
    //     id: 8,
    //     title: 'Air conditioner',
    //     type : 'conditioner',
    //     image: conditioner,
    //     selected: false,
    //     on: {
    //         image : conditionerOn
    //     }
    // },
]
