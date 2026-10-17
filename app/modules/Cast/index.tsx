import { useKeydown } from '@hotel-smarters/use-key-down-control'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import './styles/index.scss'
import CastTitle from './components/CastTitle'
import CastCards from './components/CastCards'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL'
import { setPrevRootControl, setRootControl } from '@/slices/RootControlSlice'

const Cast = () => {
    const navigate = useNavigate();

    const rootControl = useSelector((state: any) => state.rootControl.rootControl)

    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(setRootControl(ROOT_CONTROL.CAST))
    }, [dispatch])

    const controls = {
        isActive: rootControl === ROOT_CONTROL.CAST,
        id: 'cast',
        back: () => {
            navigate('/menu');
        },
        up: () => {
            dispatch(setPrevRootControl(rootControl))
            dispatch(setRootControl(ROOT_CONTROL.HEADER_BACK))
        }
    }

    useKeydown(controls)

    return (
        <div className='cast'>
            <div className="cast__content">
                <CastTitle />
                <CastCards />
            </div>

        </div>
    )
}

export default Cast