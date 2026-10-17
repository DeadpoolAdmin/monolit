import React, { forwardRef, useEffect } from 'react'


const DurationTime = ({ progressRef, currentTimeRef, durationRef, progressInnerRef }) => {

  const handleDurationTimeClick = (e) => {
    e.stopPropagation(); // Prevent clicks on duration/progress area from bubbling up
  };

  return (
    <div className='control__duration__time' onClick={handleDurationTimeClick}>
      <div className='control__duration__line'>
        <div className="control__duration__line__progress" ref={progressRef}>
          <div className="control__duration__line__progress__inner" ref={progressInnerRef}></div>
        </div>
      </div>
      <div className="times">
        <span ref={currentTimeRef}>00:00:00</span>
        <span ref={durationRef}>00:00:00</span>
      </div>

    </div>
  )
}

export default DurationTime