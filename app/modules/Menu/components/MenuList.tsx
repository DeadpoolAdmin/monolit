import React, { memo, useCallback, useState, useEffect } from 'react'

import { ListView } from 'smarters-ino-ui-tv'
import 'smarters-ino-ui-tv/dist/main.css'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useResolution } from '@hotel-smarters/resolution-hook';
import { useKeydown } from '@hotel-smarters/use-key-down-control'
import { setRootControl } from '@/slices/RootControlSlice'
import { IMenuList } from '../types/MenuProps'
import MenuListItem from './MenuListItem'
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL'
import ScrollView from '@/shared/components/ScrollView/ScrollView'
import { useGetUnreadCount } from '@/shared/hooks/notification/useGetUnreadCount'

type PMenuList = {
    menuItems: IMenuList[];
}

// const ScrollView = React.lazy(() => import('scrollview/ScrollView'))

const ListStyles = {
    gap: 2,
    width: 26,
    height: 18
}

const MenuList: React.FC<PMenuList> = memo(({
    menuItems,
}) => {
    const navigate = useNavigate();

    const rootControl = useSelector((state: any) => state.rootControl.rootControl);

    const { getDeviceType } = useResolution();

    const deviceType = getDeviceType();

    const dispatch = useDispatch();

    const [activeIndex, setActiveIndex] = useState(0);

    const initialActiveIndex = useSelector((state: any) => state.rootControl.initialActiveIndex);

    const { unreads } = useGetUnreadCount();

    // Sync local activeIndex state with Redux initialActiveIndex
    useEffect(() => {
        setActiveIndex(initialActiveIndex);
    }, [initialActiveIndex]);

    const onOk = useCallback((item: IMenuList) => {
        if (item && item.type) {
            const items = item.type.toLocaleLowerCase();

            if (items.includes('chat')) {
                navigate(`/menu/messages`);
            }

            else if (items.includes('inroomdining') || items.includes('shop')) {
                navigate(`/menu/products?type=${items}`);
            }

            else if (items.includes('spa') || items.includes('transfers') || items.includes('services')) {
                navigate(`/menu/services?type=${items}`);
            }

            else if(items.includes('alarm')) {
                const alarmDay = localStorage.getItem('selectedAlarmDateTime');

                if(alarmDay) {
                    window.dispatchEvent(new CustomEvent('openCancelAlarmPopup'))
                    dispatch(setRootControl('alarmCancelPopup'))
                }
                else {
                    navigate('/menu/alarm');
                }
            }

            else if (items === 'livetv' && (window as any).LIVETV_SOURCE == 'cable_tv') {
                if ((window as any).Android) {
                    (window as any).Android.launchApp("com.superdtv")
                }
                else {
                    console.log('cable')
                }
            }
            else {
                navigate(`${items.toLocaleLowerCase()}`);
            }
        }

        // dispatch(setInitialActiveIndex(activeIndex))
    }, [navigate, activeIndex, dispatch]);


    const controls = {
        isActive: rootControl === ROOT_CONTROL.MENULIST,
        id: 'menu-list',
        up: () => {
            const background_music = document.querySelector('.background_music') as HTMLElement;

            if (background_music) {
                dispatch(setRootControl('background-playing'))
            }
        },
        back : () => {
            // dispatch(setInitialActiveIndex(0))
        },
        ok: () => {
            onOk(menuItems[activeIndex])
        }
    }

    useKeydown(controls)


    const renderItem = useCallback(({ style, item, isActive, key }: { style: React.CSSProperties, item: IMenuList, isActive: boolean, key: React.Key }) => (
        <MenuListItem unreads={unreads} onOk={onOk} item={item} icon={item.icon} title={item.title} key={key} style={style} isActive={isActive} />
    ), [unreads]);


    return (
        <div className='menu__menu_list'>
            {
                deviceType === 'TV' ?

                    <ListView     
                        data={menuItems}
                        id="live-tv-channels"
                        uniqueKey="live-tv-channels"
                        listType='horizontal'
                        nativeControle={true}
                        itemsCount={menuItems.length}
                        itemsTotal={menuItems.length}
                        gap={ListStyles.gap}
                        buffer={10}
                        itemWidth={ListStyles.width}
                        itemHeight={ListStyles.height}
                        isActive={rootControl === ROOT_CONTROL.MENULIST}
                        rowGap={ListStyles.gap}
                        initialActiveIndex={initialActiveIndex}
                        onIndexChange={(index) => setActiveIndex(index)}
                        startScrollIndex={2}
                        activeIndex={activeIndex}
                        direction="ltr"
                        onMouseEnter={() => { }}
                        renderItem={renderItem}
                    />
                    :
                    <ScrollView
                    style={{
                        position: 'relative',
                        left: '-7rem',
                        overflowY: 'hidden'
                    }}
                        data={menuItems}
                        width={175}
                        height={18}
                        type="menu"
                        listType="horizontal-list"
                        dimension="rem"
                        renderItem={({ style, item, isActive, key }) => (
                            <MenuListItem
                                onOk={onOk}
                                item={item}
                                key={key}
                                icon={item.icon}
                                title={item.title}
                                unreads={unreads}
                                style={{
                                    ...style,
                                    width: 30 + 'rem',
                                    margin: '0 1rem',
                                    position: 'relative',
                                    top: '2rem'
                                }}
                                isActive={isActive}
                            />
                        )}
                    />
            }

        </div>

    )
})

export default MenuList