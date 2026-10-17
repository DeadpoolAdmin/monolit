import React from 'react'
import errorImg from '@assets/smarters.png'
import { useSelector } from 'react-redux';
import { useGenerateUrl } from '@hotel-smarters/generatefileurl';

const PromotionContentImage = () => {
  const promotion = useSelector((state: any) => state?.promotionData?.data);

  const { getUrl } = useGenerateUrl(process.env.REACT_APP_API_HOST || '');

  return (
    <div className='promotion__content_image'>
      <img src={getUrl(promotion?.image)} onError={(e) => { e.currentTarget.src = errorImg }} alt="promotion-img" />
    </div>
  )
}

export default PromotionContentImage