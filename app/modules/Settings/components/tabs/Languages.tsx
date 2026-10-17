import React, { memo, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import { ListView } from 'smarters-ino-ui-tv'
import 'smarters-ino-ui-tv/dist/main.css'

import { useChoosenLanguage } from '../../hooks/useChoosenLanguage';

import { useResolution } from "@hotel-smarters/resolution-hook";
import { useKeydown } from '@hotel-smarters/use-key-down-control';
import { FaCheck } from 'react-icons/fa';
import { useLanguages } from '../../hooks/useLanguages';
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL';
import QueryWrapper from '@/shared/components/QueryWrapper';
import { setRootControl } from '@/slices/RootControlSlice';
import { useNavigate } from 'react-router-dom';
import ScrollView from '@/shared/components/ScrollView/ScrollView';

// const ScrollView = React.lazy(() => import('scrollview/ScrollView').catch(() => {
//     console.log('scrollview not found');
//     return <></>
// }))

const Languages = () => {

    const rootControl = useSelector((state: any) => state.rootControl.rootControl)

    const { choosenLanguage, onChooseLanguage } = useChoosenLanguage()

    const dispatch = useDispatch();

    const { languagesList, languages,  loading } = useLanguages();

    const { getDeviceType } = useResolution()

    const deviceType = getDeviceType()

    const navigate = useNavigate();

    const [activeIndex, setActiveIndex] = useState(0);

    const controls = {
        isActive: rootControl === ROOT_CONTROL.SETTINGS_CONTENT && deviceType === 'TV',
        id: 'control-lang',
        up: () => {
            window.transforming = true;
            window.dispatchEvent(new Event("transformstart"));
            // Dispatch transformend after a short delay to allow images to process
            setTimeout(() => {
                window.transforming = false;
                window.dispatchEvent(new Event("transformend"));
            }, 100);
        },
        down: () => {
            window.transforming = true;
            window.dispatchEvent(new Event("transformstart"));
            // Dispatch transformend after a short delay to allow images to process
            setTimeout(() => {
                window.transforming = false;
                window.dispatchEvent(new Event("transformend"));
            }, 100);
        },
        back: () => {
            if(activeIndex === 0) {
                navigate('/menu')
            }
            else {
                setActiveIndex(0)
            }
        }
    }


    useKeydown(controls)

    useEffect(() => {
        dispatch(setRootControl(ROOT_CONTROL.SETTINGS_HEADER))
    }, [dispatch])

    return (
        <QueryWrapper
            isLoading={loading}
            isEmpty={!languages || languages.length === 0}
        >
            <div className='languages__option' style={{
                height: deviceType === 'TV' ? '60rem' : '83%',
                overflowY: deviceType === 'TV' ? 'hidden' : 'auto',
                scrollbarWidth: 'none',
            }}>
                {
                    deviceType === 'TV' ?

                        <ListView
                            id='list'
                            isActive={rootControl === ROOT_CONTROL.SETTINGS_CONTENT && deviceType === 'TV'}
                            itemsCount={6}
                            itemsTotal={languagesList.length}
                            itemHeight={10}
                            startScrollIndex={0}
                            itemWidth={60}
                            activeIndex={activeIndex}
                            onIndexChange={(index) => setActiveIndex(index)}
                            data={[
                                ...languagesList.filter(lang => lang.code === 'en'),
                                ...languagesList.filter(lang => lang.code !== 'en')
                            ]}
                            onUp={() => dispatch(setRootControl(ROOT_CONTROL.SETTINGS_HEADER))}
                            buffer={3}
                            gap={2}
                            rowGap={2}
                            direction='ltr'
                            listType='vertical'
                            onOk={(item) => onChooseLanguage(item.code)}
                            nativeControle={true}
                            renderItem={({ style, item, isActive, key }) => (
                                <div className={`lang__item ${isActive ? 'active' : ''}`} key={key} style={style} onClick={() => onChooseLanguage(item.code)}>
                                    <div className="item__img">
                                        <img src={item.icon} alt={item.name} />
                                    </div>
                                    <div className="item__name">{item.name}</div>

                                    {
                                        choosenLanguage === item.code ? <div className="item__selected">
                                            <FaCheck />
                                        </div> : <></>
                                    }

                                </div>
                            )}
                        />
                        :
                        <ScrollView
                            data={
                                [
                                    ...languagesList.filter(lang => lang.code === 'en'),
                                    ...languagesList.filter(lang => lang.code !== 'en')
                                ]
                            }
                            width={60}
                            height={100}
                            dimension={'rem'}
                            listType={'grid'}
                            type={'grid-movies'}
                            itemIndex={0}
                            style={{}}
                            onClick={() => {}}
                            renderItem={({ style, item, isActive, key }: {
                                style: React.CSSProperties,
                                item: any,
                                isActive: boolean,
                                key: React.Key,
                            }) => (
                                <div onClick={() => onChooseLanguage(item.code)} className={`lang__item ${isActive ? 'active' : ''}`} key={key} style={{
                                    ...style,
                                    width: 60 + 'rem',
                                    height: 11 + 'rem',
                                    margin: '1.5rem 0'
                                }}>
                                    <div className="item__img">
                                        <img src={item.icon} alt={item.name} />
                                    </div>
                                    <div className="item__name">{item.name}</div>

                                    {
                                        choosenLanguage && choosenLanguage === item.code ? <div className="item__selected">
                                           <FaCheck />
                                        </div> : <></>
                                    }

                                </div>
                            )}
                        />
                }

            </div>
        </QueryWrapper>
    )
}

export default memo(Languages) 