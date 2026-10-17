import React, { useEffect } from 'react'
import { FaPlay } from "react-icons/fa";
import { IoVolumeHighSharp } from "react-icons/io5";

import { FaPause } from "react-icons/fa";



const Controls = ({ ref, playing, onPause, onPlay }) => {

  const handlePlayClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    if (onPlay) {
      onPlay();
    }
  };

  const handlePauseClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    if (onPause) {
      onPause();
    }
  };

  const handleControlsClick = (e) => {
    e.stopPropagation(); // Prevent clicks on controls area from bubbling up
  };

  return (
    <div className='control__controls' ref={ref} onClick={handleControlsClick}>
      <div className="controls__left">
        <div className="left__play__pause">
          {
            playing ? <FaPause onClick={handlePauseClick} /> : <FaPlay onClick={handlePlayClick} />
          }
        </div>
      </div>
    </div>
  )
}

export default Controls