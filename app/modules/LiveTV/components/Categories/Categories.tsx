import { useResolution } from '@hotel-smarters/resolution-hook'
import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { ListView } from 'smarters-ino-ui-tv'
import 'smarters-ino-ui-tv/dist/main.css'
import { useNavigate } from 'react-router-dom'
import ICategories from '../../types/categories.interface'
import { setSelectedCategory } from '@/slices/LiveTV/selectedCategory'
import { setRootControl } from '@/slices/RootControlSlice'
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL'
import CategoryItem from './CategoryItem'


const ListStyles = {
    width: 63,
    height: 15,
    gap: 3
}

const Categories = ({ categories }: { categories: ICategories[] }) => {
    const rootControl = useSelector((state: any) => state.rootControl.rootControl)

    const dispatch = useDispatch()

    const [activeIndex, setActiveIndex] = useState(0);

    const { getDeviceType } = useResolution()

    const deviceType = getDeviceType()


    const navigate = useNavigate();

    const onBack = useCallback(() => {
        if (activeIndex === 0) {

            if(window.Android) {
                // window.Android.destroyPlayer();
            }

            navigate(-1);
        } else {
            setActiveIndex(0);
        }
    }, [setActiveIndex, navigate, activeIndex])

    const openCategoryChannels = useCallback((item: ICategories) => {
        // Set the selected category to show its channels
        dispatch(setSelectedCategory(item))
    }, [dispatch])

    return (

        deviceType === 'TV' ? (
            <ListView
                data={categories}
                isActive={rootControl === ROOT_CONTROL.LIVETV_CONTENT}
                id="live-tv-channels"
                uniqueKey="live-tv-channels"
                listType='vertical'
                nativeControle={true}
                itemsCount={6}
                itemsTotal={categories.length}
                buffer={5}
                itemWidth={ListStyles.width}
                itemHeight={ListStyles.height}
                initialActiveIndex={0}
                onBackScrollIndex={null}
                startScrollIndex={0}
                onOk={openCategoryChannels}
                direction="ltr"
                gap={5}
                onBack={onBack}
                activeIndex={activeIndex}
                onIndexChange={(index) => setActiveIndex(index)}
                rowGap={5}
                onUp={() => {
                    dispatch(setRootControl(ROOT_CONTROL.LIVETV_HEADER))
                }}

                onLeft={() => { }}
                onRight={() => { }}
                renderItem={({ style, item, isActive, key }) => {
                    return (
                        <CategoryItem
                            style={style}
                            item={item}
                            isActive={isActive}
                            key={key}
                        />
                    )
                }}
            />
        ) : (
            <></>
        )

    )
}

export default Categories