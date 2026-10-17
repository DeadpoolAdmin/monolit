import { setRootControl } from '@/slices/RootControlSlice';
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import Categories from '@modules/InfoCenter/components/Categories';

const Information = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setRootControl(ROOT_CONTROL.INFO_CATEGORIES))
    }, [])

    return (
        <div className='information'>
            <Categories />
        </div>
    )
}

export default Information