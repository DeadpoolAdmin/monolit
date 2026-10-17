import React, { memo } from 'react'
import PromotionContentImage from './PromotionContentImage'
import PromotionContentText from './ProductContentText'


const PromotionContent = () => {

  return (
    <div className='promotion__content'>
        <PromotionContentImage />
        <PromotionContentText />
    </div>
  )
}

export default memo(PromotionContent) 