import React from 'react'
import { Outlet } from 'react-router-dom'

import '../styles/index.scss'

const NotificationContainer = () => {
  return (
    <div className='notification'>
        <Outlet />
    </div>
  )
}

export default NotificationContainer