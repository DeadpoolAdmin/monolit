import React from 'react';

import { useGetInformationQuery } from '@/services/Settings/SettingsApi';
import useAspectRatio from '@/shared/hooks/useAspectRatio';
import { useText } from '@/shared/hooks/useGetText';
import { setPrevRootControl, setRootControl } from '@/slices/RootControlSlice';
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL';
import { useGenerateUrl } from '@hotel-smarters/generatefileurl';
import { usePolyfillSearchParams } from '@hotel-smarters/polyfill-search-params';
import { useResolution } from '@hotel-smarters/resolution-hook';
import { useKeydown } from '@hotel-smarters/use-key-down-control';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { GridView } from 'smarters-ino-ui-tv';

import smarters from '@assets/smarters.png'
import QueryWrapper from '@/shared/components/QueryWrapper';
import ScrollView from '@/shared/components/ScrollView/ScrollView';

const SubCategories = () => {
    const {id} = useParams();

    const { data: infoCategory, isLoading, isError, error } = useGetInformationQuery(id!);

    const infoControl = useSelector((state: any) => state.rootControl.rootControl)

    const { getDeviceType } = useResolution();

    const deviceType = getDeviceType();

    const isTV = deviceType === 'TV'

    const { getDimensions } = useAspectRatio(74.6);

    const { getUrl } = useGenerateUrl(process.env.REACT_APP_API_HOST as string);

    const { getText } = useText();

    const language = useMemo(() => localStorage.getItem('lang') as string, []);

    const navigate = useNavigate();

    const searchParams = usePolyfillSearchParams();

    const dispatch = useDispatch();

    const [activeIndex, setActiveIndex] = useState<number>(0);

    const onUp = () => {
        dispatch(setRootControl(ROOT_CONTROL.HEADER_BACK))
        dispatch(setPrevRootControl(ROOT_CONTROL.INFO_CATEGORIES))
    }

    const controls = {
        isActive: infoControl === ROOT_CONTROL.INFO_CATEGORIES,
        id: 'categories-control',
        back: () => {
            if (activeIndex == 0) {
                const search = searchParams.toString();
                navigate(`/menu/infocenter${search ? `?${search}` : ''}`);

                return
            }
            setActiveIndex(0);
        }
    }


    useKeydown(controls)


    useEffect(() => {
        dispatch(setRootControl(ROOT_CONTROL.INFO_CATEGORIES))
    }, [])

    const onOk = (item: {_id: string, title: Record<string, string> | string, featuredImage: string}) => {
        if(!item) return;

        localStorage.setItem('infoDetail', JSON.stringify(item))

        const search = searchParams.toString();
        navigate(`detail${search ? `?${search}` : ''}`);
    }

    return (
        <QueryWrapper
            isLoading={isLoading}
            isError={isError}
            isEmpty={!infoCategory || infoCategory.length === 0}
            error={error}
        >
            <div className="information">
                <div className='categories' style={{
                    height: deviceType === 'TV' ? 'var(--screen-height)' : '95%',
                    overflow: deviceType === 'TV' ? 'hidden' : 'auto',
                    scrollbarWidth: 'none',
                }}>
                <div className="categories__list">
                    {
                        isTV ? <GridView
                            id='categories'
                            data={infoCategory}
                            isActive={infoControl === ROOT_CONTROL.INFO_CATEGORIES}
                            gap={2}
                            initialActiveIndex={0}
                            nativeControle={true}
                            bufferStart={5}
                            rowItemsCount={2}
                            activeIndex={activeIndex}
                            onUp={onUp}
                            onOk={(item) => onOk(item)}
                            itemWidth={getDimensions().width}
                            itemHeight={getDimensions().height}
                            scrollOffset={getDimensions().height}
                            onIndexChange={(index) => setActiveIndex(index)}
                            renderItem={({ item, style, isActive, key }) => (
                                <div onClick={() => onOk(item)} key={key} className={`infoCategory__item ${isActive ? 'active' : ''}`} style={style}>

                                    <div className="background"
                                        style={{
                                            background: isActive ? 'black' : 'transparent',
                                            width: '100%',
                                            height: '100%',
                                            opacity: 0.5,
                                            borderRadius: '1rem',
                                            transition: 'background 0.1s ease'
                                        }}
                                    ></div>


                                    <img className='infoCategory__image' onError={
                                        (e: any) => e.target.src = smarters
                                    } src={getUrl(item.featuredImage)} alt={item.name} />
                                    <div className='infoCategory__item__title'>{getText(item.title, language ?? 'en')}</div>
                                </div>
                            )}
                        />


                        :
                            <ScrollView
                                data={infoCategory}
                                width={160}
                                height={85}
                                dimension='vh'
                                type={'list-movies'}
                                listType={'grid'}
                                renderItem={({ item, style, isActive, key }: {
                                    item: ICategory,
                                    style: React.CSSProperties,
                                    isActive: boolean,
                                    key: React.Key
                                }) => (
                                    <div onClick={() => onOk(item)} key={key} className={`infoCategory__item ${isActive && isTV ? 'active' : ''}`} style={{
                                        ...style,
                                        width: getDimensions().width + 'rem',
                                        height: getDimensions().height + 'rem',
                                        margin: '1rem'
                                    }}>
                                        <img className='infoCategory__image' onError={
                                            (e: any) => e.target.src = smarters
                                        } src={getUrl(item.featuredImage)} alt={getText(item.title, language ?? 'en')} />
                                        <div className='infoCategory__item__title'>{getText(item.title, language ?? 'en')}</div>
                                    </div>
                                )}
                            />
                    }

                </div>

            </div>
            </div>
        </QueryWrapper>
    )
}

export default SubCategories