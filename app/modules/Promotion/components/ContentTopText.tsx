import React from 'react'
import { useSelector } from 'react-redux'

const ContentTopText = () => {
  const promotion = useSelector((state: any) => state?.promotionData?.data);

  return (
    <div className='content__top_text'>
      <span className='title'><></></span>
      <span className='time'>{new Date(promotion?.updatedAt).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}</span>
    </div>
  )
}

export default ContentTopText