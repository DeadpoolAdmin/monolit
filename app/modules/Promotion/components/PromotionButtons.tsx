import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import PromotionCloseButton from './PromotionCloseButton';
import PromotionDetailButton from './PromotionDetailButton';
import { useActivePromotion } from '../hooks/useActivePromotion';
import { useResolution } from '@hotel-smarters/resolution-hook';

const PromotionButtons = () => {
  const { index, isActive, onDetails } = useActivePromotion();

  const promotion = useSelector((state: any) => state?.promotionData?.data);

  const deviceType = useResolution().getDeviceType();

  return (
    <div className='promotion__buttons'>
      {
        promotion?.type !== 'custom' && promotion?.remoteId ? <PromotionDetailButton onDetails={onDetails} active={deviceType === 'TV' && isActive && index == 1} /> : <div></div>
      }

      <PromotionCloseButton active={deviceType === 'TV' && isActive && index == 2} />
    </div>
  )
}

export default memo(PromotionButtons) 