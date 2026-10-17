import React from 'react'
import { Outlet } from 'react-router-dom'

import '@/modules/RoomControl/styles/index.scss'

const RoomControlContainer = () => {
  return (
    <div className='room_control__container'>
      <Outlet />
    </div>
  )
}

export default RoomControlContainer