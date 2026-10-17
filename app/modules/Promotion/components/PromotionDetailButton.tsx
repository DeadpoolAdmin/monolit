import React from 'react'

const PromotionDetailButton = ({ active,  onDetails }: { active: boolean, onDetails: () => void }) => {
  return (
    <div className={`promotion__detail__button ${active ? 'active' : ''}`} onClick={onDetails}>
      <div className='promotion__detail'>
        <span>Details</span>
      </div>
    </div>
  )
}

export default PromotionDetailButton