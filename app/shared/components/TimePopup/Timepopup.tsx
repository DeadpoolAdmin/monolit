import React, { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { useKeydown } from '@hotel-smarters/use-key-down-control'

import { Popup } from '@shared/components/Popup';
import { setRootControl } from '@/slices/RootControlSlice';
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL';
import TimePopupTitle from './TimePopupTitle';
import TimePopupDatePicker from './TimePopupDatePicker';
import TimePopupButtons from './TimePopupButtons';

interface TimePopupProps {
    timePopup: boolean;
    setTimePopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const TimePopup = React.memo<TimePopupProps>(({ setTimePopup, timePopup }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES_POPUP_CONFIRM))

        return () => {
            dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES_CART_ADD))
        }
    }, [dispatch])

    const controls = useMemo(() => ({
        isActive: timePopup,
        id: 'time-popup-controls',
        back: () => {
            setTimePopup(false);
        }
    }), [timePopup, setTimePopup]);

    useKeydown(controls);

    return (
        <Popup
            isOpen={timePopup}
            closable={true}
            onClose={() => setTimePopup(false)}
            keyboardControls={controls}
            className="popup"
            contentClassName="popup__content"
            contentStyle={{
                width: "172.1rem",
                height: "91.7rem"
            }}
            overlayOpacity={0.6}
        >
            <TimePopupTitle />
            <TimePopupDatePicker />
            <TimePopupButtons setTimePopup={setTimePopup} />
        </Popup>
    )
})

TimePopup.displayName = 'TimePopup'

export default TimePopup