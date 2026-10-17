import React from 'react'
import { Outlet } from 'react-router-dom'

import '../styles/index.scss'

const ActivationMobileContainer = () => {
  return (
    <div className='activation__mobile__container'>
        <Outlet />
    </div>
  )
}

export default ActivationMobileContainer