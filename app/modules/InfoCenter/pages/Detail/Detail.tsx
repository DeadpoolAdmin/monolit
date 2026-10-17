import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL';
import { useKeydown } from '@hotel-smarters/use-key-down-control';
import React, { memo, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CategoryDetailImage from '../../components/CategoryDetailImage';
import CategoryDetailContent from '../../components/CategoryDetailContent';
import { setPrevRootControl, setRootControl } from '@/slices/RootControlSlice';
import { useDispatch } from 'react-redux';


const Detail = () => {
    const rootControl = useSelector((state: any) => state.rootControl.rootControl)

    const infoDetail = useMemo(() => JSON.parse(localStorage.getItem('infoDetail') as string), []);

    const navigate = useNavigate();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setRootControl(ROOT_CONTROL.INFO_DETAIL))
    }, [dispatch])

    // Memoize the controls object to prevent unnecessary re-renders
    const controls = {
        id: 'detail-control',
        isActive: rootControl === ROOT_CONTROL.INFO_DETAIL,
        back: () => {
            navigate(-1)
        },
        up: () => {
            dispatch(setPrevRootControl(rootControl))
            dispatch(setRootControl(ROOT_CONTROL.HEADER_BACK))
        }
    };

    useKeydown(controls)



    // Memoize the category data to prevent unnecessary re-renders of child components
    const categoryData = useMemo(() => {        
        if (!infoDetail) return null;

        return {
            image: infoDetail.featuredImage,
            description: infoDetail.description,
            title: infoDetail.title
        };
    }, [infoDetail]);

    return (
        infoDetail && categoryData && (
            <div className='information'>
                <div className="category__detail">
                    <CategoryDetailImage image={categoryData.image} />
                    <CategoryDetailContent
                        description={categoryData.description}
                        title={categoryData.title}
                    />
                </div>
            </div>
        )
    )
}

export default memo(Detail) 