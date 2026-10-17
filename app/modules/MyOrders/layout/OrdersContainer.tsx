import React from 'react'

import '../styles/index.scss'
import { Outlet } from 'react-router-dom'

const OrdersContainer = () => {
  return (
    <div className='orders'>
        <Outlet />
    </div>
  )
}

export default OrdersContainer