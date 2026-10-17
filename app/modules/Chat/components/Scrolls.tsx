import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL';
import React, { memo } from 'react'
import { CiCircleChevDown, CiCircleChevUp } from "react-icons/ci";
import { useSelector } from 'react-redux';
import { useScrollControls } from '../hooks/useScrollControls';

const Scrolls = ({ ref }: { ref: React.RefObject<HTMLDivElement> }) => {
  const rootControl = useSelector((state : any) => state.rootControl.rootControl);

  const { index, clickToScrollDown, clickToScrollUp } = useScrollControls();

  return (
    <div className='scrolls' ref={ref}>
      <div className="scrolls__up" onClick={clickToScrollUp}>
        <CiCircleChevUp className={`scrolls_up__icon ${index == 0 && rootControl === ROOT_CONTROL.CHAT_SCROLL ? 'active' : ''}`} />
      </div>
      <div className="scrolls__down" onClick={clickToScrollDown}>
        <CiCircleChevDown className={`scrolls_down__icon ${index == 1 && rootControl === ROOT_CONTROL.CHAT_SCROLL ? 'active' : ''}`} />
      </div>
    </div>
  )
}

export default memo(Scrolls) 