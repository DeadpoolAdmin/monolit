import React, { useEffect, useMemo, useCallback, useRef } from 'react'

import { useKeydown } from '@hotel-smarters/use-key-down-control';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useResolution } from '@hotel-smarters/resolution-hook';
import { useNavigate } from 'react-router-dom';
import { usePolyfillSearchParams } from '@hotel-smarters/polyfill-search-params';
import { ISeasons } from '../types/seasons.interface';
import { changeSelectedSeason, setIsSeasonsOpen } from '@/slices/Movies/MovieDetailSlice';
import { setRootControl } from '@/slices/RootControlSlice';
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL';
import { CustomSelect } from './CustomSelect';

type PSeason = {
    seasons: ISeasons[]
}




const Seasons: React.FC<PSeason> = React.memo(({ seasons }) => {
    // refs
    const customSelectRef = useRef<{ selectHighlighted: () => void; navigateUp: () => void; navigateDown: () => void; getCurrentHighlighted: () => any }>(null);

    // selectors
    const rootControl = useSelector((state: any) => state.rootControl.rootControl)

    const { getDeviceType } = useResolution();

    const deviceType = getDeviceType();

    // dispatch 
    const dispatch = useDispatch();

    const [open, setOpen] = React.useState(false);
    const [selectedOption, setSelectedOption] = React.useState<{ label: string, value: string, id: string } | null>(null);

    useEffect(() => {
        dispatch(setIsSeasonsOpen(open))
    }, [open])

    const navigate = useNavigate();

    const searchParams = usePolyfillSearchParams();

    const controls = {
        isActive: rootControl === ROOT_CONTROL.MOVIES_SEASONS,
        id: 'seasons',

        ok: () => {
            if (!open) {
                setOpen(true);
            } else {
                // Select the highlighted option
                if (customSelectRef.current) {
                    customSelectRef.current.selectHighlighted();
                    setOpen(false);
                }
            }
        },

        up: () => {
            if (!open) {
                dispatch(setRootControl(ROOT_CONTROL.MOVIES_PLAY))
                const detailRef = document.querySelector('.movie__detail__main') as HTMLDivElement
                if (detailRef) {
                    detailRef.style.transform = 'translateY(0)'
                }
            } else {
                // Navigate up in the select
                if (customSelectRef.current) {
                    customSelectRef.current.navigateUp();
                }
            }
        },

        down: () => {
            if (!open) {
                const episodeItem = document.querySelector('.episode__item')
                const movie__detail__main = document.querySelector('.movie__detail__main') as HTMLDivElement

                if (episodeItem) {
                    dispatch(setRootControl(ROOT_CONTROL.MOVIE_EPISODES))

                    if (movie__detail__main) {
                        movie__detail__main.style.transform = 'translateY(-45rem)'
                    }
                }
            } else {
                // Navigate down in the select
                if (customSelectRef.current) {
                    customSelectRef.current.navigateDown();
                }
            }
        },

        back: () => {
            if (!open) {
                const search = searchParams.toString();
                navigate(`/menu/vod${search ? `?${search}` : ''}`)
                return
            }
            setOpen(false)
        }
    }

    useKeydown(controls)

    // season options - memoized to prevent infinite loops
    const seasonOptions = useMemo(() => seasons.map(season => ({
        label: season.title.en,
        value: season.title.en,
        id: season._id,
    })), [seasons])

    // handleChange - memoized to prevent unnecessary re-renders
    const handleChange = useCallback((selected: { label: string, value: string, id: string }) => {
        setSelectedOption(selected)
    }, [])

    // useEffect to dispatch initial value selectedSeason
    useEffect(() => {
        dispatch(changeSelectedSeason(selectedOption?.id))
    }, [selectedOption])

    useEffect(() => {
        if (seasonOptions.length > 0) {
            setSelectedOption(seasonOptions[0])
        }
    }, [seasonOptions])

    // Toggle handler for custom select
    const handleToggle = useCallback(() => {
        setOpen(!open)
    }, [open]);

    return (
        seasonOptions && seasonOptions.length > 0 && seasonOptions[0].label &&

        <div className='seasons'>
            <CustomSelect
                ref={customSelectRef}
                options={seasonOptions}
                value={selectedOption}
                onChange={handleChange}
                isOpen={open}
                onToggle={handleToggle}
                isActive={rootControl === ROOT_CONTROL.MOVIES_SEASONS}
                deviceType={deviceType}
                placeholder="Select Season"
            />
        </div>
    )
})

export default Seasons