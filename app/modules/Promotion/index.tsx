import React from 'react'

import { useResolution } from '@hotel-smarters/resolution-hook';
import { usePromotionData } from './hooks/usePromotionData';
import { useOnHideNotify } from './hooks/useHideOnNotify';
import PromotionContent from './components/PromotionContent';

import './styles/index.scss'
import { useExternalPromotionData } from './hooks/useExternalPromotionData';

const Promotion = ({ data } : { data?: any }) => {
  const { getDeviceType } = useResolution();
  const { promotionData } = useExternalPromotionData();
  
  // Use external data if no prop data is provided
  const effectiveData = data || promotionData;

  usePromotionData(effectiveData);


  const deviceType = getDeviceType();

  useOnHideNotify();

  return (
    <div className={`promotion ${deviceType === 'TABLET' ? 'fade-top' : 'fade-right'}`} style={{
      left: deviceType === 'TABLET' ? '50%' : undefined,
      transform: deviceType === 'TABLET' ? 'translateX(-50%, 0)' : undefined,
      right: deviceType === 'TV' ? '3.7rem' : undefined,
    }}>
     {effectiveData && <PromotionContent />}
    </div>
  )
}

export default Promotion