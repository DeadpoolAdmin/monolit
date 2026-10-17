import React from 'react'
import { Outlet } from 'react-router-dom'

import '../styles/index.scss'

const MusicContainer = () => {
  return (
    <div className='music__container'>
        <Outlet />
    </div>
  )
}

export default MusicContainer