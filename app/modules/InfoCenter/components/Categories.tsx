import React, { memo } from "react";
import { useGetInfoCategoriesQuery } from "@/services/Settings/SettingsApi";
import useAspectRatio from "@/shared/hooks/useAspectRatio";
import { useText } from "@/shared/hooks/useGetText";
import { useGenerateUrl } from "@hotel-smarters/generatefileurl";
import { usePolyfillSearchParams } from "@hotel-smarters/polyfill-search-params";
import { useKeydown } from "@hotel-smarters/use-key-down-control";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GridView } from "smarters-ino-ui-tv";

import smarters from '@assets/smarters.png'
import { useSelector } from "react-redux";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import QueryWrapper from "@/shared/components/QueryWrapper";
import { useDispatch } from "react-redux";
import { setPrevRootControl, setRootControl } from "@/slices/RootControlSlice";
import { useResolution } from "@hotel-smarters/resolution-hook";
import ScrollView from "@/shared/components/ScrollView/ScrollView";

const Categories = () => {
    const { data: infoCategories, isLoading, isError, error } = useGetInfoCategoriesQuery({})

    const { getUrl } = useGenerateUrl(process.env.REACT_APP_API_HOST as string);

    const { getDimensions } = useAspectRatio(74.6)

    const { getText } = useText();

    const language = localStorage.getItem('lang') as string

    const navigate = useNavigate();

    const searchParams = usePolyfillSearchParams();

    const [activeIndex, setActiveIndex] = useState(0);

    const deviceType = useResolution().getDeviceType();

    const dispatch = useDispatch();

    const onOk = (item: ICategory) => {
        const search = searchParams.toString();
        navigate(`category/${item._id}${search ? `?${search}` : ''}`);
    }

    const onUp = () => {
        dispatch(setRootControl(ROOT_CONTROL.HEADER_BACK))
        dispatch(setPrevRootControl(ROOT_CONTROL.INFO_CATEGORIES))
    }

    const rootControl = useSelector((state: any) => state.rootControl.rootControl)
    

    const controls = {
        isActive: rootControl === ROOT_CONTROL.INFO_CATEGORIES,
        id: 'categories-control',
        back: () => {
            if (activeIndex == 0) {
                const search = searchParams.toString();
                navigate(`/menu${search ? `?${search}` : ''}`);
                return
            }
            setActiveIndex(0);
        }
    }

    useKeydown(controls)

    return (
        <QueryWrapper
            isLoading={isLoading}
            isError={isError}
            isEmpty={!infoCategories || infoCategories.length === 0}
            error={error}
        >

            <div className='categories' style={{
                height: deviceType === 'TV' ? 'var(--screen-height)' : '95%',
                overflow: deviceType === 'TV' ? 'hidden' : 'auto',
                scrollbarWidth: 'none',
            }}>
                <div className="categories__list">
                    {
                        deviceType === 'TV' ? 
                        <GridView
                            id='categories'
                            data={infoCategories}
                            isActive={rootControl === ROOT_CONTROL.INFO_CATEGORIES}
                            gap={2}
                            initialActiveIndex={0}
                            nativeControle={true}
                            bufferStart={5}
                            rowItemsCount={2}
                            onUp={onUp}
                            activeIndex={activeIndex}
                            onIndexChange={(index : number) => setActiveIndex(index)}
                            onOk={(item) => onOk(item)}
                            itemWidth={getDimensions().width}
                            itemHeight={getDimensions().height}
                            scrollOffset={getDimensions().height}
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
                                data={infoCategories}
                                width={160}
                                // height={85}
                                dimension='vh'
                                type={'list-movies'}
                                listType={'grid'}
                                renderItem={({ item, style, isActive, key }: {
                                    item: ICategory,
                                    style: React.CSSProperties,
                                    isActive: boolean,
                                    key: React.Key
                                }) => (
                                    <div onClick={() => onOk(item)} key={key} className={`infoCategory__item ${isActive ? 'active' : ''}`} style={{
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
        </QueryWrapper>
    )


}

export default memo(Categories) 