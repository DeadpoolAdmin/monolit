import React, { memo } from 'react'
import { ListView } from 'smarters-ino-ui-tv';
import 'smarters-ino-ui-tv/dist/main.css';
import { useResolution } from '@hotel-smarters/resolution-hook';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL';
import { setRootControl } from '@/slices/RootControlSlice';
import { useQuickMessage } from '../hooks/useQuickMessage';
import { useQuickMessageControls } from '../hooks/useQuickMessageControls';


// const ScrollView = React.lazy(() => import('scrollView/ScrollView'))


const QuickMessage = ({ ref }: { ref: React.RefObject<HTMLDivElement> }) => {
    const { quicks, chooseQuickMessage } = useQuickMessage();

    const { getDeviceType } = useResolution();

    const deviceType = getDeviceType();

    const rootControl = useSelector((state : any) => state.rootControl.rootControl);

    useQuickMessageControls();

    const dispatch = useDispatch();


    return (
        <div className={`quicks ${rootControl === ROOT_CONTROL.CHAT_QUICK && deviceType === 'TV' ? 'active' : ''}`} ref={ref} style={{
            overflow: deviceType === 'TV' ? 'hidden' : 'auto'
        }}>
            {
                deviceType === 'TV' ? (
                    <ListView
                        data={quicks}
                        id='quick-message'
                        itemsCount={quicks.length}
                        itemsTotal={quicks.length}
                        listType={'horizontal'}
                        buffer={10}
                        itemWidth={23}
                        onRight={() => dispatch(setRootControl(ROOT_CONTROL.CHAT_SCROLL))}
                        itemHeight={7}
                        startScrollIndex={3}
                        gap={2}
                        onOk={(item) => chooseQuickMessage(item)}
                        isActive={rootControl === ROOT_CONTROL.CHAT_QUICK}
                        renderItem={({ item, style, key, isActive }) => (
                            <div className={`quick__item ${isActive ? 'active' : ''}`} key={key} onClick={() => chooseQuickMessage(item)} style={{
                                ...style
                            }}>
                                {item.message}
                            </div>
                        )}
                    />
                )
                    :
                    <></>
                    // <ScrollView
                    //     type={'list-movies'}
                    //     listType={'horizontal-list'}
                    //     data={quicks}
                    //     itemHeight={7}
                    //     itemWidth={30}
                    //     renderItem={({ item, style, key, isActive }: {
                    //         item: IQuickMessage,
                    //         style: React.CSSProperties,
                    //         key: string,
                    //         isActive: boolean
                    //     }) => (
                    //         <div className={`quick__item ${isActive ? 'active' : ''}`} key={key} onClick={() => chooseQuickMessage(item)} style={{
                    //             ...style,
                    //             width: 25 + 'rem',
                    //             height: 7 + 'rem',
                    //             margin: '0 .5rem'
                    //         }}>
                    //             {item.message}
                    //         </div>
                    //     )}
                    // />
            }

        </div>
    )
}

export default memo(QuickMessage) 