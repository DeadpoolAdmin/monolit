import React from 'react'
import ContentTopText from './ContentTopText'
import ContentButtomText from './ContentButtomText'
import PromotionButtons from './PromotionButtons'

const PromotionContentText = () => {
  return (
    <div className="promotion__content__text">
        <ContentTopText />
        <ContentButtomText />
        <PromotionButtons />
    </div>
    
  )
}

export default PromotionContentText