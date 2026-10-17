import React from 'react'
import { Outlet } from 'react-router-dom'

import '../styles/index.scss'


const AlarmContainer = () => {
  return (
    <div className='alarm__container'>
        <Outlet />
    </div>
  )
}

export default AlarmContainer